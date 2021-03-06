import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Logger,
    ParseArrayPipe,
    Post,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiNotAcceptableResponse,
    ApiOperation,
} from "@nestjs/swagger";
import {
    INVITATION_OR_JOIN_TYPE,
    NOTIFICATION_INDICATOR_ICON,
    USER_ROLE,
} from "@schoolacious/types";
import Invitations_Joins from "../database/entity/invitations_or_joins.entity";
import Notifications from "../database/entity/notifications.entity";
import School from "../database/entity/schools.entity";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { NotificationService } from "../notification/notification.service";
import { isAdministrative } from "../utils/helper-functions.util";
import CancelInvitationJoinDTO from "./dto/cancel-invitation-join.dto";
import CompleteInvitationJoinDTO from "./dto/complete-invitation-join.dto";
import InvitationJoinDTO, { InvitationDTO, JoinDTO } from "./dto/invitation-join.dto";
import { InvitationJoinService } from "./invitation-join.service";

type UserWithSchool = Omit<User, "school"> & {
    school: School;
};

@Controller("invitation-join")
@ApiBearerAuth()
export class InvitationJoinController {
    logger = new Logger(InvitationJoinController.name);
    constructor(
        private readonly invitationJoinService: InvitationJoinService,
        private readonly notificationService: NotificationService,
    ) {}
    /**
     * @deprecated in favor of `invite` & `join`
     */
    @Post()
    @ApiOperation({
        deprecated: true,
    })
    async inviteJoinUser(
        @Body() { type, ...body }: InvitationJoinDTO,
        @CurrentUser() user: User,
    ) {
        try {
            if (
                type === INVITATION_OR_JOIN_TYPE.invitation &&
                body.user_id &&
                isAdministrative(user.role)
            ) {
                delete body.school_id;
                return await this.invitationJoinService.invite({
                    ...body,
                    user_id: body.user_id,
                    school: user.school!,
                });
            } else if (type === INVITATION_OR_JOIN_TYPE.join && body.school_id) {
                delete body.user_id;
                return await this.invitationJoinService.join(
                    {
                        ...body,
                        school_id: body.school_id,
                    },
                    user,
                );
            } else {
                throw new ForbiddenException("wrong credentials");
            }
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Post("/invite")
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    @ApiForbiddenResponse({ description: "Wrong credentials" })
    @ApiNotAcceptableResponse({ description: "already joined a school" })
    @ApiBody({ type: [InvitationDTO] })
    async inviteUsers(
        @Body(new ParseArrayPipe({ items: InvitationDTO })) body: InvitationDTO[],
        @CurrentUser() { school }: UserWithSchool,
    ): Promise<Omit<Invitations_Joins, "school">[]> {
        try {
            const invitations = await this.invitationJoinService.sendInvitations(
                body,
                school,
            );
            const notificationsPayload: Partial<Notifications>[] = invitations.map(
                (invitation) => ({
                    description: `You got an invitation from ${school.name} to join the school as a ${invitation.role}`,
                    open_link: "/user/configure/invitations",
                    owner_id: school._id,
                    receiver: invitation.user,
                    title: "Got an Invitation",
                    type_indicator_icon: NOTIFICATION_INDICATOR_ICON.gotInvitation,
                    avatar_url: "N/A",
                }),
            );
            const notifications = await this.notificationService.create(
                notificationsPayload,
            );
            for (const notification of notifications) {
                Object.assign(notification, { receiver: undefined });
                await this.notificationService.sendNotification(
                    notification.receiver._id,
                    notification,
                );
            }
            return invitations.map((invitation) => ({
                ...invitation,
                school: undefined,
            }));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
    @Post("/join")
    @ApiForbiddenResponse({ description: "Wrong credentials" })
    @ApiNotAcceptableResponse({ description: "already joined a school" })
    async joinSelf(@Body() body: JoinDTO, @CurrentUser() user: User) {
        try {
            const joinRequests = await this.invitationJoinService.join(body, user);
            return joinRequests;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Post("complete")
    @ApiNotAcceptableResponse({ description: "already joined a school meanwhile" })
    async completeInvitationJoin(
        @CurrentUser() user: User,
        @Body() body: CompleteInvitationJoinDTO,
    ) {
        try {
            return await this.invitationJoinService.complete({ ...body, user });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Delete()
    @ApiForbiddenResponse({ description: "Wrong credentials" })
    async cancelInvitationJoin(
        @Body() body: CancelInvitationJoinDTO,
        @CurrentUser() user: User,
    ) {
        try {
            return this.invitationJoinService.cancel({ ...body, user });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }
}

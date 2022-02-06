import {
    Body,
    Controller,
    Post,
    Get,
    Param,
    Put,
    Query,
    ParseBoolPipe,
    DefaultValuePipe,
    Logger,
} from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { USER_ROLE, INVITATION_OR_JOIN_TYPE } from "@schoolacious/types";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import { InvitationJoinService } from "../invitation-join/invitation-join.service";
import AddCoAdminDTO from "./dto/add-co-admin.dto";
import CreateSchoolDTO from "./dto/create-school.dto";
import { SchoolService } from "./school.service";
import { UserService } from "../user/user.service";
import { VerifiedSchoolUser } from "../subject/subject.controller";

@Controller("school")
@ApiBearerAuth()
export class SchoolController {
    logger = new Logger(SchoolController.name);
    constructor(
        private readonly schoolService: SchoolService,
        private readonly userService: UserService,
        private readonly invitationJoinService: InvitationJoinService,
    ) {}

    @Get()
    @ApiQuery({ name: "q", required: false })
    @ApiQuery({ name: "no-invite-join", required: false })
    async getOrQuerySchools(
        @CurrentUser() user: User,
        @Query("no-invite-join", new DefaultValuePipe(false), ParseBoolPipe)
        noInvitationJoin: boolean,
        @Query("q") query?: string,
    ) {
        try {
            const selected = this.schoolService
                .queryBuilder("school")
                .select()
                .limit(20)
                .offset(0);
            if (query)
                selected.andWhere("school.query_common @@ to_tsquery(:query)", {
                    query: `'${query}':*`,
                });
            if (noInvitationJoin)
                selected
                    .leftJoinAndMapOne(
                        "school.invitation_join",
                        "school.invitations_joins",
                        "invitation_join",
                        "invitation_join.user = :user",
                        { user: user._id },
                    )
                    .andWhere(
                        "invitation_join.user IS NULL OR invitation_join.user <> :user",
                        { user: user._id },
                    );
            const schools = await selected.getMany();

            return schools.map((s) => ({ ...s, invitation_join: undefined }));
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get(":school")
    @ApiNotFoundResponse({ description: "passed {school} doesn't exist" })
    async getSchool(@Param("school") short_name: string) {
        try {
            return await this.schoolService.findOne(
                { short_name },
                {
                    relations: ["admin", "coAdmin1", "coAdmin2"],
                },
            );
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get(":school/join-requests")
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    @ApiParam({ name: "school" })
    async getSchoolJoinRequests(@CurrentUser() user: VerifiedSchoolUser) {
        try {
            return this.invitationJoinService.getSchoolInvitationJoin({
                _id: user.school._id,
                type: INVITATION_OR_JOIN_TYPE.join,
            });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Get(":school/invitations")
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    @ApiParam({ name: "school" })
    async getSchoolSentInvitations(@CurrentUser() user: VerifiedSchoolUser) {
        try {
            return this.invitationJoinService.getSchoolInvitationJoin({
                _id: user.school._id,
                type: INVITATION_OR_JOIN_TYPE.invitation,
            });
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Post()
    async createSchool(
        @CurrentUser() user: VerifiedSchoolUser,
        @Body() body: CreateSchoolDTO,
    ) {
        try {
            const school = await this.schoolService.createSchool({
                admin: user,
                ...body,
            });

            return school;
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    @Put(":school/co-admin")
    @VerifySchool()
    @Roles(USER_ROLE.admin)
    @ApiParam({ name: "school" })
    async addCoAdmin(@Body() body: AddCoAdminDTO, @CurrentUser() user: User) {
        try {
            return await this.schoolService.assignCoAdmin({ ...body, user });
        } catch (error: any) {
            this.logger.log(error);
            throw error;
        }
    }

    @Get(":school/members")
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    @ApiParam({ name: "school" })
    async getAllMembers(@CurrentUser() user: User) {
        try {
            return await this.userService.find({ school: user.school });
        } catch (error: any) {
            this.logger.log(error);
            throw error;
        }
    }
}

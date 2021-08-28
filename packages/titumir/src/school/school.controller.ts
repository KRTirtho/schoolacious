import {
    Body,
    Controller,
    Logger,
    Post,
    Get,
    Param,
    Put,
    Inject,
    Query,
    ParseBoolPipe,
    DefaultValuePipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiQuery } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { USER_ROLE, INVITATION_OR_JOIN_TYPE } from "@veschool/types";
import User from "../database/entity/users.entity";
import { CurrentUser } from "../decorator/current-user.decorator";
import { Roles } from "../decorator/roles.decorator";
import { VerifySchool } from "../decorator/verify-school.decorator";
import { InvitationJoinService } from "../invitation-join/invitation-join.service";
import AddCoAdminDTO from "./dto/add-co-admin.dto";
import CreateSchoolDTO from "./dto/create-school.dto";
import { SchoolService } from "./school.service";
import { UserService } from "../user/user.service";

@Controller("school")
@ApiBearerAuth()
export class SchoolController {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
        private readonly schoolService: SchoolService,
        private readonly userService: UserService,
        private readonly invitationJoinService: InvitationJoinService,
    ) {
        this.logger.setContext(SchoolController.name);
    }

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
                    query: `${query}:*`,
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
            if ("invitation_join" in schools) delete (schools as any)?.invitation_join;
            return schools;
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
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
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Get(":school/join-requests")
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    async getSchoolJoinRequests(@CurrentUser() user: User, @Param("school") _?: string) {
        try {
            return this.invitationJoinService.getSchoolInvitationJoin({
                _id: user.school!._id,
                type: INVITATION_OR_JOIN_TYPE.join,
            });
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Get(":school/invitations")
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    async getSchoolSentInvitations(
        @CurrentUser() user: User,
        @Param("school") _?: string,
    ) {
        try {
            return this.invitationJoinService.getSchoolInvitationJoin({
                _id: user.school!._id,
                type: INVITATION_OR_JOIN_TYPE.invitation,
            });
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Post()
    async createSchool(@CurrentUser() user: User, @Body() body: CreateSchoolDTO) {
        try {
            const school = await this.schoolService.createSchool({
                admin: user,
                ...body,
            });
            return school;
        } catch (error: any) {
            this.logger.error(error?.message ?? "");
            throw error;
        }
    }

    @Put(":school/co-admin")
    @VerifySchool()
    @Roles(USER_ROLE.admin)
    async addCoAdmin(
        @Body() body: AddCoAdminDTO,
        @CurrentUser() user: User,
        @Param("school") _?: string,
    ) {
        try {
            return await this.schoolService.assignCoAdmin({ ...body, user });
        } catch (error: any) {
            this.logger.log(error?.message ?? "");
            throw error;
        }
    }

    @Get(":school/members")
    @VerifySchool()
    @Roles(USER_ROLE.admin, USER_ROLE.coAdmin)
    async getAllMembers(@CurrentUser() user: User, @Param("school") _?: string) {
        try {
            return await this.userService.find({}, { where: { school: user.school } });
        } catch (error: any) {
            this.logger.log(error?.message ?? "");
            throw error;
        }
    }
}

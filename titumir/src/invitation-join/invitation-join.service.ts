import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService, {
    PartialKey,
} from "../database/abstracts/entity-service.abstract";
import Invitations_Joins, {
    INVITATION_OR_JOIN_ROLE,
    INVITATION_OR_JOIN_TYPE,
} from "../database/entity/invitations_or_joins.entity";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { SchoolService } from "../school/school.service";
import { UserService } from "../user/user.service";
import { isAdministrative } from "../utils/helper-functions.util";

export interface InviteJoinPayload {
    role: INVITATION_OR_JOIN_ROLE;
    school: School;
    user: User;
    type: INVITATION_OR_JOIN_TYPE;
}

type CreateInvitationJoin = PartialKey<Invitations_Joins, "_id" | "created_at">;

export enum INVITATION_OR_JOIN_ACTION {
    accept = "accept",
    reject = "reject",
}

interface GetInvitationJoin {
    _id: string;
    type: INVITATION_OR_JOIN_TYPE;
}

@Injectable()
export class InvitationJoinService extends BasicEntityService<
    Invitations_Joins,
    CreateInvitationJoin
> {
    constructor(
        @InjectRepository(Invitations_Joins)
        private readonly invitationJoinRepo: Repository<Invitations_Joins>,
        private readonly userService: UserService,
        private readonly schoolService: SchoolService,
    ) {
        super(invitationJoinRepo);
    }

    checkUserHasSchool(user: User) {
        if (user.role !== null && user.school) {
            throw new NotAcceptableException("user already has joined a school");
        }
    }

    createInvitationJoin(payload: CreateInvitationJoin): Promise<Invitations_Joins>;
    createInvitationJoin(payload: CreateInvitationJoin[]): Promise<Invitations_Joins[]>;

    createInvitationJoin(payload: CreateInvitationJoin | CreateInvitationJoin[]) {
        if (Array.isArray(payload)) {
            payload.forEach(({ user }) => {
                this.checkUserHasSchool(user);
            });
            return super.create(payload);
        }
        this.checkUserHasSchool(payload.user);
        return super.create(payload);
    }

    async invite(
        payload: Omit<InviteJoinPayload, "type" | "user"> & { user_id: string },
    ): Promise<Invitations_Joins> {
        const user = await this.userService.findOne(
            {
                _id: payload.user_id,
            },
            { relations: ["school"] },
        );
        return this.createInvitationJoin({
            type: INVITATION_OR_JOIN_TYPE.invitation,
            ...payload,
            user,
        });
    }

    async join(
        payload: Omit<InviteJoinPayload, "type" | "school"> & { school_id: string },
    ): Promise<Invitations_Joins> {
        const school = await this.schoolService.findOne({
            _id: payload.school_id,
        });
        return this.createInvitationJoin({
            type: INVITATION_OR_JOIN_TYPE.join,
            ...payload,
            school,
        });
    }

    async cancel({ _id, user }: { _id: string; user: User }) {
        const invitationJoin = await this.findOne(
            { _id },
            {
                relations: ["user", "school"],
            },
        );

        const { type, school, user: requestedUser } = invitationJoin;

        // for a join-request cancellation user of the invitation card must
        // be the current user
        // for a invitation cancellation current user must be an
        // admin/co-admin & their school _id should match with current user's
        // school's _id
        if (
            (type === INVITATION_OR_JOIN_TYPE.join && user._id !== requestedUser._id) ||
            (type === INVITATION_OR_JOIN_TYPE.invitation &&
                (!isAdministrative(user.role) || school._id !== user.school?._id))
        ) {
            throw new ForbiddenException("wrong credentials");
        }

        delete (invitationJoin as any).created_at;

        const deleted = await this.invitationJoinRepo.delete(invitationJoin);
        if (deleted.affected !== 1) {
            throw new InternalServerErrorException(
                undefined,
                "cancelling invitation has failed",
            );
        }
        return { message: "Cancelled invitation/join-request" };
    }

    async complete({
        _id,
        action,
        user,
    }: {
        user: User;
        _id: string;
        action: INVITATION_OR_JOIN_ACTION;
    }): Promise<{ message: string }> {
        const invitation = await this.findOne({ _id }, { relations: ["school", "user"] });

        const { role, school, user: requestedUser, type } = invitation;
        // for a invitation completion user of the invitation card must match
        // for a join request completion current user must be an
        // admin/co-admin & their school _id should match with the requested
        // school's _id
        if (
            (type === INVITATION_OR_JOIN_TYPE.invitation &&
                user._id !== requestedUser._id) ||
            (type === INVITATION_OR_JOIN_TYPE.join &&
                (!isAdministrative(user.role) || school._id !== user.school?._id))
        )
            throw new ForbiddenException("wrong credentials");

        if (action === INVITATION_OR_JOIN_ACTION.accept) {
            // now check the user if he/she had joined any school meanwhile
            if (requestedUser.role !== null && requestedUser.school !== null)
                throw new NotAcceptableException("user already has a school meanwhile");

            await this.userService.findOneAndUpdate(
                { _id: requestedUser._id },
                {
                    role: (role as unknown) as USER_ROLE,
                    school,
                },
            );
        }
        delete (invitation as any).created_at; // causes issue when deleting
        const deleted = await this.invitationJoinRepo.delete(invitation);
        if (deleted.affected !== 1)
            throw new InternalServerErrorException("failed to complete invitation/join");
        return { message: `${action.valueOf()}ed invitation/join` };
    }

    getUserInvitationsJoin({
        _id,
        type,
    }: GetInvitationJoin): Promise<Invitations_Joins[]> {
        return this.find({}, { where: { user: { _id }, type }, relations: ["school"] });
    }

    getSchoolInvitationJoin({
        _id,
        type,
    }: GetInvitationJoin): Promise<Invitations_Joins[]> {
        return this.find({}, { where: { type, school: { _id } }, relations: ["user"] });
    }
}

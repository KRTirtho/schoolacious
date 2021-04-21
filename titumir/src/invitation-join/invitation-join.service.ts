import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from "typeorm";
import Invitations_Joins, {
  INVITATION_OR_JOIN_ROLE,
  INVITATION_OR_JOIN_TYPE,
} from "../database/entity/invitations_or_joins.entity";
import School from "../database/entity/schools.entity";
import User, { USER_ROLE } from "../database/entity/users.entity";
import { SchoolService } from "../school/school.service";
import { UserService } from "../user/user.service";

export interface InviteJoinPayload {
  role: INVITATION_OR_JOIN_ROLE;
  school: School;
  user: User;
  type: INVITATION_OR_JOIN_TYPE;
}

export enum INVITATION_OR_JOIN_ACTION {
  accept = "accept",
  reject = "reject",
}

interface GetInvitationJoin {
  _id: string;
  type: INVITATION_OR_JOIN_TYPE;
}

@Injectable()
export class InvitationJoinService {
  constructor(
    @InjectRepository(Invitations_Joins)
    private readonly invitationJoinRepo: Repository<Invitations_Joins>,
    private readonly userService: UserService,
    private readonly schoolService: SchoolService
  ) {}

  async create({
    role,
    school,
    type,
    user,
  }: InviteJoinPayload): Promise<Invitations_Joins> {
    if (user.role !== null && user.school !== null) {
      throw new NotAcceptableException("user already has joined a school");
    }
    // checking if user/school already has sent invitation
    // or join requests
    const hasInvitationJoin = await this.invitationJoinRepo.findOne({
      school,
      user,
    });

    if (hasInvitationJoin) {
      throw new NotAcceptableException(
        "user already has/sent invitation/join-request"
      );
    }

    const invitation = new Invitations_Joins();
    Object.assign(invitation, { role, school, user, type });
    return this.invitationJoinRepo.save(invitation);
  }

  async invite(
    payload: Omit<InviteJoinPayload, "type" | "user"> & { user_id: string }
  ): Promise<Invitations_Joins> {
    const user = await this.userService.findUserUnsafe({
      _id: payload.user_id,
    });
    if (!user) throw new NotFoundException("invalid user");
    return this.create({
      type: INVITATION_OR_JOIN_TYPE.invitation,
      ...payload,
      user,
    });
  }

  async join(
    payload: Omit<InviteJoinPayload, "type" | "school"> & { school_id: string }
  ): Promise<Invitations_Joins> {
    const school = await this.schoolService.findSchoolUnsafe({
      _id: payload.school_id,
    });
    if (!school) throw new NotFoundException("invalid school");
    return this.create({
      type: INVITATION_OR_JOIN_TYPE.join,
      ...payload,
      school,
    });
  }

  findOne(
    conditions: FindConditions<Invitations_Joins>,
    options?: FindOneOptions<Invitations_Joins>
  ): Promise<Invitations_Joins> {
    return this.invitationJoinRepo.findOneOrFail(conditions, options);
  }

  findAll(
    conditions: FindConditions<Invitations_Joins>,
    options?: FindManyOptions<Invitations_Joins>
  ): Promise<Invitations_Joins[]> {
    return this.invitationJoinRepo.find({ ...conditions, ...options });
  }

  async cancel({ _id, user }: { _id: string; user: User }) {
    const invitationJoin = await this.invitationJoinRepo.findOne(
      { _id },
      {
        relations: ["user", "school"],
      }
    );

    if (!invitationJoin) throw new NotFoundException("invalid invitation/join");

    const { type, school, user: requestedUser } = invitationJoin;

    // for a join-request cancellation user of the invitation card must
    // be the current user
    // for a invitation cancellation current user must be an
    // admin/co-admin & their school _id should match with current user's
    // school's _id
    if (
      (type === INVITATION_OR_JOIN_TYPE.join &&
        user._id !== requestedUser._id) ||
      (type === INVITATION_OR_JOIN_TYPE.invitation &&
        (![USER_ROLE.admin, USER_ROLE.coAdmin].includes(user.role) ||
          school._id !== user.school._id))
    ) {
      throw new ForbiddenException("wrong credentials");
    }

    delete invitationJoin.created_at;

    const deleted = await this.invitationJoinRepo.delete(invitationJoin);
    if (deleted.affected !== 1) {
      throw new InternalServerErrorException(
        undefined,
        "cancelling invitation has failed"
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
    const invitation = await this.invitationJoinRepo.findOne(
      { _id },
      { relations: ["school", "user"] }
    );

    if (!invitation)
      throw new NotFoundException("invalid invitation/join-request");

    const { role, school, user: requestedUser, type } = invitation;
    if (action === INVITATION_OR_JOIN_ACTION.accept) {
      // for a invitation completion user of the invitation card must match
      // for a join request completion current user must be an
      // admin/co-admin & their school _id should match with the requested
      // school's _id
      if (
        (type === INVITATION_OR_JOIN_TYPE.invitation &&
          user._id !== requestedUser._id) ||
        (type === INVITATION_OR_JOIN_TYPE.join &&
          (![USER_ROLE.admin, USER_ROLE.coAdmin].includes(user.role) ||
            school._id !== user.school._id))
      ) {
        throw new ForbiddenException("wrong credentials");
      }

      // now check the user if he/she had joined any school meanwhile
      if (requestedUser.role && requestedUser.school)
        throw new NotAcceptableException("user already has a school");

      await this.userService.findUserAndUpdate(requestedUser._id, {
        role: (role as unknown) as USER_ROLE,
        school,
      });
    }
    delete invitation.created_at; // causes issue when deleting
    const deleted = await this.invitationJoinRepo.delete(invitation);
    if (deleted.affected < 1)
      throw new InternalServerErrorException(
        "failed to complete invitation/join"
      );
    return { message: `${action}ed invitation/join` };
  }

  getUserInvitationsJoin({
    _id,
    type,
  }: GetInvitationJoin): Promise<Invitations_Joins[]> {
    return this.findAll({ user: { _id }, type }, { relations: ["school"] });
  }

  getSchoolInvitationJoin({
    _id,
    type,
  }: GetInvitationJoin): Promise<Invitations_Joins[]> {
    return this.findAll(
      {
        type,
        school: { _id },
      },
      { relations: ["user"] }
    );
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from "typeorm";
import Invitations_Joins, {
  INVITATION_OR_JOIN_ROLE,
  INVITATION_OR_JOIN_TYPE,
} from "../database/entity/invitations_or_joins.entity";
import { USER_ROLE } from "../database/entity/users.entity";
import { SchoolService } from "../school/school.service";
import { UserService } from "../user/user.service";

export interface InviteJoinPayload {
  role: INVITATION_OR_JOIN_ROLE;
  school_id: string;
  user_id: string;
  type: INVITATION_OR_JOIN_TYPE;
}

export enum INVITATION_OR_JOIN_ACTION {
  accept = "accept",
  reject = "reject",
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
    school_id,
    type,
    user_id,
  }: InviteJoinPayload): Promise<Invitations_Joins> {
    //automatically gonna throw error on no user found
    const user = await this.userService.findUser({ _id: user_id });
    if (user.role !== null && user.school !== null) {
      throw new NotAcceptableException("user already has joined a school");
    }
    //automatically throws error when no school was found
    const school = await this.schoolService.findSchool({ _id: school_id });

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
    payload: Omit<InviteJoinPayload, "type">
  ): Promise<Invitations_Joins> {
    return this.create({
      type: INVITATION_OR_JOIN_TYPE.invitation,
      ...payload,
    });
  }

  async join(
    payload: Omit<InviteJoinPayload, "type">
  ): Promise<Invitations_Joins> {
    return this.create({
      type: INVITATION_OR_JOIN_TYPE.join,
      ...payload,
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

  async cancel({
    _id,
    type,
    school_id,
    user_id,
  }: Partial<Omit<InviteJoinPayload, "role" | "type">> & {
    _id: string;
    type: INVITATION_OR_JOIN_TYPE;
  }) {
    const criteria: FindConditions<Invitations_Joins> = {
      _id,
      type,
    };
    if (
      (type === INVITATION_OR_JOIN_TYPE.invitation && !school_id) ||
      (type === INVITATION_OR_JOIN_TYPE.join && !user_id)
    ) {
      throw new BadRequestException(
        `Required field based on type(${type}) didn't met the expectation`
      );
    } else if (type === INVITATION_OR_JOIN_TYPE.invitation) {
      const { ...school } = await this.schoolService.findSchoolUnsafe({
        _id: school_id,
      });
      if (!school) throw new BadRequestException("invalid school");
      criteria.school = school;
    } else if (type === INVITATION_OR_JOIN_TYPE.join) {
      const { ...user } = await this.userService.findUserUnsafe({
        _id: user_id,
      });
      if (!user) throw new BadRequestException("invalid user");
      criteria.user = user;
    }
    const invitation = await this.invitationJoinRepo.findOne(criteria, {
      relations: ["user", "school"],
    });

    if (!invitation) throw new NotFoundException("invalid invitation/join");

    delete invitation.created_at;

    const deleted = await this.invitationJoinRepo.delete(invitation);
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
  }: {
    _id: string;
    action: INVITATION_OR_JOIN_ACTION;
  }): Promise<DeleteResult> {
    const invitation = await this.findOne(
      { _id },
      { relations: ["school", "user"] }
    );
    const { role, school, user } = invitation;
    if (action === INVITATION_OR_JOIN_ACTION.accept) {
      // not checking if user already has a school/role
      // as it was checked previously while sending the invitation/join
      // request
      await this.userService.findUserAndUpdate(user._id, {
        role: (role as unknown) as USER_ROLE,
        school: school,
      });
    }
    return await this.invitationJoinRepo.delete(invitation);
  }
}

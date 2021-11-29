import { INVITATION_OR_JOIN_ROLE } from "@veschool/types";
import { define } from "typeorm-seeding";
import InvitationJoin from "../entity/invitations_or_joins.entity";

define(InvitationJoin, (faker) => {
    const invitationJoin = new InvitationJoin();

    invitationJoin.role = faker.random.arrayElement(
        Object.values(INVITATION_OR_JOIN_ROLE),
    );

    return invitationJoin;
});

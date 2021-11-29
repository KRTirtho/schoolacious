import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { INVITATION_OR_JOIN_TYPE } from "@veschool/types";
import Invitations_Joins from "../entity/invitations_or_joins.entity";
import School from "../entity/schools.entity";
import User from "../entity/users.entity";

export default class CreateInvitation implements Seeder {
    async run(factory: Factory, connection: Connection): Promise<void> {
        const schools = await connection.manager.getRepository(School).find();

        for (const school of schools) {
            await factory(Invitations_Joins)()
                .map(async (invite) => {
                    invite.school = school;
                    invite.type = INVITATION_OR_JOIN_TYPE.invitation;
                    invite.user = await factory(User)()
                        .map(async (user) => {
                            user.role = null;
                            return user;
                        })
                        .create();
                    return invite;
                })
                .createMany(20);
        }
    }
}

import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { INVITATION_OR_JOIN_TYPE } from "@schoolacious/types";
import Invitations_Joins from "../entity/invitations_or_joins.entity";
import School from "../entity/schools.entity";
import User from "../entity/users.entity";

export default class CreateJoin implements Seeder {
    async run(factory: Factory, connection: Connection): Promise<void> {
        const schools = await connection.manager.getRepository(School).find();

        for (const school of schools) {
            await factory(Invitations_Joins)()
                .map(async (join) => {
                    join.school = school;
                    join.type = INVITATION_OR_JOIN_TYPE.join;
                    join.user = await factory(User)()
                        .map(async (user) => {
                            user.role = null;
                            return user;
                        })
                        .create();
                    return join;
                })
                .createMany(20);
        }
    }
}

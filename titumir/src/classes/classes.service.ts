import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import Class from "../database/entity/classes.entity";

@Injectable()
export class ClassesService extends BasicEntityService<Class> {
    constructor(@InjectRepository(Class) private classRepo: Repository<Class>) {
        super(classRepo);
    }
}

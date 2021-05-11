import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import BasicEntityService, {
  PartialKey,
} from "../database/abstracts/entity-service.abstract";
import Section from "../database/entity/sections.entity";

type CreateSection = PartialKey<Section, "_id">;

@Injectable()
export class SectionService extends BasicEntityService<Section, CreateSection> {
  constructor(
    @InjectRepository(Section) private readonly sectionRepo: Repository<Section>
  ) {
    super(sectionRepo);
  }

  async createSection(payload: CreateSection[]): Promise<Section[]> {
    return await this.create(payload);
  }
}

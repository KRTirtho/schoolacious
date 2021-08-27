import { MigrationInterface, QueryRunner } from "typeorm";

export class SchoolQueryColumn1630071225879 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
          ALTER TABLE schools
          ADD COLUMN query_common tsvector
          GENERATED ALWAYS AS (to_tsvector(
            'simple',
            email || ' ' || name || ' ' || short_name
          )) STORED;
          
          CREATE INDEX query_common_index ON schools
            USING GIN (query_common);
          `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            ALTER TABLE schools DROP COLUMN query_common;
            `,
        );
    }
}

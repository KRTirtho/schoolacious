import { MigrationInterface, QueryRunner } from "typeorm";

export class UserQueryColumn1625232171644 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
          ALTER TABLE users
          ADD COLUMN IF NOT EXISTS query_common tsvector
          GENERATED ALWAYS AS (to_tsvector(
            'simple',
            email || ' ' || first_name || ' ' || last_name
          )) STORED;
          
          CREATE INDEX IF NOT EXISTS query_common_index ON users
            USING GIN (query_common);
          `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `
            ALTER TABLE users DROP COLUMN query_common;
            DROP INDEX IF EXISTS query_common_index;
            `,
        );
    }
}

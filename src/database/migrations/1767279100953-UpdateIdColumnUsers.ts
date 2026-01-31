import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIdColumnUsers1767279100953 implements MigrationInterface {
    name = 'UpdateIdColumnUsers1767279100953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT`);
    }

}

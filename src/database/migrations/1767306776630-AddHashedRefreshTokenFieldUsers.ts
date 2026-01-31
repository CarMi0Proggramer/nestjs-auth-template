import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHashedRefreshTokenFieldUsers1767306776630 implements MigrationInterface {
    name = 'AddHashedRefreshTokenFieldUsers1767306776630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "hashedRefreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hashedRefreshToken"`);
    }

}

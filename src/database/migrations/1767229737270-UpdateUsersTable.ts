import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersTable1767229737270 implements MigrationInterface {
    name = 'UpdateUsersTable1767229737270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."user_authprovider_enum" AS ENUM('LOCAL', 'GOOGLE')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "authProvider" "public"."user_authprovider_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authProvider"`);
        await queryRunner.query(`DROP TYPE "public"."user_authprovider_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}

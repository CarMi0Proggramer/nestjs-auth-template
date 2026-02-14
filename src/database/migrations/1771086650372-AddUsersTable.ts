import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1771086650372 implements MigrationInterface {
    name = 'AddUsersTable1771086650372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_authprovider_enum" AS ENUM('LOCAL', 'GOOGLE')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "authProvider" "public"."user_authprovider_enum" NOT NULL, "hashedRefreshToken" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_authprovider_enum"`);
    }

}

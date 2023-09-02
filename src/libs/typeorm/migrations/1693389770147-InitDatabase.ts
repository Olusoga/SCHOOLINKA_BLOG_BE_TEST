import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDatabase1693389770147 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create "users" table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" character varying NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "email" character varying NOT NULL,
                "last_logged_in_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id")
            )
        `);

        // Create "posts" table
        await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" character varying NOT NULL,
                "title" character varying NOT NULL,
                "content" character varying NOT NULL,
                "user_id" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_1234567890abcdef" PRIMARY KEY ("id"),
                CONSTRAINT "FK_0987654321fedcba" FOREIGN KEY ("user_id") REFERENCES "users"("id")
            )
        `);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}

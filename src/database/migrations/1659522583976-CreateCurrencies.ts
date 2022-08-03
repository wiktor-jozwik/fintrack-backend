import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCurrencies1659522583976 implements MigrationInterface {
    name = 'CreateCurrencies1659522583976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currencies" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_currencies" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "currency_id" integer, CONSTRAINT "PK_3ab2f8b18fcc2f173ce50ffad6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ADD CONSTRAINT "FK_b5a7d1c7654696dd2b029c9e794" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ADD CONSTRAINT "FK_2c264dd529a9c747ccc6749a412" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_currencies" DROP CONSTRAINT "FK_2c264dd529a9c747ccc6749a412"`);
        await queryRunner.query(`ALTER TABLE "users_currencies" DROP CONSTRAINT "FK_b5a7d1c7654696dd2b029c9e794"`);
        await queryRunner.query(`DROP TABLE "users_currencies"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
    }

}

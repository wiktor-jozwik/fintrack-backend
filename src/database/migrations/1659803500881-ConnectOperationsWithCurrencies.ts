import { MigrationInterface, QueryRunner } from "typeorm";

export class ConnectOperationsWithCurrencies1659803500881 implements MigrationInterface {
    name = 'ConnectOperationsWithCurrencies1659803500881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operations" ADD "currency_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_currencies" DROP CONSTRAINT "FK_b5a7d1c7654696dd2b029c9e794"`);
        await queryRunner.query(`ALTER TABLE "users_currencies" DROP CONSTRAINT "FK_2c264dd529a9c747ccc6749a412"`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ALTER COLUMN "currency_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "operations" ADD CONSTRAINT "FK_56b3ef947c1063d3b7c461a19c5" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ADD CONSTRAINT "FK_b5a7d1c7654696dd2b029c9e794" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ADD CONSTRAINT "FK_2c264dd529a9c747ccc6749a412" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_currencies" DROP CONSTRAINT "FK_2c264dd529a9c747ccc6749a412"`);
        await queryRunner.query(`ALTER TABLE "users_currencies" DROP CONSTRAINT "FK_b5a7d1c7654696dd2b029c9e794"`);
        await queryRunner.query(`ALTER TABLE "operations" DROP CONSTRAINT "FK_56b3ef947c1063d3b7c461a19c5"`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ALTER COLUMN "currency_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ADD CONSTRAINT "FK_2c264dd529a9c747ccc6749a412" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_currencies" ADD CONSTRAINT "FK_b5a7d1c7654696dd2b029c9e794" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operations" DROP COLUMN "currency_id"`);
    }

}

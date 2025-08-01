import { MigrationInterface, QueryRunner } from "typeorm";

export class JobMigrations1754033175395 implements MigrationInterface {
    name = 'JobMigrations1754033175395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "industry" character varying, "website" character varying, "city" character varying, "state" character varying, "remote" boolean, "fullAddress" character varying, CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job" ("id" SERIAL NOT NULL, "jobKey" character varying NOT NULL, "title" character varying NOT NULL, "jobType" character varying, "salaryMin" integer, "salaryMax" integer, "salaryCurrency" character varying, "salaryRangeStr" character varying, "experience" integer, "postedDate" TIMESTAMP WITH TIME ZONE NOT NULL, "companyId" integer, CONSTRAINT "UQ_b6fce07674ca4aa26d9767acdbd" UNIQUE ("jobKey"), CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_0f49a593960360f6f85b692aca8" UNIQUE ("name"), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_skills" ("jobId" integer NOT NULL, "skillId" integer NOT NULL, CONSTRAINT "PK_d70ad55609812d9fde4fefe099f" PRIMARY KEY ("jobId", "skillId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aef367731b3f3e78ea90892fd4" ON "job_skills" ("jobId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8d0000c11602550abb8178841" ON "job_skills" ("skillId") `);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_e66170573cabd565dab1132727d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_skills" ADD CONSTRAINT "FK_aef367731b3f3e78ea90892fd47" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "job_skills" ADD CONSTRAINT "FK_b8d0000c11602550abb81788412" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_skills" DROP CONSTRAINT "FK_b8d0000c11602550abb81788412"`);
        await queryRunner.query(`ALTER TABLE "job_skills" DROP CONSTRAINT "FK_aef367731b3f3e78ea90892fd47"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_e66170573cabd565dab1132727d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8d0000c11602550abb8178841"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aef367731b3f3e78ea90892fd4"`);
        await queryRunner.query(`DROP TABLE "job_skills"`);
        await queryRunner.query(`DROP TABLE "skill"`);
        await queryRunner.query(`DROP TABLE "job"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}

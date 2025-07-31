import { MigrationInterface, QueryRunner } from 'typeorm';

export class JobEntity1753861607163 implements MigrationInterface {
  name = 'JobEntity1753861607163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "industry" character varying, "website" character varying, "city" character varying, "state" character varying, "remote" boolean, "fullAddress" character varying, CONSTRAINT "UQ_29746807b97adc5fc039c139733" UNIQUE ("name"), CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "job" ("id" SERIAL NOT NULL, "jobKey" character varying NOT NULL, "title" character varying NOT NULL, "jobType" character varying, "salaryMin" integer, "salaryMax" integer, "salaryCurrency" character varying, "salaryRangeStr" character varying, "experience" integer, "postedDate" TIMESTAMP WITH TIME ZONE NOT NULL, "companyId" integer, CONSTRAINT "UQ_aff2682422b99abf5efc6227270" UNIQUE ("jobKey"), CONSTRAINT "PK_d9fa8592dba62162a7e8636c739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "skill" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_f9600b0068f542043fc61430c81" UNIQUE ("name"), CONSTRAINT "PK_f15d4d9999e79c842fdef236ecc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "job_skills" ("jobId" integer NOT NULL, "skillId" integer NOT NULL, CONSTRAINT "PK_d9c119aa2772639b99a0d7485a1" PRIMARY KEY ("jobId", "skillId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_822a035a3d9fd797d5a168c61c" ON "job_skills" ("jobId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c2a5e3e4764035bc43a1813ac" ON "job_skills" ("skillId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "job" ADD CONSTRAINT "FK_cd44bf4df8271a0f770764e01f6" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_skills" ADD CONSTRAINT "FK_822a035a3d9fd797d5a168c61ca" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_skills" ADD CONSTRAINT "FK_3c2a5e3e4764035bc43a1813ac0" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_skills" DROP CONSTRAINT "FK_3c2a5e3e4764035bc43a1813ac0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_skills" DROP CONSTRAINT "FK_822a035a3d9fd797d5a168c61ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job" DROP CONSTRAINT "FK_cd44bf4df8271a0f770764e01f6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c2a5e3e4764035bc43a1813ac"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_822a035a3d9fd797d5a168c61c"`,
    );
    await queryRunner.query(`DROP TABLE "job_skills"`);
    await queryRunner.query(`DROP TABLE "skill"`);
    await queryRunner.query(`DROP TABLE "job"`);
    await queryRunner.query(`DROP TABLE "company"`);
  }
}

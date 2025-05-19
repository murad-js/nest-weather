import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateSubscriptionTable1747563221120
  implements MigrationInterface
{
  name = 'CreateSubscriptionTable1747563221120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_frequency_enum" AS ENUM('hourly', 'daily')`,
    );
    await queryRunner.createTable(
      new Table({
        name: 'subscription',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
            primaryKeyConstraintName: 'PK_subscription',
          },
          {
            name: 'email',
            type: 'character varying',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'city',
            type: 'character varying',
            isNullable: false,
          },
          {
            name: 'frequency',
            type: 'enum',
            enum: ['hourly', 'daily'],
            enumName: 'subscription_frequency_enum',
            default: "'daily'",
          },
          {
            name: 'confirmed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'confirmationToken',
            type: 'character varying',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'unsubscribeToken',
            type: 'character varying',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_email',
            columnNames: ['email'],
          }),
          new TableUnique({
            name: 'UQ_confirmationToken',
            columnNames: ['confirmationToken'],
          }),
          new TableUnique({
            name: 'UQ_unsubscribeToken',
            columnNames: ['unsubscribeToken'],
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "subscription"`);
    await queryRunner.query(`DROP TYPE "public"."subscription_frequency_enum"`);
  }
}

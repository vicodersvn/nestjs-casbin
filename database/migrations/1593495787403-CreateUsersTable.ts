import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsersTable1593495787403 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'username',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'password',
            default: "''",
            type: 'varchar',
          },
          {
            name: 'first_name',
            default: "''",
            type: 'varchar',
          },
          {
            name: 'last_name',
            default: "''",
            type: 'varchar',
          },
          {
            name: 'status',
            default: 1,
            type: 'int',
          },
          {
            name: 'verify_token',
            default: "''",
            type: 'varchar',
          },
          {
            name: 'verified',
            default: 0,
            type: 'boolean',
          },
          {
            name: 'verified_at',
            isNullable: true,
            type: 'datetime',
          },
          {
            name: 'deleted_at',
            isNullable: true,
            type: 'datetime',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}

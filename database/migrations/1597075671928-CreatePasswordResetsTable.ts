import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePasswordResetsTable1597075671928 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'password_resets',
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
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'expire',
            isNullable: true,
            type: 'datetime',
            default: '(DATE_ADD(NOW(), INTERVAL 2 DAY))',
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
      'password_resets',
      new TableIndex({
        name: 'IDX_PWD_RESSET_EMAIL',
        columnNames: ['email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('password_resets');
  }
}

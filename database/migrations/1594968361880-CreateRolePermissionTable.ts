import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateRolePermissionTable1594968361880 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role_permission',
        columns: [
          {
            name: 'role_id',
            type: 'int',
          },
          {
            name: 'permission_id',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'role_permission',
      new TableIndex({
        name: 'IDX_ROLE_PERMISSION_ROLE_ID',
        columnNames: ['role_id'],
      }),
    );

    await queryRunner.createIndex(
      'role_permission',
      new TableIndex({
        name: 'IDX_ROLE_PERMISSION_PER_ID',
        columnNames: ['permission_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'role_permission',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'role_permission',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_permission');
  }
}

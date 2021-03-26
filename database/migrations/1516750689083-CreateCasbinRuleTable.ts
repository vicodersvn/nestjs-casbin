import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCasbinRuleTable1616750689083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'casbin_rule',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ptype',
            type: 'varchar',
          },
          {
            name: 'v0',
            type: 'varchar',
          },
          {
            name: 'v1',
            type: 'varchar',
          },
          {
            name: 'v2',
            type: 'varchar',
          },
          {
            name: 'v3',
            type: 'varchar',
          },
          {
            name: 'v4',
            type: 'varchar',
          },
          {
            name: 'v5',
            type: 'varchar',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('casbin_rule');
  }
}

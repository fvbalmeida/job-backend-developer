import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm"

export class RouteRequest1711789094419 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "route_request",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "method",
            type: "varchar",
          },
          {
            name: "path",
            type: "varchar",
          },
          {
            name: "statusCode",
            type: "int",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "reviewId",
            type: "int",
          },
        ],
      }),
      true,
    )

    await queryRunner.createForeignKey(
      "route_request",
      new TableForeignKey({
        columnNames: ["reviewId"],
        referencedColumnNames: ["id"],
        referencedTableName: "review",
        onDelete: "CASCADE",
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "route_request",
      "route_request_reviewId_foreign",
    )
    await queryRunner.dropTable("route_request")
  }
}

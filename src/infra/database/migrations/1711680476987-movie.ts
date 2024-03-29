import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Movie1711680476987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "movie",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "released",
            type: "date",
            isNullable: true,
          },
          {
            name: "imdbRating",
            type: "varchar",
            length: "5",
            isNullable: true,
          },
          {
            name: "imdbID",
            type: "varchar",
            length: "15",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "actors",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "director",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("movie")
  }
}

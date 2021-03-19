import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("mirror_items", async (table) => {
    table.integer("id").primary();
    table.integer("type_id");
    table.text("owner_address");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("mirror_items");
}

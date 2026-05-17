import { createClient } from "@libsql/client";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
require("dotenv").config();

const url = process.env.DATABASE_URL_PROD;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("DATABASE_URL_PROD não definida");
  process.exit(1);
}

const client = createClient({ url, authToken });

await client.executeMultiple(`
  CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const { rows: applied } = await client.execute("SELECT name FROM _migrations");
const appliedNames = new Set(applied.map((r) => r.name));

const migrationsDir = "prisma/migrations";
const dirs = readdirSync(migrationsDir)
  .filter((d) => statSync(join(migrationsDir, d)).isDirectory())
  .sort();

for (const dir of dirs) {
  if (appliedNames.has(dir)) {
    console.log(`Já aplicada: ${dir}`);
    continue;
  }

  const sql = readFileSync(join(migrationsDir, dir, "migration.sql"), "utf-8");
  await client.executeMultiple(sql);
  await client.execute({
    sql: "INSERT INTO _migrations (name) VALUES (?)",
    args: [dir],
  });
  console.log(`Aplicada: ${dir}`);
}

console.log("Migrations concluídas.");

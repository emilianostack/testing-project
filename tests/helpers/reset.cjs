"use strict";
const Database = require("better-sqlite3");
const path = require("path");

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const dbPath = url.replace(/^file:/, "");
const db = new Database(path.resolve(process.cwd(), dbPath));

db.prepare('DELETE FROM "Livro"').run();
db.prepare('DELETE FROM "Categoria"').run();
db.close();

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

export default async function globalSetup() {
  const envPath = join(process.cwd(), ".env");
  const env: Record<string, string> = {};

  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([^#=]+)=["']?([^"'\n]*)["']?/);
      if (match) env[match[1].trim()] = match[2].trim();
    }
  } catch {
    // .env não encontrado, usa variáveis do ambiente
  }

  const testUrl = env["DATABASE_URL_TEST"] ?? process.env.DATABASE_URL_TEST ?? "file:./test.db";

  execSync(`${process.execPath} node_modules/.bin/prisma db push`, {
    env: { ...process.env, ...env, DATABASE_URL: testUrl },
    stdio: "pipe",
    cwd: process.cwd(),
  });
}

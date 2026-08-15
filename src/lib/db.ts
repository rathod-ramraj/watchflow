import "server-only";
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

declare global {
  // eslint-disable-next-line no-var
  var __Cinex_sqlite: Database.Database | undefined;
}

const g = globalThis as typeof globalThis & {
  __Cinex_sqlite?: Database.Database;
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS site_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  siteUrl TEXT NOT NULL,
  siteName TEXT NOT NULL,
  siteFeature TEXT,
  targets TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  submittedAt INTEGER NOT NULL,
  submitterIp TEXT,
  userAgent TEXT,
  reviewedAt INTEGER,
  reviewedBy TEXT,
  commitSha TEXT,
  commitUrl TEXT,
  skipped TEXT
);
CREATE INDEX IF NOT EXISTS idx_site_requests_submitted ON site_requests(submittedAt DESC);
CREATE INDEX IF NOT EXISTS idx_site_requests_status_submitted ON site_requests(status, submittedAt DESC);
`;

function openDb(): Database.Database {
  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "Cinex.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);
  return db;
}

export function getDb(): Database.Database {
  if (!g.__Cinex_sqlite) {
    g.__Cinex_sqlite = openDb();
  }
  return g.__Cinex_sqlite;
}

-- Migration number: 0001 	 inquiries
-- Booking enquiries from the site's inquiry form. The worker inserts a row
-- for every accepted POST — including honeypot hits (bot = 1), which Netlify
-- used to discard invisibly. The row is the source of truth; the notification
-- email is best-effort on top.
CREATE TABLE IF NOT EXISTS inquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  dates       TEXT    NOT NULL DEFAULT '',
  group_size  TEXT    NOT NULL DEFAULT '', -- "group" is an SQL keyword
  message     TEXT    NOT NULL DEFAULT '',
  ip          TEXT,
  user_agent  TEXT,
  bot         INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at);

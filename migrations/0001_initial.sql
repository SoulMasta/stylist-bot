CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,

    service TEXT,

    name TEXT,
    city TEXT,
    age INTEGER,
    height INTEGER,
    weight REAL,

    budget TEXT,
    style_problems TEXT,
    style_preferences TEXT,
    comment TEXT,

    status TEXT DEFAULT 'new',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sessions (
    telegram_id TEXT PRIMARY KEY,
    state TEXT NOT NULL,
    data TEXT DEFAULT '{}',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


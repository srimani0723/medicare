-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT NOT NULL PRIMARY KEY,
  fullname TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('patient', 'caretaker')) NOT NULL
);

-- Medications
CREATE TABLE IF NOT EXISTS medications (
  id TEXT NOT NULL PRIMARY KEY,
  userid TEXT NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

-- Medication Log
CREATE TABLE IF NOT EXISTS medicationlog (
  id TEXT NOT NULL PRIMARY KEY,
  userid TEXT NOT NULL,
  medicationid TEXT NOT NULL,
  datetaken DATE NOT NULL,
  taken BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (medicationid) REFERENCES medications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dailystreak (
  id TEXT PRIMARY KEY,
  userid TEXT NOT NULL,
  date TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(userid, date),
  FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

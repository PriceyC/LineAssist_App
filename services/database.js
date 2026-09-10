import * as SQLite from 'expo-sqlite';

let db;
let dbPromise;

//if no db has been craeted, eg: first time using the app, then will create a local sqlite db to the app. This is so that we can store data whilst offline, which can be essentially sync to the online main db. The local db is not a copy of the main db, just stores enough of the 'offline data' for full offline functionality
//for the insidents I have set it to store a local id and have a server id field, so we don't get id conflicts when trying to sync
export async function initDatabase(){

    if(db) {
        return db;
    }

    if(dbPromise) {
        return dbPromise;
    }

    dbPromise = (async () => {

        const database = await SQLite.openDatabaseAsync('lineassist.db');

        await database.execAsync(`
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS user(
                user_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL,
                site_id INTEGER
            );

            CREATE TABLE IF NOT EXISTS sites(
                site_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                location TEXT
            );

            CREATE TABLE IF NOT EXISTS lines(
                line_id INTEGER PRIMARY KEY,
                site_id INTEGER NOT NULL,
                description TEXT NOT NULL,
                system_type TEXT,
                status_id INTEGER
            );

            CREATE TABLE IF NOT EXISTS devices(
                device_id INTEGER PRIMARY KEY,
                line_id INTEGER NOT NULL,
                description TEXT NOT NULL,
                device_type TEXT,
                device_disabled INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS incidents(
                local_id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER UNIQUE,
                site_id INTEGER NOT NULL,
                line_id INTEGER NOT NULL,
                device_id INTEGER,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                severity_id INTEGER,
                status_id INTEGER,
                created_by INTEGER,
                created_at TEXT NOT NULL,
                updated_at TEXT,
                resolved_at TEXT,
                sync_status TEXT NOT NULL DEFAULT 'synced'
            );

            CREATE TABLE IF NOT EXISTS incident_notes(
                local_id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER UNIQUE,
                incident_local_id INTEGER NOT NULL,
                note TEXT NULL,
                created_by INTEGER,
                created_at TEXT NOT NULL,
                sync_status TEXT NOT NULL DEFAULT 'synced',

                FOREIGN KEY (incident_local_id)
                    REFERENCES incidents(local_id)
            );

            CREATE TABLE IF NOT EXISTS incident_evidence(
                local_id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER UNIQUE,
                incident_local_id INTEGER NOT NULL,
                file_uri TEXT NOT NULL,
                file_type TEXT,
                description TEXT,
                created_at TEXT NOT NULL,
                sync_status TEXT NOT NULL DEFAULT 'synced',

                FOREIGN KEY (incident_local_id)
                    REFERENCES incidents(local_id)
            );

            CREATE TABLE IF NOT EXISTS diagnostic_sessions(
                local_id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER UNIQUE,
                incident_local_id INTEGER NOT NULL,
                diagnostic_type TEXT NOT NULL,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                sync_status TEXT NOT NULL DEFAULT 'synced',

                FOREIGN KEY (incident_local_id)
                    REFERENCES incidents(local_id)
            );

            CREATE TABLE IF NOT EXISTS diagnostic_answers(
                local_id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER UNIQUE,
                session_local_id INTEGER NOT NULL,
                question_id TEXT NOT NULL,
                answer TEXT,
                created_at TEXT NOT NULL,
                sync_status TEXT NOT NULL DEFAULT 'synced',

                FOREIGN KEY (session_local_id)
                    REFERENCES diagnostic_sessions(local_id)
            );

            CREATE TABLE IF NOT EXISTS sync_queue(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entity_type TEXT NOT NULL,
                local_id INTEGER NOT NULL,
                operation TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL,
                error_message TEXT
            );
        `);

        db = database;

        return db;
    })();

    try {
        return await dbPromise;

    } catch (error) {

        dbPromise = null;
        db = null;

        throw error;
    }
}

export async function getDatabase(){

    if(db) {
        return db;
    }
    
    return await initDatabase();
}
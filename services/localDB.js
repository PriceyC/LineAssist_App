import { getDatabase } from "./database"

/// This file stores all local endpoints for offline data to be added/retrieved

///OFFLINE USER DATA 

//save user to the db after login
export async function saveUser(user){
    const db = await getDatabase();

    await db.runAsync(`
            INSERT OR REPLACE INTO user
                (user_id, name, email, password_hash, role, site_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
        [
            user.userid,
            user.name,
            user.email,
            user.password_hash,
            user.role,
            user.site_id
        ]
    );
}

//GET the user account
export async function getUser(){
    const db = await getDatabase();

    return await db.getFirstAsync(
        `SELECT * FROM user LIMIT 1`
    );
}

///OFFLINE SITE DATA

//save site or sites user account is associated with
export async function saveSites(sites){
    const db = await getDatabase();

    for(const site of sites){
        await db.runAsync(
            `INSERT OR REPLACE INTO sites
                (site_id, name, location)
            VALUES (?, ?, ?)`,
            [
                site.siteid,
                site.name,
                site.location
            ]
        );
    }
}

//retrieve all sites
export async function getOfflineSites(){
    const db = await getDatabase();

    return await db.getAllSync(
        `SELECT * FROM sites ORDER BY name`
    );
}

///OFFLINE LINE DATA

//save line data
export async function saveLines(lines){
    const db = await getDatabase();

    for (const line of lines){
        await db.runAsync(
            `INSERT OR REPLACE INTO lines
                (line_id, site_id, description, system_type, status_id)
            VALUES (?, ?, ?, ?, ?)`,
            [
                line.lineid,
                line.site_id,
                line.linedesc,
                line.system_type,
                line.statusid
            ]
        );
    }
}

//get line data asscoiated with sites+user
export async function getOfflineLines(siteId){
    const db = await getDatabase();

    return await db.getAllAsync(
        `SELECT *
         FROM lines
         WHERE site_id = ?
         ORDER BY line_id`,
        [siteId]
    );
}

//get a single line by id
export async function getOfflineLine(lineId){
    const db = await getDatabase();

    return await db.getFirstAsync(
        `SELECT *
         FROM lines
         WHERE line_id = ?`,
        [lineId]
    );
}

///OFFLINE DEVICES DATA

//save devices linked to available lines to local storage
export async function saveDevices(devices){
    const db = await getDatabase();

    for (const device of devices) {
        await db.runAsync(
            `INSERT OR REPLACE INTO devices
            (device_id, line_id, description, device_type)
            VALUES (?, ?, ?, ?)`,
            [
                device.deviceid ?? device.device_id,
                device.line_id ?? device.lineid,
                device.device_desc ?? device.description,
                device.device_type,
            ]
        );
    }
}

//Get all devices associated to available lines
export async function getDevices(lineId){
    const db = await getDatabase();

    return await db.getAllAsync(
        `SELECT * FROM devices WHERE line_id = ? ORDER BY device_id`,
        [lineId]
    );
}

///OFFLINE INCIDENT DATA

//Create new incident offline
export async function createLocalIncident(incident){
    const db = await getDatabase();

    const result = await db.runAsync(
        `INSERT INTO incidents
            (
                server_id,
                site_id,
                line_id,
                device_id,
                title,
                description,
                severity_id,
                status_id,
                created_by,
                created_at,
                sync_status
            )
        VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
        [
            null,
            incident.site_id,
            incident.line_id,
            incident.device_id ?? null,
            incident.title,
            incident.description,
            incident.severity_id ?? null,
            incident.status_id ?? null,
            incident.created_by,
            incident.created_at ?? new Date().toISOString(),
            'pending'
        ]
    );

    return result.lastInsertRowId;
}

//get single incident by local id rather than server id
export async function getLocalIncident(localId) {
    const db = await getDatabase();

    const incident = await db.getFirstAsync(
        `SELECT * FROM incidents WHERE local_id = ?`,
        [localId]
    );

    if (!incident) {
        return null;
    }

    const line = await db.getFirstAsync(
        `SELECT * FROM lines WHERE line_id = ?`,
        [incident.line_id]
    );

    let device = null;

    if (incident.device_id) {
        device = await db.getFirstAsync(
            `SELECT * FROM devices WHERE device_id = ?`,
            [incident.device_id]
        );
    }

    const severityNames = {
        1: 'Low',
        2: 'Medium',
        3: 'High',
        4: 'Urgent'
    };

    const statusNames = {
        1: 'Open',
        2: 'Investigating',
        3: 'Waiting for Site',
        4: 'Closed'
    };

    return {
        ...incident,

        linedesc: line?.description ?? 'Unknown',
        device_desc: device?.description ?? 'None',
        severitydesc: severityNames[incident.severity_id] ?? 'Unknown',
        statusdesc: statusNames[incident.status_id] ?? 'Unknown'
    };
}

//get all local incidents with query filters
export async function getLocalIncidents(siteId, lineStatus, severity){
    const db = await getDatabase();

    //start query
    let query = `
        SELECT *
        FROM incidents
        WHERE site_id = ?
    `;

    //add site id param which will always be present
    const params = [siteId];

    //if status param, then add to query
    if (lineStatus) {
        query += ` AND status_id = ?`;
        params.push(lineStatus);
    }

    // if severity param then add to query
    if (severity) {
        query += ` AND severity_id = ?`;
        params.push(severity);
    }

    //finish query
    query += ` ORDER BY created_at DESC`;

    //retrive data
    const incidents = await db.getAllAsync(query, params);

    //severity and status details to return by id from data
    const severityNames = {
        1: 'Low',
        2: 'Medium',
        3: 'High',
        4: 'Urgent'
    };

    const statusNames = {
        1: 'Open',
        2: 'Investigating',
        3: 'Waiting for Site',
        4: 'Closed'
    };

    //set results empty array
    const results = [];

    //get all line data for incidents and device data by id from data
    for (const incident of incidents){
        const line = await db.getFirstAsync(
            `SELECT * FROM lines WHERE line_id = ?`,
            [incident.line_id]
        );

        let device = null;

        if (incident.device_id) {
            device = await db.getFirstAsync(
                `SELECT * FROM devices WHERE device_id = ?`,
                [incident.device_id]
            );
        }

        //return final rsults
        results.push({
            ...incident,
            incidentid: incident.local_id,
            is_local: 1,
            linedesc: line?.description ?? 'Unknown',
            device_desc: device?.description ?? 'None',
            severitydesc:
                severityNames[incident.severity_id] ?? 'Unknown',
            statusdesc:
                statusNames[incident.status_id] ?? 'Unknown'
        });
    }

    return results;
}

//get incident locally using online id
export async function getLocalIncidentByServerId(serverId){
    const db = await getDatabase();

    return await db.getFirstAsync(
        `SELECT *
         FROM incidents
         WHERE server_id = ?`,
        [Number(serverId)]
    );
}

//cache icnident locally in local db from onine data request
export async function cacheServerIncident(incident){
    const db = await getDatabase();

    const existing = await getLocalIncidentByServerId(incident.incidentid);

    if (existing) {
        return existing;
    }

    const result = await db.runAsync(
        `INSERT INTO incidents (
            server_id,
            site_id,
            line_id,
            device_id,
            title,
            description,
            severity_id,
            status_id,
            created_by,
            created_at,
            updated_at,
            resolved_at,
            sync_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            incident.incidentid,
            incident.site_id,
            incident.line_id,
            incident.device_id ?? null,
            incident.title,
            incident.description,
            incident.severityid,
            incident.statusid,
            incident.created_by,
            incident.created_at,
            incident.updated_at ?? null,
            incident.resolved_at ?? null,
            'synced'
        ]
    );

    return await getLocalIncident(result.lastInsertRowId);
}

///OFFLINE NOTES 

//create note locally
export async function createLocalNote(note){
    const db = await getDatabase();

    const result = await db.runAsync(
        `INSERT INTO incident_notes
            (
                server_id,
                incident_local_id,
                note,
                created_by,
                created_at,
                sync_status
            )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            null,
            note.incident_local_id,
            note.note,
            note.created_by,
            new Date().toISOString(),
            'pending'
        ]
    );

    return result.lastInsertRowId;
}

//retrieve loclaly cached notes
export async function getLocalNotes(incidentLocalId){
    const db = await getDatabase();

    const notes = await db.getAllAsync(
        `SELECT *
         FROM incident_notes
         WHERE incident_local_id = ?
         ORDER BY created_at DESC`,
        [incidentLocalId]
    );

    const results = [];

    for (const note of notes) {
        const user = await db.getFirstAsync(
            `SELECT name
             FROM user
             WHERE user_id = ?`,
            [note.created_by]
        );

        results.push({
            ...note,
            id: note.local_id,
            user_name: user?.name ?? 'Unknown user'
        });
    }

    return results;
}

///OFFLINE EVIDENCE

//create lcoal evidence and store locally, then push to sync queue
export async function createLocalEvidence({
    incident_local_id,
    file_uri,
    file_type,
    description
}) {
    const db = await getDatabase();

    const result = await db.runAsync(
        `INSERT INTO incident_evidence
        (
            incident_local_id,
            file_uri,
            file_type,
            description,
            created_at,
            sync_status
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            incident_local_id,
            file_uri,
            file_type,
            description,
            new Date().toISOString(),
            'pending'
        ]
    );

    const localId = result.lastInsertRowId;

    await addToSyncQueue(
        'evidence',
        localId,
        'CREATE'
    );

    return localId;
}

//retrive local evidence associated with incident id
export async function getLocalEvidence(incidentLocalId){
    const db = await getDatabase();

    return await db.getAllAsync(
        `SELECT *
         FROM incident_evidence
         WHERE incident_local_id = ?
         ORDER BY created_at DESC`,
        [incidentLocalId]
    );
}

//get one evidence by id
export async function getLocalEvidenceItem(localId){
    const db = await getDatabase();

    return await db.getFirstAsync(
        `SELECT *
         FROM incident_evidence
         WHERE local_id = ?`,
        [Number(localId)]
    );
}

//update the evidence server id after upload to online db
export async function updateLocalEvidenceServerId(localId, serverId){
    const db = await getDatabase();

    await db.runAsync(
        `UPDATE incident_evidence
         SET server_id = ?,
             sync_status = 'synced'
         WHERE local_id = ?`,
        [serverId, Number(localId)]
    );
}

///OFFLINE DIAGNOSTIC SESSIONS
//create session locally
export async function createLocalDiagnosticSession(session){
    const db = await getDatabase();

    const result = await db.runAsync(
        `INSERT INTO diagnostic_sessions
            (
                server_id,
                incident_local_id,
                diagnostic_type,
                started_at,
                completed_at,
                sync_status
            )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            null,
            session.incident_local_id,
            session.diagnostic_type,
            new Date().toISOString(),
            null,
            'pending'
        ]
    );

    return result.lastInsertRowId;
}

//session lookup for offline viewing
export async function getLocalDiagnosticSessions(incidentLocalId){
    const db = await getDatabase();

    return await db.getAllAsync(
        `SELECT *
         FROM diagnostic_sessions
         WHERE incident_local_id = ?
         ORDER BY started_at DESC`,
        [incidentLocalId]
    );
}

//get locally stired session by local id
export async function getLocalDiagnosticSession(localId){
    const db = await getDatabase();

    return await db.getFirstAsync(
        `SELECT *
         FROM diagnostic_sessions
         WHERE local_id = ?`,
        [Number(localId)]
    );
}

//get answer from the local id
export async function getLocalDiagnosticAnswer(localId){
    const db = await getDatabase();

    return await db.getFirstAsync(
        `SELECT *
         FROM diagnostic_answers
         WHERE local_id = ?`,
        [Number(localId)]
    );
}

//create offline diagnostic answer
export async function createLocalDiagnosticAnswer(answer){
    const db = await getDatabase();

    const result = await db.runAsync(
        `INSERT INTO diagnostic_answers
            (
                server_id,
                session_local_id,
                question_id,
                answer,
                created_at,
                sync_status
            )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            null,
            Number(answer.session_local_id),
            answer.question_id,
            String(answer.answer),
            new Date().toISOString(),
            'pending'
        ]
    );

    return result.lastInsertRowId;
}

// creating offline answers to be added to the offline session
export async function getLocalDiagnosticAnswers(sessionLocalId){
    const db = await getDatabase();

    const answers = await db.getAllAsync(
        `SELECT *
         FROM diagnostic_answers
         WHERE session_local_id = ?
         ORDER BY local_id`,
        [Number(sessionLocalId)]
    );

    return answers.map(answer => ({
        ...answer,
        id: answer.local_id,
        step_id: answer.question_id
    }));
}

// create a completion time for the session and end the diagnostic process
export async function completeLocalDiagnosticSession(localId){
    const db = await getDatabase();

    await db.runAsync(
        `UPDATE diagnostic_sessions
         SET completed_at = ?,
             sync_status = 'pending'
         WHERE local_id = ?`,
        [
            new Date().toISOString(),
            Number(localId)
        ]
    );
}

///ONLINE AND OFFLINE SYNC FUNCTIONALITY

//add new item to the sync queue
export async function addToSyncQueue(entityType, localId, operation){
    const db = await getDatabase();

    await db.runAsync(
        `INSERT INTO sync_queue
            (
                entity_type,
                local_id,
                operation,
                status,
                created_at
            )
        VALUES(?,?,?,?,?)`,
        [
            entityType,
            localId,
            operation,
            'pending',
            new Date().toISOString()
        ]
    );
}

//retrieve all pending items to be synced
export async function getPendingSyncItems(){
    const db = await getDatabase();

    return await db.getAllAsync(
        `SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY id`
    );
}

//update  sync status after sync is complete
export async function markSyncItemComplete(syncId){
    const db = await getDatabase();

    await db.runAsync(
        `UPDATE sync_queue
         SET status = 'completed'
         WHERE id = ?`,
        [syncId]
    );
}

//update local incident server id
export async function updateLocalIncidentServerId(localId, serverId){
    const db = await getDatabase();

    await db.runAsync(
        `UPDATE incidents
         SET server_id = ?,
             sync_status = 'synced'
         WHERE local_id = ?`,
        [serverId, localId]
    );
}

//update local session server id
export async function updateLocalDiagnosticSessionServerId(localId, serverId){
    const db = await getDatabase();

    await db.runAsync(
        `UPDATE diagnostic_sessions
         SET server_id = ?,
             sync_status = 'synced'
         WHERE local_id = ?`,
        [serverId, localId]
    );
}

//update answer server id
export async function updateLocalDiagnosticAnswerServerId(localId, serverId){
    const db = await getDatabase();

    await db.runAsync(
        `UPDATE diagnostic_answers
         SET server_id = ?,
             sync_status = 'synced'
         WHERE local_id = ?`,
        [serverId, localId]
    );
}

//get count for pending changes awaiting sync
export async function getPendingSyncCount(){
    const db = await getDatabase();

    const result = await db.getFirstAsync(
        `SELECT COUNT(*) as count
         FROM sync_queue
         WHERE status = 'pending'`
    );

    return result?.count ?? 0;
}

export async function deleteLocalEvidence(localId) {
    const db = await getDatabase();

    await db.withTransactionAsync(async () => {

        await db.runAsync(
            `DELETE FROM incident_evidence
             WHERE local_id = ?`,
            [Number(localId)]
        );

        await db.runAsync(
            `DELETE FROM sync_queue
             WHERE entity_type = 'evidence'
             AND local_id = ?`,
            [Number(localId)]
        );

    });

    console.log(
        `Deleted evidence ${localId} and its sync queue entry`
    );
}
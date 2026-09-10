
-- Sites table so we have site specific breakdowns of data, al data linked in some way to a site so using roles we only give access to site user is assigned to
CREATE TABLE sites (
    siteid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255)
);

-- Users table allows us to assign a user account to a site and have a specific role, so we can route them based off of role to only access required data
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    site_id INTEGER,

    CONSTRAINT fk_users_site
        FOREIGN KEY (site_id)
        REFERENCES sites(siteid)
        ON DELETE SET NULL
);


-- Line status defines whether a line is in fault for example
CREATE TABLE linestatus (
    statusid SERIAL PRIMARY KEY,
    statusdesc VARCHAR(50) NOT NULL UNIQUE
);


-- all data for a line linked to a site with a status id assigned

CREATE TABLE lines (
    lineid SERIAL PRIMARY KEY,
    site_id INTEGER NOT NULL,
    linedesc VARCHAR(100) NOT NULL,
    system_type VARCHAR(100),
    statusid INTEGER,

    CONSTRAINT fk_lines_site
        FOREIGN KEY (site_id)
        REFERENCES sites(siteid)
        ON DELETE CASCADE,

    CONSTRAINT fk_lines_status
        FOREIGN KEY (statusid)
        REFERENCES linestatus(statusid)
        ON DELETE SET NULL
);


--devices linked to a specific line with type and desc alongside whether it's been disabled, say a resolution can't be made and they need to continue running the line
CREATE TABLE devices (
    deviceid SERIAL PRIMARY KEY,
    lineid INTEGER NOT NULL,
    device_desc VARCHAR(150) NOT NULL,
    device_type VARCHAR(100),
    device_disabled BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_devices_line
        FOREIGN KEY (lineid)
        REFERENCES lines(lineid)
        ON DELETE CASCADE
);

-- STatus for whether a ticket is open closed etc, allows for history tracking as well
CREATE TABLE ticketstatus (
    statusid SERIAL PRIMARY KEY,
    statusdesc VARCHAR(50) NOT NULL UNIQUE
);


-- Severity allows to prioritise tickets by urgency
CREATE TABLE incidentseverity (
    severityid SERIAL PRIMARY KEY,
    severitydesc VARCHAR(50) NOT NULL UNIQUE
);


--incidents stores all data for troubleshooting and any subsequent ticket to be generated, linked by site and line with a user attached
CREATE TABLE incidents (
    incidentid SERIAL PRIMARY KEY,
    site_id INTEGER NOT NULL,
    line_id INTEGER NOT NULL,
    device_id INTEGER,
    created_by INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severityid INTEGER NOT NULL,
    current_status_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,

    CONSTRAINT fk_incidents_site
        FOREIGN KEY (site_id)
        REFERENCES sites(siteid)
        ON DELETE RESTRICT,

    CONSTRAINT fk_incidents_line
        FOREIGN KEY (line_id)
        REFERENCES lines(lineid)
        ON DELETE RESTRICT,

    CONSTRAINT fk_incidents_device
        FOREIGN KEY (device_id)
        REFERENCES devices(deviceid)
        ON DELETE SET NULL,

    CONSTRAINT fk_incidents_user
        FOREIGN KEY (created_by)
        REFERENCES users(userid)
        ON DELETE RESTRICT,

    CONSTRAINT fk_incidents_severity
        FOREIGN KEY (severityid)
        REFERENCES incidentseverity(severityid)
        ON DELETE RESTRICT,

    CONSTRAINT fk_incidents_status
        FOREIGN KEY (current_status_id)
        REFERENCES ticketstatus(statusid)
        ON DELETE RESTRICT
);


--status history stores statuses and timestamps so we can record and show to user history for a ticket
CREATE TABLE incident_status_history (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL,
    ticketstatusid INTEGER NOT NULL,
    changed_by INTEGER NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_status_history_incident
        FOREIGN KEY (incident_id)
        REFERENCES incidents(incidentid)
        ON DELETE CASCADE,

    CONSTRAINT fk_status_history_status
        FOREIGN KEY (ticketstatusid)
        REFERENCES ticketstatus(statusid)
        ON DELETE RESTRICT,

    CONSTRAINT fk_status_history_user
        FOREIGN KEY (changed_by)
        REFERENCES users(userid)
        ON DELETE RESTRICT
);


--ntores evidences such as photos and barcode scans for the support ticket or the sites records
CREATE TABLE incident_evidence (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    uri TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evidence_incident
        FOREIGN KEY (incident_id)
        REFERENCES incidents(incidentid)
        ON DELETE CASCADE
);


-- notes on the incident, mainly for the furture support side when support engineers can add notes to be viewed by site
CREATE TABLE incident_notes (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notes_incident
        FOREIGN KEY (incident_id)
        REFERENCES incidents(incidentid)
        ON DELETE CASCADE,

    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id)
        REFERENCES users(userid)
        ON DELETE RESTRICT
);


-- diagnostic sessions store data of a session, the actual sessions generated based of JSON stored diagnostics sessions which hold step by step process and can be added and edited easily. Assigned to an incident, incidents could have multiple if required
CREATE TABLE diagnostic_sessions (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL,
    diagnostic_type VARCHAR(100) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    CONSTRAINT fk_diagnostic_session_incident
        FOREIGN KEY (incident_id)
        REFERENCES incidents(incidentid)
        ON DELETE CASCADE
);


-- stores timestamped answers to further populate ticket timeline
CREATE TABLE diagnostic_answers (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    step_id VARCHAR(100) NOT NULL,
    answer TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_diagnostic_answer_session
        FOREIGN KEY (session_id)
        REFERENCES diagnostic_sessions(id)
        ON DELETE CASCADE
);


-- Indexes for future proofing, if the app went to production it's best practice as if you had hundreds of sites with hundreds of lines and thousands of incidents, the indexing will help with searching efficiently
CREATE INDEX idx_users_site
    ON users(site_id);

CREATE INDEX idx_lines_site
    ON lines(site_id);

CREATE INDEX idx_devices_line
    ON devices(lineid);

CREATE INDEX idx_incidents_site
    ON incidents(site_id);

CREATE INDEX idx_incidents_line
    ON incidents(line_id);

CREATE INDEX idx_incidents_device
    ON incidents(device_id);

CREATE INDEX idx_incidents_created_by
    ON incidents(created_by);

CREATE INDEX idx_incidents_status
    ON incidents(current_status_id);

CREATE INDEX idx_incidents_severity
    ON incidents(severityid);

CREATE INDEX idx_status_history_incident
    ON incident_status_history(incident_id);

CREATE INDEX idx_incident_notes_incident
    ON incident_notes(incident_id);

CREATE INDEX idx_incident_evidence_incident
    ON incident_evidence(incident_id);

CREATE INDEX idx_diagnostic_sessions_incident
    ON diagnostic_sessions(incident_id);

CREATE INDEX idx_diagnostic_answers_session
    ON diagnostic_answers(session_id);
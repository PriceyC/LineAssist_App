-- Seeding data script, implemented with a full reset to clear any existing data and start fresh

-- Make sure any previously failed transaction is cleared before starting
ROLLBACK;

BEGIN;

-- Full reset
TRUNCATE TABLE
    diagnostic_answers,
    diagnostic_sessions,
    incident_notes,
    incident_evidence,
    incident_status_history,
    incidents,
    devices,
    lines,
    users,
    ticketstatus,
    incidentseverity,
    linestatus,
    sites
RESTART IDENTITY CASCADE;

--Adds two sites based on real world sites
INSERT INTO sites (name, location)
VALUES
    ('AM Foods', 'Leicester'),
    ('Bluecore Grocers', 'Nottingham');

--Add line statuses which should cover most cases
INSERT INTO linestatus (statusdesc)
VALUES
    ('Running'),
    ('Warning'),
    ('Fault'),
    ('Stopped'),
    ('Maintenance'),
    ('Disabled');

-- Adds few ticket statuses which I've kept concise, can bounce back and forth between investigating and waiting for site if communications between support and site, similar to a real support process
INSERT INTO ticketstatus (statusdesc)
VALUES
    ('Open'),
    ('Investigating'),
    ('Waiting for Site'),
    ('Closed');

--Severity with enough options to cover any incident
INSERT INTO incidentseverity (severitydesc)
VALUES
    ('Low'),
    ('Medium'),
    ('High'),
    ('Urgent');


--Created several users with a bcrypt hash of 'password', several users and roles to cover all bases for a demo
INSERT INTO users
    (name, email, password_hash, role, site_id)
VALUES

    (
        'Alex Morgan',
        'alex.morgan@amfoods.example',
        '$2b$10$1PBWq59MxdudWOBBfC4KYeEKKa9J9n.QQYt.JiS3XqESd5GZKtcK6',
        'site_engineer',
        (SELECT siteid FROM sites WHERE name = 'AM Foods')
    ),

    (
        'Sarah Bennett',
        'sarah.bennett@amfoods.example',
        '$2b$10$1PBWq59MxdudWOBBfC4KYeEKKa9J9n.QQYt.JiS3XqESd5GZKtcK6',
        'site_engineer',
        (SELECT siteid FROM sites WHERE name = 'AM Foods')
    ),

    (
        'Daniel Carter',
        'daniel.carter@bluecore.example',
        '$2b$10$1PBWq59MxdudWOBBfC4KYeEKKa9J9n.QQYt.JiS3XqESd5GZKtcK6',
        'site_engineer',
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')
    ),

    (
        'Emma Wilson',
        'emma.wilson@bluecore.example',
        '$2b$10$1PBWq59MxdudWOBBfC4KYeEKKa9J9n.QQYt.JiS3XqESd5GZKtcK6',
        'site_engineer',
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')
    ),

    (
        'James Taylor',
        'james.taylor@lineassist.example',
        '$2b$10$1PBWq59MxdudWOBBfC4KYeEKKa9J9n.QQYt.JiS3XqESd5GZKtcK6',
        'support_engineer',
        NULL
    ),

    (
        'Olivia Harris',
        'olivia.harris@lineassist.example',
        '$2b$10$1PBWq59MxdudWOBBfC4KYeEKKa9J9n.QQYt.JiS3XqESd5GZKtcK6',
        'support_engineer',
        NULL
    ),

    (
        'Michael Brooks',
        'michael.brooks@lineassist.example',
        '$2b$10$1PBWq59MxdudWOBBfC4KYeEKKa9J9n.QQYt.JiS3XqESd5GZKtcK6',
        'technical_management',
        NULL
    );

--create the lines: one site has standard int lines but some sites have themed names for lines so have included both. pre added statuses in line with the incidents generated
INSERT INTO lines
    (site_id, linedesc, system_type, statusid)
VALUES
    (
        (SELECT siteid FROM sites WHERE name = 'AM Foods'),
        'Line 1',
        'Film and Carton Coding',
        (SELECT statusid FROM linestatus WHERE statusdesc = 'Warning')
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'AM Foods'),
        'Line 2',
        'Carton Packing',
        (SELECT statusid FROM linestatus WHERE statusdesc = 'Running')
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'AM Foods'),
        'Line 3',
        'Product Coding',
        (SELECT statusid FROM linestatus WHERE statusdesc = 'Running')
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers'),
        'Fordson',
        'Film and Carton Coding',
        (SELECT statusid FROM linestatus WHERE statusdesc = 'Fault')
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers'),
        'Ferguson',
        'Carton Coding',
        (SELECT statusid FROM linestatus WHERE statusdesc = 'Running')
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers'),
        'Massey',
        'Product Coding',
        (SELECT statusid FROM linestatus WHERE statusdesc = 'Warning')
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers'),
        'New Holland',
        'Carton Packing',
        (SELECT statusid FROM linestatus WHERE statusdesc = 'Running')
    );

--adding devices by line and site, based on real examples of hardware for autocoding on lines
INSERT INTO devices
    (lineid, device_desc, device_type, device_disabled)
VALUES
    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 1'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Film Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 1'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Carton Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 1'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Date Printer 1',
        'Videojet Printer',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 1'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Main PLC',
        'CompactLogix PLC',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 1'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Product Trigger 1',
        'Trigger Sensor',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 2'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Film Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 2'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Carton Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 2'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Date Printer 1',
        'Markem-Imaje Printer',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 2'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Main PLC',
        'CompactLogix PLC',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 3'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Film Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 3'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Carton Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 3'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Date Printer 1',
        'Videojet Printer',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Line 3'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        'Main PLC',
        'CompactLogix PLC',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Fordson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Film Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Fordson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Carton Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Fordson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Date Printer 1',
        'Markem-Imaje Printer',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Fordson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Main PLC',
        'CompactLogix PLC',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Fordson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Product Trigger 1',
        'Trigger Sensor',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Ferguson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Film Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Ferguson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Carton Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Ferguson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Date Printer 1',
        'Videojet Printer',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Ferguson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Main PLC',
        'CompactLogix PLC',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Massey'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Film Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Massey'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Carton Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Massey'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Date Printer 1',
        'Markem-Imaje Printer',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Massey'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Main PLC',
        'CompactLogix PLC',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'Massey'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Product Trigger 1',
        'Trigger Sensor',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'New Holland'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Film Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'New Holland'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Carton Scanner 1',
        'Cognex Scanner',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'New Holland'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Date Printer 1',
        'Videojet Printer',
        FALSE
    ),

    (
        (SELECT lineid FROM lines WHERE linedesc = 'New Holland'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        'Main PLC',
        'CompactLogix PLC',
        FALSE
    );

--Creating incidents using the sites, lines and devices added already
INSERT INTO incidents
(
    site_id,
    line_id,
    device_id,
    created_by,
    title,
    description,
    severityid,
    current_status_id,
    created_at,
    updated_at,
    resolved_at
)
VALUES
    (
        (SELECT siteid FROM sites WHERE name = 'AM Foods'),
        (SELECT lineid FROM lines WHERE linedesc = 'Line 1'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        (SELECT deviceid FROM devices
         WHERE device_desc = 'Film Scanner 1'
         AND lineid = (
             SELECT lineid FROM lines
             WHERE linedesc = 'Line 1'
             AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')
         )),
        (SELECT userid FROM users WHERE email = 'alex.morgan@amfoods.example'),
        'Low barcode read rate',
        'Film scanner read rate has dropped below the accepted production threshold. Intermittent "No Reads" are being reported on products passing through the line.',
        (SELECT severityid FROM incidentseverity WHERE severitydesc = 'High'),
        (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Investigating'),
        CURRENT_TIMESTAMP - INTERVAL '2 days',
        CURRENT_TIMESTAMP - INTERVAL '3 hours',
        NULL
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers'),
        (SELECT lineid FROM lines WHERE linedesc = 'Fordson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        (SELECT deviceid FROM devices
         WHERE device_desc = 'Carton Scanner 1'
         AND lineid = (
             SELECT lineid FROM lines
             WHERE linedesc = 'Fordson'
             AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')
         )),
        (SELECT userid FROM users WHERE email = 'daniel.carter@bluecore.example'),
        'Barcodes not scanning',
        'Carton barcodes are not being detected by the scanner. Read rate falling below acceptable levels.',
        (SELECT severityid FROM incidentseverity WHERE severitydesc = 'Urgent'),
        (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
        CURRENT_TIMESTAMP - INTERVAL '4 hours',
        CURRENT_TIMESTAMP - INTERVAL '4 hours',
        NULL
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'AM Foods'),
        (SELECT lineid FROM lines WHERE linedesc = 'Line 2'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        (SELECT deviceid FROM devices
         WHERE device_desc = 'Main PLC 1'
         AND lineid = (
             SELECT lineid FROM lines
             WHERE linedesc = 'Line 2'
             AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')
         )),
        (SELECT userid FROM users WHERE email = 'sarah.bennett@amfoods.example'),
        'PLC disconnected',
        'The PLC has stopped communicating with the production system.',
        (SELECT severityid FROM incidentseverity WHERE severitydesc = 'Urgent'),
        (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Closed'),
        CURRENT_TIMESTAMP - INTERVAL '5 days',
        CURRENT_TIMESTAMP - INTERVAL '4 days',
        CURRENT_TIMESTAMP - INTERVAL '4 days'
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers'),
        (SELECT lineid FROM lines WHERE linedesc = 'Ferguson'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        (SELECT deviceid FROM devices
         WHERE device_desc = 'Date Printer 1'
         AND lineid = (
             SELECT lineid FROM lines
             WHERE linedesc = 'Ferguson'
             AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')
         )),
        (SELECT userid FROM users WHERE email = 'emma.wilson@bluecore.example'),
        'Date printer offline',
        'The date coding printer is showing as offline and is not responding to job download.',
        (SELECT severityid FROM incidentseverity WHERE severitydesc = 'High'),
        (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
        CURRENT_TIMESTAMP - INTERVAL '1 hour',
        CURRENT_TIMESTAMP - INTERVAL '1 hour',
        NULL
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'AM Foods'),
        (SELECT lineid FROM lines WHERE linedesc = 'Line 3'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        (SELECT deviceid FROM devices
         WHERE device_desc = 'Date Printer 1'
         AND lineid = (
             SELECT lineid FROM lines
             WHERE linedesc = 'Line 3'
             AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')
         )),
        (SELECT userid FROM users WHERE email = 'alex.morgan@amfoods.example'),
        'Printer printing incorrect date',
        'Product is being printed with an incorrect date code. Printer configuration and current production date need to be checked.',
        (SELECT severityid FROM incidentseverity WHERE severitydesc = 'Urgent'),
        (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Closed'),
        CURRENT_TIMESTAMP - INTERVAL '8 days',
        CURRENT_TIMESTAMP - INTERVAL '7 days',
        CURRENT_TIMESTAMP - INTERVAL '7 days'
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers'),
        (SELECT lineid FROM lines WHERE linedesc = 'Massey'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        (SELECT deviceid FROM devices
         WHERE device_desc = 'Film Scanner 1'
         AND lineid = (
             SELECT lineid FROM lines
             WHERE linedesc = 'Massey'
             AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')
         )),
        (SELECT userid FROM users WHERE email = 'daniel.carter@bluecore.example'),
        'Scanner communications failure',
        'The Cognex film scanner communications with the PLC are intermittent.',
        (SELECT severityid FROM incidentseverity WHERE severitydesc = 'High'),
        (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Investigating'),
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        CURRENT_TIMESTAMP - INTERVAL '45 minutes',
        NULL
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'AM Foods'),
        (SELECT lineid FROM lines WHERE linedesc = 'Line 1'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        (SELECT deviceid FROM devices
         WHERE device_desc = 'Date Printer 1'
         AND lineid = (
             SELECT lineid FROM lines
             WHERE linedesc = 'Line 1'
             AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')
         )),
        (SELECT userid FROM users WHERE email = 'sarah.bennett@amfoods.example'),
        'Printer communications issue',
        'Videojet printer is communicating intermittently. Please resolve before next job download.',
        (SELECT severityid FROM incidentseverity WHERE severitydesc = 'Medium'),
        (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Closed'),
        CURRENT_TIMESTAMP - INTERVAL '10 days',
        CURRENT_TIMESTAMP - INTERVAL '9 days',
        CURRENT_TIMESTAMP - INTERVAL '9 days'
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers'),
        (SELECT lineid FROM lines WHERE linedesc = 'New Holland'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')),
        (SELECT deviceid FROM devices
         WHERE device_desc = 'Product Trigger 1'
         AND lineid = (
             SELECT lineid FROM lines
             WHERE linedesc = 'New Holland'
             AND site_id = (SELECT siteid FROM sites WHERE name = 'Bluecore Grocers')
         )),
        (SELECT userid FROM users WHERE email = 'emma.wilson@bluecore.example'),
        'Product trigger sensor fault',
        'Products are intermittently failing to trigger the scanner.',
        (SELECT severityid FROM incidentseverity WHERE severitydesc = 'Medium'),
        (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Waiting for Site'),
        CURRENT_TIMESTAMP - INTERVAL '3 days',
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        NULL
    ),

    (
        (SELECT siteid FROM sites WHERE name = 'AM Foods'),
        (SELECT lineid FROM lines WHERE linedesc = 'Line 2'
         AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')),
        (SELECT deviceid FROM devices
         WHERE device_desc = 'Carton Scanner 1'
         AND lineid = (
             SELECT lineid FROM lines
             WHERE linedesc = 'Line 2'
             AND site_id = (SELECT siteid FROM sites WHERE name = 'AM Foods')
         )),
        (SELECT userid FROM users WHERE email = 'alex.morgan@amfoods.example'),
        'Low carton barcode read rate',
        'Carton scanner read rate has fallen below the accepted levels.',
        (SELECT severityid FROM incidentseverity WHERE severitydesc = 'Medium'),
        (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Closed'),
        CURRENT_TIMESTAMP - INTERVAL '14 days',
        CURRENT_TIMESTAMP - INTERVAL '13 days',
        CURRENT_TIMESTAMP - INTERVAL '13 days'
    );

-- status history for incidents, generating timestamps and status for created incidents
INSERT INTO incident_status_history
    (incident_id, ticketstatusid, changed_by, changed_at)
VALUES
(
    (SELECT incidentid FROM incidents WHERE title = 'Low barcode read rate'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
    (SELECT userid FROM users WHERE email = 'alex.morgan@amfoods.example'),
    CURRENT_TIMESTAMP - INTERVAL '2 days'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'Low barcode read rate'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Investigating'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Barcodes not scanning'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
    (SELECT userid FROM users WHERE email = 'daniel.carter@bluecore.example'),
    CURRENT_TIMESTAMP - INTERVAL '4 hours'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'PLC disconnected'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
    (SELECT userid FROM users WHERE email = 'sarah.bennett@amfoods.example'),
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'PLC disconnected'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Investigating'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '2 hours'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'PLC disconnected'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Closed'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '4 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Date printer offline'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
    (SELECT userid FROM users WHERE email = 'emma.wilson@bluecore.example'),
    CURRENT_TIMESTAMP - INTERVAL '1 hour'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Printer printing incorrect date'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
    (SELECT userid FROM users WHERE email = 'alex.morgan@amfoods.example'),
    CURRENT_TIMESTAMP - INTERVAL '8 days'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'Printer printing incorrect date'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Investigating'),
    (SELECT userid FROM users WHERE email = 'olivia.harris@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '8 days' + INTERVAL '1 hour'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'Printer printing incorrect date'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Closed'),
    (SELECT userid FROM users WHERE email = 'olivia.harris@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '7 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Scanner communications failure'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
    (SELECT userid FROM users WHERE email = 'daniel.carter@bluecore.example'),
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'Scanner communications failure'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Investigating'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '20 hours'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Printer communications issue'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
    (SELECT userid FROM users WHERE email = 'sarah.bennett@amfoods.example'),
    CURRENT_TIMESTAMP - INTERVAL '10 days'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'Printer communications issue'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Investigating'),
    (SELECT userid FROM users WHERE email = 'olivia.harris@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '10 days' + INTERVAL '2 hours'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'Printer communications issue'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Closed'),
    (SELECT userid FROM users WHERE email = 'olivia.harris@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '9 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Product trigger sensor fault'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
    (SELECT userid FROM users WHERE email = 'emma.wilson@bluecore.example'),
    CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'Product trigger sensor fault'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Waiting for Site'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Low carton barcode read rate'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Open'),
    (SELECT userid FROM users WHERE email = 'alex.morgan@amfoods.example'),
    CURRENT_TIMESTAMP - INTERVAL '14 days'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'Low carton barcode read rate'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Investigating'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '14 days' + INTERVAL '1 hour'
),
(
    (SELECT incidentid FROM incidents WHERE title = 'Low carton barcode read rate'),
    (SELECT statusid FROM ticketstatus WHERE statusdesc = 'Closed'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    CURRENT_TIMESTAMP - INTERVAL '13 days'
);

--Incident Notes created by support engineers helping to resolve
INSERT INTO incident_notes
    (incident_id, user_id, note, created_at)
VALUES
(
    (SELECT incidentid FROM incidents WHERE title = 'Low barcode read rate'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    'Initial checks indicate the scanner is powered and responding. Read rate appears to vary with product position.',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Low barcode read rate'),
    (SELECT userid FROM users WHERE email = 'alex.morgan@amfoods.example'),
    'Operator reports the issue is more noticeable following the latest product changeover.',
    CURRENT_TIMESTAMP - INTERVAL '20 hours'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'PLC disconnected'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    'PLC connection restored after checking network connection and restarting communications service.',
    CURRENT_TIMESTAMP - INTERVAL '4 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Printer printing incorrect date'),
    (SELECT userid FROM users WHERE email = 'olivia.harris@lineassist.example'),
    'Incorrect date was traced to an outdated printer configuration. Configuration corrected and test prints verified.',
    CURRENT_TIMESTAMP - INTERVAL '7 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Scanner communications failure'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    'Scanner remains intermittently reachable. Site has been asked to check network cabling and switch port.',
    CURRENT_TIMESTAMP - INTERVAL '45 minutes'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Printer communications issue'),
    (SELECT userid FROM users WHERE email = 'olivia.harris@lineassist.example'),
    'Printer was reachable locally but communications service was not responding. Service restarted and communication restored.',
    CURRENT_TIMESTAMP - INTERVAL '9 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Product trigger sensor fault'),
    (SELECT userid FROM users WHERE email = 'james.taylor@lineassist.example'),
    'Requested confirmation from site that the trigger sensor is correctly positioned and free from obstruction.',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
);

--photo eveidnece for incidents, dummmy urls for insert atm
INSERT INTO incident_evidence
    (incident_id, type, uri, description, created_at)
VALUES

(
    (SELECT incidentid FROM incidents WHERE title = 'Low barcode read rate'),
    'photo',
    'demo://evidence/inc-1001/scanner-position.jpg',
    'Photo showing scanner position relative to product path.',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Barcodes not scanning'),
    'photo',
    'demo://evidence/inc-1002/barcode-example.jpg',
    'Example of barcode printed on carton.',
    CURRENT_TIMESTAMP - INTERVAL '3 hours'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'PLC disconnected'),
    'photo',
    'demo://evidence/inc-1003/plc-status.jpg',
    'Photo of PLC status indicators.',
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Date printer offline'),
    'photo',
    'demo://evidence/inc-1004/printer-display.jpg',
    'Photo of printer display showing offline condition.',
    CURRENT_TIMESTAMP - INTERVAL '45 minutes'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Printer printing incorrect date'),
    'photo',
    'demo://evidence/inc-1005/incorrect-date.jpg',
    'Example product showing incorrect printed date.',
    CURRENT_TIMESTAMP - INTERVAL '8 days'
);

--diagnostic sessions recorded
INSERT INTO diagnostic_sessions
    (incident_id, diagnostic_type, started_at, completed_at)
VALUES
(
    (SELECT incidentid FROM incidents WHERE title = 'Low barcode read rate'),
    'barcode_read_rate',
    CURRENT_TIMESTAMP - INTERVAL '1 day' - INTERVAL '30 minutes',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'PLC disconnected'),
    'plc_disconnected',
    CURRENT_TIMESTAMP - INTERVAL '5 days' - INTERVAL '30 minutes',
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Printer printing incorrect date'),
    'printer_incorrect_date',
    CURRENT_TIMESTAMP - INTERVAL '8 days' - INTERVAL '45 minutes',
    CURRENT_TIMESTAMP - INTERVAL '8 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Printer communications issue'),
    'printer_communications',
    CURRENT_TIMESTAMP - INTERVAL '10 days' - INTERVAL '30 minutes',
    CURRENT_TIMESTAMP - INTERVAL '10 days'
),

(
    (SELECT incidentid FROM incidents WHERE title = 'Low carton barcode read rate'),
    'barcode_read_rate',
    CURRENT_TIMESTAMP - INTERVAL '14 days' - INTERVAL '30 minutes',
    CURRENT_TIMESTAMP - INTERVAL '14 days'
);

--diagnostic ansers for the sessions
INSERT INTO diagnostic_answers
    (session_id, step_id, answer, created_at)
VALUES

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Low barcode read rate'
        )
    ),
    'barcode-visible',
    'yes',
    CURRENT_TIMESTAMP - INTERVAL '1 day' - INTERVAL '28 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Low barcode read rate'
        )
    ),
    'scanner-fault',
    'no',
    CURRENT_TIMESTAMP - INTERVAL '1 day' - INTERVAL '24 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Low barcode read rate'
        )
    ),
    'scanner-position',
    'requires adjustment',
    CURRENT_TIMESTAMP - INTERVAL '1 day' - INTERVAL '15 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'PLC disconnected'
        )
    ),
    'plc-powered',
    'yes',
    CURRENT_TIMESTAMP - INTERVAL '5 days' - INTERVAL '27 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'PLC disconnected'
        )
    ),
    'plc-network-status',
    'communication fault',
    CURRENT_TIMESTAMP - INTERVAL '5 days' - INTERVAL '20 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'PLC disconnected'
        )
    ),
    'connection-restored',
    'yes',
    CURRENT_TIMESTAMP - INTERVAL '5 days' - INTERVAL '5 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Printer printing incorrect date'
        )
    ),
    'printer-online',
    'yes',
    CURRENT_TIMESTAMP - INTERVAL '8 days' - INTERVAL '40 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Printer printing incorrect date'
        )
    ),
    'printer-date-config',
    'incorrect',
    CURRENT_TIMESTAMP - INTERVAL '8 days' - INTERVAL '30 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Printer printing incorrect date'
        )
    ),
    'configuration-corrected',
    'yes',
    CURRENT_TIMESTAMP - INTERVAL '8 days' - INTERVAL '10 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Printer communications issue'
        )
    ),
    'printer-powered',
    'yes',
    CURRENT_TIMESTAMP - INTERVAL '10 days' - INTERVAL '25 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Printer communications issue'
        )
    ),
    'printer-local-interface',
    'working',
    CURRENT_TIMESTAMP - INTERVAL '10 days' - INTERVAL '20 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Printer communications issue'
        )
    ),
    'communications-restored',
    'yes',
    CURRENT_TIMESTAMP - INTERVAL '10 days' - INTERVAL '5 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Low carton barcode read rate'
        )
    ),
    'barcode-visible',
    'yes',
    CURRENT_TIMESTAMP - INTERVAL '14 days' - INTERVAL '25 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Low carton barcode read rate'
        )
    ),
    'scanner-fault',
    'no',
    CURRENT_TIMESTAMP - INTERVAL '14 days' - INTERVAL '20 minutes'
),

(
    (
        SELECT id FROM diagnostic_sessions
        WHERE incident_id = (
            SELECT incidentid FROM incidents
            WHERE title = 'Low carton barcode read rate'
        )
    ),
    'product-changeover',
    'yes',
    CURRENT_TIMESTAMP - INTERVAL '14 days' - INTERVAL '10 minutes'
);

COMMIT;
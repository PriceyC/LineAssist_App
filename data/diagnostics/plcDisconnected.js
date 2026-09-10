//diagnostic definition for plc disconnection
//troubleshooting step by step process for site

const plcDisconnected = {
    id: 'plc_disconnected',
    name: 'PLC Disconnected',
    description: 'Troubleshoot a PLC communication failure.',
    steps: [
        {
            id: 'plc_powered',
            question: 'Is the PLC powered?',
            type: 'boolean'
        },
        {
            id: 'plc_status',
            question: 'What is the PLC program status?',
            type: 'select',
            options: [
                'Run',
                'Run-Rem',
                'Program',
                'Fault'
            ]
        },
        {
            id: 'plc_power_cycle',
            question: 'Does a power cycle of the PLC resolve the issue?',
            type: 'boolean'
        }
    ]
};

module.exports = plcDisconnected;
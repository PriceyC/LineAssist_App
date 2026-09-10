//diagnostic definition for Printer Comms
//troubleshooting step by step process for site

const printerComms = {
    id: 'printer_comms',
    name: 'Printer Communication',
    description: 'Troubleshoot a printer communication failure.',
    steps: [
        {
            id: 'printer-powered',
            question: 'Is the Printer powered?',
            type: 'boolean'
        },
        {
            id: 'printer-status',
            question: 'What is the printer status?',
            type: 'select',
            options: [
                'Ready',
                'Standby',
                'Offline',
                'Fault'
            ]
        },
        {
            id: 'Power-cycle',
            question: 'Does a power cycle of the printer resolve the issue?',
            type: 'boolean'
        }
    ]
};

module.exports = printerComms;
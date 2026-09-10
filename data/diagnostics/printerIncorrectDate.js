//diagnostic definition for incorrect date printed
//troubleshooting step by step process for site

const printerIncorrectDate = {
    id: 'printer_incorrect_date',
    name: 'Incorrect date has been printed',
    description: 'Troubleshoot a date compliance failure.',
    steps: [
        {
            id: 'is_date_incorrect',
            question: 'Is the date incorrect?',
            type: 'boolean'
        },
        {
            id: 'scanner_result',
            question: 'What is the result showing from the scanner',
            type: 'select',
            options: [
                'Good read',
                'Mismatch',
                'No read'
            ]
        },
        {
            id: 'printer_job',
            question: 'Does the printer have the correct job loaded?',
            type: 'boolean'
        }
    ]
};

module.exports = printerIncorrectDate;
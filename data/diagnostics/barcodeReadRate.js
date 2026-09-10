//diagnostic definition for barcode read rate
//troubleshooting step by step process for site

const barcodeReadRate = {
    id: 'barcode_read_rate',
    name: 'Barcode Read Rate',
    description: 'Troubleshooting poor read rates on 1D and 2D codes',
    steps: [
        {
            id: 'barcode_visible',
            question: 'Check if the barcode clearly visible in frame of the scanner?',
            type: 'boolean'
        },
        {
            id: 'scanner_fault',
            question: 'Check scanner is powered and showing no faults?',
            type: 'boolean'
        },
        {
            id: 'scanner_timing',
            question: 'How long is there between the trigger and product passing through the scanner?',
            type: 'text'
        }
    ]
};

module.exports = barcodeReadRate;
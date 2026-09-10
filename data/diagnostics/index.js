const barcodeReadRate = require('./barcodeReadRate');
const plcDisconnected = require('./plcDisconnected');
const printerComms = require('./printerComms');
const printerIncorrectDate = require('./printerIncorrectDate');

const diagnostics = [
    barcodeReadRate,
    plcDisconnected,
    printerComms,
    printerIncorrectDate
];

module.exports = diagnostics;
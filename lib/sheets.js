const fs = require('fs');
const { sheets, auth } = require('@googleapis/sheets');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Service account key: either the raw JSON in GOOGLE_CREDENTIALS (handy on Render)
// or a path to the key file in GOOGLE_APPLICATION_CREDENTIALS / ./credentials.json.
function loadCredentials() {
    if (process.env.GOOGLE_CREDENTIALS) {
        return JSON.parse(process.env.GOOGLE_CREDENTIALS);
    }
    const file = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'credentials.json';
    if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    return null;
}

function isConfigured() {
    return Boolean(process.env.SHEET_ID && loadCredentials());
}

// Appends one row: timestamp, first name, last name, email.
async function saveContact({ firstName, lastName, email }) {
    if (!isConfigured()) {
        console.warn('Google Sheets is not configured (SHEET_ID / credentials missing); contact not saved.');
        return { saved: false };
    }

    const client = new auth.GoogleAuth({ credentials: loadCredentials(), scopes: SCOPES });
    const api = sheets({ version: 'v4', auth: client });

    await api.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: process.env.SHEET_RANGE || 'Sheet1!A:D',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[new Date().toISOString(), firstName, lastName, email]],
        },
    });
    return { saved: true };
}

module.exports = { saveContact, isConfigured };

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { owner, projects } = require('./data/projects');
const sheets = require('./lib/sheets');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Available in every template
app.locals.owner = owner;
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(body) {
    const contact = {
        firstName: (body.firstName || '').trim(),
        lastName: (body.lastName || '').trim(),
        email: (body.email || '').trim(),
    };
    const errors = {};
    if (!contact.firstName) errors.firstName = 'Please enter your first name.';
    if (!contact.lastName) errors.lastName = 'Please enter your last name.';
    if (!EMAIL_PATTERN.test(contact.email)) errors.email = 'Please enter a valid email address.';
    return { contact, errors };
}

app.get('/', (req, res) => {
    res.render('index', { projects: projects.filter((p) => p.featured) });
});

app.get('/portfolio', (req, res) => {
    res.render('portfolio', { projects });
});

app.get('/contact', (req, res) => {
    res.render('contact', { contact: {}, errors: {}, formError: null });
});

app.post('/thanks', async (req, res) => {
    const { contact, errors } = validateContact(req.body);

    if (Object.keys(errors).length) {
        return res.status(400).render('contact', { contact, errors, formError: null });
    }

    try {
        await app.locals.saveContact(contact);
    } catch (err) {
        // Keep the visitor on the form so they can try again.
        console.error('Sheets update error:', err.message);
        return res.status(502).render('contact', {
            contact,
            errors: {},
            formError: 'Sorry, your message could not be sent. Please try again in a moment.',
        });
    }

    res.render('thanks', { contact });
});

// Swappable in tests
app.locals.saveContact = sheets.saveContact;

app.use((req, res) => {
    res.status(404).render('404');
});

if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        if (!sheets.isConfigured()) {
            console.log('Google Sheets not configured: contact form submissions will not be saved.');
        }
    });
}

module.exports = app;

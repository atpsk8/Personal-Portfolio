process.env.NODE_ENV = 'test';

const { test, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');

let saved;
beforeEach(() => {
    saved = [];
    app.locals.saveContact = async (contact) => {
        saved.push(contact);
        return { saved: true };
    };
});

const valid = { firstName: 'Sarah', lastName: 'Person', email: 'sarah_person@work.com' };

test('home page links to GitHub and featured projects', async () => {
    const res = await request(app).get('/').expect(200);
    assert.match(res.text, /https:\/\/github\.com\/atpsk8/);
    assert.match(res.text, /JobTracker/);
});

test('portfolio page lists every project', async () => {
    const { projects } = require('../data/projects');
    const res = await request(app).get('/portfolio').expect(200);
    for (const p of projects) assert.ok(res.text.includes(p.name), `missing ${p.name}`);
});

test('contact page has first name, last name and email fields', async () => {
    const res = await request(app).get('/contact').expect(200);
    for (const name of ['firstName', 'lastName', 'email']) {
        assert.match(res.text, new RegExp(`name="${name}"`));
    }
});

test('submitting the form saves the contact and thanks them by name', async () => {
    const res = await request(app).post('/thanks').type('form').send(valid).expect(200);
    assert.match(res.text, /Thank you, Sarah Person!/);
    assert.deepStrictEqual(saved, [valid]);
});

test('invalid submissions are rejected and not saved', async () => {
    const res = await request(app)
        .post('/thanks')
        .type('form')
        .send({ firstName: '', lastName: 'Person', email: 'not-an-email' })
        .expect(400);
    assert.match(res.text, /Please enter your first name/);
    assert.match(res.text, /Please enter a valid email/);
    assert.strictEqual(saved.length, 0);
});

test('a failed save keeps the visitor on the form with their input', async () => {
    app.locals.saveContact = async () => { throw new Error('boom'); };
    const res = await request(app).post('/thanks').type('form').send(valid).expect(502);
    assert.match(res.text, /could not be sent/);
    assert.match(res.text, /value="Sarah"/);
});

test('names are HTML-escaped on the thanks page', async () => {
    const res = await request(app)
        .post('/thanks')
        .type('form')
        .send({ ...valid, firstName: '<script>alert(1)</script>' })
        .expect(200);
    assert.ok(!res.text.includes('<script>alert(1)</script>'));
});

test('unknown pages return 404', async () => {
    await request(app).get('/nope').expect(404);
});

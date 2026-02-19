const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'users.json');

// Ensure data directory and file exist
function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

function readUsers() {
    ensureDb();
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch {
        return [];
    }
}

function writeUsers(users) {
    ensureDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function findByEmail(email) {
    return readUsers().find((u) => u.email === email.toLowerCase()) || null;
}

function findById(id) {
    return readUsers().find((u) => u.id === id) || null;
}

function createUser({ email, password }) {
    const users = readUsers();
    const user = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        password,
        createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    return user;
}

module.exports = { findByEmail, findById, createUser };

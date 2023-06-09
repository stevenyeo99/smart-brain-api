const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const { handleRegister } = require('./controllers/register');
const { handleSignIn } = require('./controllers/signin');
const { handleProfileGet } = require('./controllers/profile');
const { handleApiCall, handleImage } = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE_DB
    }
});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    db.select('*').from('users').then(users => {
        return res.send(users);
    }).catch(err => {
        return res.status(400).send('no users.');
    });
});

app.post('/signin', handleSignIn(db, bcrypt));

app.post('/register', (req, res) => {handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {
    handleProfileGet(req, res, db)
});

app.put('/image', (req, res) => {
    handleImage(req, res, db)
});

app.post('/imageurl', (req, res) => {
    handleApiCall(req, res);
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
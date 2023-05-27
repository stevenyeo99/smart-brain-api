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
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: '123456',
        database: 'smart-brain'
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

app.listen(3000, () => {
    console.log('App is running on port 3000');
});
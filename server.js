const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

app.post('/signin', (req, res) => {

    const { email, password } = req.body;

    db.select('email', 'hash').from('login').where('email', '=', email)
        .then(data => {
            const login = data[0];

            if (bcrypt.compareSync(password, login.hash)) {
                return db.select('*').from('users').where('email', '=', email)
                    .then(users => {
                        return res.json(users[0]);
                    }).catch(err => {
                        throw new Error(err.message)
                    });
            } else {
                return res.status(403).json('invalid user');
            }
        })
        .catch(err => {
            return res.status(400).json('user not found.');
        })
});

app.post('/register', (req, res) => {

    const { email, name, password } = req.body;

    db.transaction(trx => {
        
        const hashPassword = bcrypt.hashSync(password);

        trx('login').insert({
            email: email,
            hash: hashPassword
        }).returning('email')
        .then(loginEmail => {
            
            trx.insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            }).into('users')
            .returning('*')
            .then(data => {
                return res.json(data[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => {
        return res.status(400).json('Unable to register new user.');
    });
});

app.get('/profile/:id', (req, res) => {

    const { id } = req.params;

    db.select('*').from('users').where({
        id
    }).then(data => {
        if (data.length) {
            return res.json(data[0]);
        } else {
            return res.status(400).json('no such user');
        }
        
    }).catch(err => {
        return res.status(500).json('error getting user');
    });
});

app.put('/image', (req, res) => {

    const { id } = req.body;

    db('users').where('id', id)
        .increment('entries', 1)
        .returning('*')
        .then(data => {
            return res.json(data[0]);
        })
        .catch(err => {
            return res.status(404).json('no such user');
        });
});

app.listen(3000, () => {
    console.log('App is running on port 3000');
});
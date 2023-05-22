const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

const database = {
    users: [
        {
            id: 1,
            name: 'Suzy',
            email: 'stevenyeo70@gmail.com',
            password: 'Test123',
            entries: 0,
            joined: new Date()
        },
        {
            id: 2,
            name: 'Shinta',
            email: 'shintabella99@gmail.com',
            password: 'Test123',
            entries: 0,
            joined: new Date()
        }
    ]
};

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {

    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('Error Login');
    }
});

app.post('/register', (req, res) => {

    const { email, name, password } = req.body;

    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(password, hash);
    });

    database.users.push({
        id: database.users.length + 1,
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });

    return res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {

    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id == id) {
            found = true;
            res.json(user);
        }
    });

    if (!found) {
        return res.status(404).json('no such user');
    }
});

app.put('/image', (req, res) => {

    const { id } = req.body;
    let found = false;
    
    database.users.forEach(user => {
        if (user.id == id) {
            found = true;
            user.entries++;
            res.json(user);
        }
    });

    if (!found) {
        return res.status(404).json('no such user');
    }
});

app.listen(3000, () => {
    console.log('App is running on port 3000');
});
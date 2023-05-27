const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('invalid email or password');
    }

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
};

module.exports = {
    handleSignIn
}
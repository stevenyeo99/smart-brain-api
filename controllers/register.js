const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json('Incorrect Form Submission');
    }

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
};

module.exports = {
    handleRegister: handleRegister
}
const handleProfileGet = (req, res, db) => {
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
}

module.exports = {
    handleProfileGet
}
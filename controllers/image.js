const PAT = '99aca85930584d0aa188655e856ed5b6';

const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const handleApiCall = (req, res) => {

    const { input: IMAGE_URL } = req.body;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [{
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(500).json('unable to detect face.');
        });
}

const handleImage = (req, res, db) => {
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
}

module.exports = {
    handleApiCall,
    handleImage
};
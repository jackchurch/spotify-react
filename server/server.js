const express = require('express');
const cors = require('cors')
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser')

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId:'3c26054ef4454bc8abcf878cc435d33d',
        clientSecret:'b24f3cf0f51844128383bc62a5af5526',
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(
        (data) => {
          console.log(data.body);

          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
    }).catch(() => {
            res.sendStatus(400)
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId:'3c26054ef4454bc8abcf878cc435d33d',
        clientSecret:'b24f3cf0f51844128383bc62a5af5526'
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.accessToken, 
            expiresIn: data.body.expiresIn
            // accessToken: data.body.access_token,
            // refreshToken: data.body.refresh_token, 
            // expiresIn: data.body.expires_in
        })
    }).catch(() => {
        res.sendStatus(400)
    })
})

app.listen(3001)
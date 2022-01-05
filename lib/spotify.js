import SpotifyWebApi from 'spotify-web-api-node'

const scopes = [
    'user-read-email',
    'user-read-currently-playing',
    'user-top-read',
    'user-read-playback-state'
].join(',')

const params = {
    scope: scopes,
}

const queryParamString = new URLSearchParams(params)
export const LOGIN_URL = "https://accounts.spotify.com/authorize?" + queryParamString.toString()

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

export default spotifyApi
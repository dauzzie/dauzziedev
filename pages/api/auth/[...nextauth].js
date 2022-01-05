import spotifyApi, { LOGIN_URL } from "@/lib/spotify"
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
        // console.log("Refreshed token", refreshedToken)

        return {
            ...token,
            accessToken: refreshedToken.accessToken,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            // 1 hr as 3600 returns from spotifyAPI
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
            // replace if new one came back else fall back to old token
        }
    } catch (e) {
        console.error(e)

        return {
            ...token,
            error: "RefreshAccessTokenError"
        }
    }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages : {
        signIn: '/login'
    },
    callbacks: {
        async jwt( { token, account, user }) {
            // initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000 // ms
                }
            }

            if(Date.now() < token.accessTokenExpires) {
                console.log("Existing access token is valid")
                return token
            }

            // if expires

            console.log("Access token has expired. Refreshing...")
            return await refreshAccessToken(token)
        },

        async session({session, token}) {
            session.user.accessToken = token.accessToken
            session.user.refreshToken = token.refreshToken
            session.user.username = token.username

            return session
        }
    }
})
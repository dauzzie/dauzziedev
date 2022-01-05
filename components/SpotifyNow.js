import Link from './Link'
import PlayIcon from '../public/static/images/play-icon.svg'
import PauseIcon from '../public/static/images/pause-icon.svg'
import useSpotify from 'hooks/useSpotify'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { currentTrackState } from 'atoms/currentTrackAtom'
import { playbackState } from 'atoms/playbackAtom'
import {useRecoilState } from 'recoil'
import { isPlayingState } from 'atoms/playingAtom'
import SpotifySVG from '../public/static/images/spotify.svg'

export default function SpotifyNow() {

    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()

    const [currTrack, setCurrTrack] = useRecoilState(currentTrackState)
    const [playback, setPlayback] = useRecoilState(playbackState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrTrack(data.body.item);
            })
        }
    }, [session, spotifyApi])

    useEffect(() => {
        if(spotifyApi.getAccessToken()) {
            spotifyApi.getMyCurrentPlaybackState().then((data) => {
                setPlayback(data.body);
                setIsPlaying(data.body.is_playing)
            })
        }
    }, [session, spotifyApi])

    return (
        <div className="flex flex-col overflow-x-auto px-5 sm:px-6 lg:px-7">
            <div className="flex space-x-4">
            <Link href={"/login"}>
                {/* <img className="w-6 h-6 my-4" src="https://links.papareact.com/9xl" alt=""/> */}
                <SpotifySVG className={`w-7 h-7 my-${session?.user? 4 : 6}`}/>
            </Link>
            {
                currTrack? (
                    <div className="flex flex-col overflow-x-auto justify-center">
                        <div className="flex space-x-4">
                        <button className="py-4">
                            {
                                isPlaying?  (
                                <PauseIcon className='fill-current h-6 w-6 text-gray-700 dark:text-gray-200'/>) : (
                                    <PlayIcon className='fill-current h-6 w-6 text-gray-700 dark:text-gray-200'/>
                                )
                            }
                        </button>
                        <img className="w-8 h-8 my-4" src={currTrack?.album.images[0].url} alt=""/>
                        <div className="my-2">
                        <p>{currTrack.artists.reduce((rest, artist) => [...rest, artist.name], []).join(", ")}</p>
                        <p>{currTrack.name}</p>
                        </div>

                        </div>


                    </div>
                    ) : (
                        <div className="flex space-x-4 overflow-x-auto">
                        <p>Not playing</p>
                        <p className="prose">- Spotify</p>
                    </div>
                    )
            }
            </div>


        </div>
    )
}

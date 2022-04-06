import React, {useContext, useEffect, useState} from 'react';
import {Card, CardActions, CardContent, CardMedia, CircularProgress, IconButton, Typography} from "@mui/material";
import {Pause, PlayArrow, Save} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import {useMutation, useSubscription} from "@apollo/client";
import {GET_SONGS} from "../graphql/subscriptions";
import {SongContext} from "../App";
import {ADD_QUEUED_SONG} from "../graphql/mutations";

const useStyle = makeStyles(theme => ({
    container: {
        margin: theme.spacing(3)
    },
    songInfoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    songInfo: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    thumbnail: {
        objectFit: 'cover',
        width: 140,
        height: 140
    }
}))

function SongList(props) {
    const {data, loading, error}= useSubscription(GET_SONGS)
    const classes = useStyle();

    if (loading) {
        return (
            <div
                style={{
                    display:'flex',
                    flexDirection: 'column',
                    marginTop: '2rem',
                    alignItems: 'center'
                }}
            >
                <CircularProgress/>
            </div>
        )
    }
    if (error) {
        console.log(error)
        return <div>Something went wrong</div>
    }
    return (
        <div>{data.songs.map((song) => {
            return <Song song={song} key={song.id}/>
        })}</div>
    );

    function Song({song}) {
        const {thumbnail, title, artist, id} = song;
        const {state, dispatch}= useContext(SongContext);
        const [addOrRemoveFromQueue] = useMutation(ADD_QUEUED_SONG, {
            onCompleted:  data => {
                localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue))
            }
        })
        const [currentSongPlaying, setCurrentPlaying] = useState('');

        useEffect(() => {
            const currentPlayingSong = state.isPlaying && id === state.song.id;
            setCurrentPlaying(currentPlayingSong);
        }, [state.isPlaying, state.id, id])

        function handleTogglePlay() {
            dispatch({type: 'SET_SONG', payload: {song}})
            dispatch(state.isPlaying ? {type: "PAUSE_SONG"} : {type: "PLAY_SONG"})
        }

        function handleSaveSong () {
            addOrRemoveFromQueue({
                variables: {input: { ...song, __typename: 'song'}}
            })
        }

        return <Card className={classes.container}>
            <div className={classes.songInfoContainer}>
                <CardMedia image={thumbnail} className={classes.thumbnail}/>
                <div className={classes.songInfo}>
                    <CardContent >
                        <Typography variant={'h5'} gutterBottom component={'h2'}>
                            {title}
                        </Typography>
                        <Typography variant={'body1'}  component={'p'} color={'secondary'}>
                            {artist}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton color={"primary"} size={'small'} onClick={handleTogglePlay}>{currentSongPlaying ? <Pause/>:<PlayArrow/>}</IconButton>
                        <IconButton color={"secondary"} size={'small'} onClick={handleSaveSong}><Save/></IconButton>
                    </CardActions>
                </div>
            </div>
        </Card>
    }
}

export default SongList;
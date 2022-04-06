import React, {useContext, useEffect, useRef, useState} from 'react';
import {Card, CardContent, CardMedia, IconButton, Slider, Typography} from "@mui/material";
import {Pause, PlayArrow, SkipNext, SkipPrevious} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import {SongContext} from "../App";
import ReactPlayer from "react-player";
import {useQuery} from "@apollo/client";
import {GET_QUEUED_SONGS} from "../graphql/queries";

const useStyles = makeStyles(theme =>( {
    container: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 15px'
    },
    content: {
        flex: '1 0 auto'
    },
    thumbnail: {
        width: 150
    },
    controls : {
        display: 'flex',
     alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
},
    playIcon: {
        height: 38,
        width: 38
    }
}))
function SongPlayer(props) {
    const classes = useStyles()
    const {state, dispatch} = useContext(SongContext);
    const [played, setPlayed] = useState(0);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [seek, setSeek] = useState(false);
    const {data} = useQuery(GET_QUEUED_SONGS);
    const [positionInQueue, setPositionInQueue] = useState(0);
    const seekRef = useRef();

    useEffect(() => {
        const songPositionInQueue = data.queue.findIndex(song => song.id === state.song.id)
        setPositionInQueue(songPositionInQueue)
    }, [data.queue, state.song.id])

    useEffect(() => {
        const nextSong = data.queue[positionInQueue + 1];
        if (played >= 0.98 && nextSong) {
            setPlayed(0)
            dispatch({type: 'SET_SONG', payload: {song: nextSong}})
        }
    }, [data.queue, dispatch, played, positionInQueue])

    function handlePlayPrevSong() {
        const prevSong = data.queue[positionInQueue - 1];
        if (prevSong) {
            setPlayed(0)
            dispatch({type: 'SET_SONG', payload: {song: prevSong}})
        }
    }

    function handlePlayNextSong() {
        const nextSong = data.queue[positionInQueue + 1];
        if (nextSong) {
            setPlayed(0)
            dispatch({type: 'SET_SONG', payload: {song: nextSong}})
        }
    }

    function handleTogglePlay() {
        dispatch(state.isPlaying ? {type: "PAUSE_SONG"} : {type: "PLAY_SONG"})
    }

    function handleProgressChange(event, newValue) {
        setPlayed(newValue)
    }

    function handleSeekMouseDown() {
        setSeek(true)    ;

    }

    function handleSeekMouseUp() {
        setSeek(false)    ;
        seekRef.current.seekTo(played)
    }

    function formatDuration(seconds) {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    return (
        <>
            <Card  className={classes.container} variant={'outlined'}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant={'h5'} component={'h3'}>
                            {state.song.title}
                        </Typography>
                        <Typography variant={'subtitle1'} component={'p'}>
                            {state.song.artist}
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <IconButton onClick={handlePlayPrevSong}>
                            <SkipPrevious/>
                        </IconButton>
                            <IconButton onClick={handleTogglePlay}>
                                {state.isPlaying ?   <Pause className={classes.playIcon} /> :
                                    <PlayArrow className={classes.playIcon} />}
                                </IconButton>
                        <IconButton onClick={handlePlayNextSong}>
                            <SkipNext/>
                        </IconButton>
                        <Typography variant={"subtitle1"} component={'p'} color={'textSecondary'}>
                            {formatDuration(playedSeconds)}
                        </Typography>
                    </div>
                    <Slider
                        onMouseDown={handleSeekMouseDown}
                        onMouseUp={handleSeekMouseUp}
                        onChange={handleProgressChange}
                        type={'range'}
                        min={0}
                        max={1}
                        step={0.01}
                        value={played}
                    />
                </div>
                <ReactPlayer
                    ref={seekRef}
                    onProgress ={({played, playedSeconds}) => {
                        if (!seek) {
                            setPlayed(played)
                            setPlayedSeconds(playedSeconds)
                        }
                    }}
                    url={state.song.url}
                    playing={state.isPlaying} hidden/>
                <CardMedia image={state.song.thumbnail} className={classes.thumbnail}/>
            </Card>
        </>
    );
}

export default SongPlayer;
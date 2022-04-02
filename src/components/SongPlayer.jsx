import React, {useContext} from 'react';
import {Card, CardContent, CardMedia, IconButton, Slider, Typography} from "@mui/material";
import {Pause, PlayArrow, SkipNext, SkipPrevious} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import {SongContext} from "../App";

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

    function handleTogglePlay() {
        dispatch(state.isPlaying ? {type: "PAUSE_SONG"} : {type: "PLAY_SONG"})
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
                        <IconButton>
                            <SkipPrevious/>
                        </IconButton>

                            <IconButton onClick={handleTogglePlay}>
                                {state.isPlaying ?   <Pause className={classes.playIcon} /> :
                                    <PlayArrow className={classes.playIcon} />}
                                </IconButton>
                        <IconButton>
                            <SkipNext/>
                        </IconButton>
                        <Typography variant={"subtitle1"} component={'p'} color={'textSecondary'}>
                            00:30:34
                        </Typography>
                    </div>
                    <Slider
                        type={'range'}
                        min={0}
                        max={1}
                        step={0.01}
                    />
                </div>
                <CardMedia image={state.song.thumbnail} className={classes.thumbnail}/>
            </Card>
        </>
    );
}

export default SongPlayer;
import React from 'react';
import {Avatar, Hidden, IconButton, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '50px auto 50px',
        gridGap: 12,
        alignItems: 'center',
        marginTop: 10
    },
    text: {
        textOverflow: "ellipses",
        overflow: 'hidden'
    },
    songInfo: {
      overflow: "hidden",
      whiteSpace: "nowrap"
    },
    avatar: {
        width: 44,
        height: 44,
        // objectFit: 'cover'
    }
}))
function QueuedSongList(props) {
    const classes = useStyles();
    const song ={
        title: 'LUNE',
        artist: 'MOON',
        thumbnail: '/logo512.png'
    }

    return (
        <Hidden only={'xs'}>
            <div style={{ margin: '10px 0'}}>
                <Typography>
                    QUEUE (5)
                </Typography>
                {Array.from({length: 10}, () => song).map((song, i) => {
                    return <RenderQueuedSong key={i} song={song}/>
                })}
            </div>
        </Hidden>
    );

    function RenderQueuedSong({song}) {
        const {thumbnail, title, artist} = song;
        return (
            <div className={classes.container}>
                <Avatar src={thumbnail} className={classes.avatar}/>
                <div className={classes.songInfo}>
                    <Typography variant={'subtitle2'} className={classes.text}>
                        {title}
                    </Typography>
                    <Typography variant={'body2'} color={'textSecondary'} className={classes.text}>
                        {artist}
                    </Typography>

                </div>
                <IconButton>
                    <Delete color={'error'}/>
                </IconButton>
            </div>
        )
    }
}

export default QueuedSongList;
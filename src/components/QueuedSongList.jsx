import React from 'react';
import {Avatar, Hidden, IconButton, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_QUEUED_SONG} from "../graphql/mutations";

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
function QueuedSongList({data}) {
    const classes = useStyles();


    return (
        <Hidden only={'xs'}>
            <div style={{ margin: '10px 0'}}>
                <Typography>
                    QUEUE ({data.queue.length})
                </Typography>
                {data.queue.map((song, i) => {
                    return <RenderQueuedSong key={i} song={song}/>
                })}
            </div>
        </Hidden>
    );

    function RenderQueuedSong({song}) {
        const {thumbnail, title, artist} = song;
        const [addOrRemoveFromQueue] = useMutation(ADD_QUEUED_SONG, {
            onCompleted:  data => {
                localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue))
            }
        });

        function handleRemoveSong() {
            addOrRemoveFromQueue({
                variables: {input: { ...song, __typename: 'song'}}
            })
        }

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
                <IconButton onClick={handleRemoveSong}>
                    <Delete color={'error'}/>
                </IconButton>
            </div>
        )
    }
}

export default QueuedSongList;
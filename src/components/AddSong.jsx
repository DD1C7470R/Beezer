import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField} from "@mui/material";
import {AddBoxOutlined, Link} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";
import SoundCloudPlayer from "react-player/soundcloud";
import YouTubePlayer from "react-player/youtube";
import ReactPlayer from 'react-player';
import {useMutation} from "@apollo/client";
import {ADD_SONG} from "../graphql/mutations";

const useAddSongTheme = makeStyles(theme => ({
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    urlInput: {
        margin: theme.spacing(3),
    },
    addSongButton: {
        margin: theme.spacing(1),
    },
    dialog: {
        textAlign:'center',
    },
    thumbnail: {
        width: '90%'
    }
}))

const DEFAULT_SONG = {
    duration: 0,
    title: "",
    artist: "",
    thumbnail: ""
}

function AddSong(props) {
    const classes  = useAddSongTheme();
    const [dialog, setDialog] = useState(false);
    const [url, setUrl] = useState('');
    const [playable, setPlayable] = useState(false);
    const [addSong] = useMutation(ADD_SONG)
    const [song, setSong] = useState(DEFAULT_SONG)

    function handleDialog() {
        setDialog(prevState => !prevState);
    }

    function handleChangeSongData(event) {
        const {name, value} = event.target;
        setSong(prevSongData => ({
            ...prevSongData,
                [name]: value
        }))
    }

    async function handleAddSong() {
        const {title, duration, artist, url, thumbnail} = song;

        try{
            await addSong({
                variables: {
                    title: title.length > 0 ? title : null,
                    artist: artist.length > 0 ? artist : null,
                    thumbnail: thumbnail.length > 0 ? thumbnail : null,
                    url: url.length > 0 ? url : null,
                    duration: Number( duration / 1000)
                }
            })
            handleDialog();
            setSong(DEFAULT_SONG);
            setUrl('');
        } catch (error) {
            console.log(error)
        }
    }

    async function handleEditSong({player}) {
        const nestedPlayer = player.player.player;
        let songData;
        if (nestedPlayer.getVideoData){
            songData = getYoutubeInfo(nestedPlayer);
        } else if (nestedPlayer.getCurrentSound) {
            songData = await getSoundCloudInfo(nestedPlayer);
        }
        setSong({...songData, url});
    }

    function getYoutubeInfo(player) {
        const duration = player.getDuration();

        const {title, video_id, author} = player.getVideoData();
        const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
        return {
            duration,
            title,
            artist: author,
            thumbnail
        }
    }

    function getSoundCloudInfo(player) {
        return new Promise(resolve => {
            player.getCurrentSound(songData => {
                if (songData) {
                    resolve ( {
                        duration: Number(songData.duration / 1000),
                        title: songData.title,
                        artist: songData.user.username,
                        thumbnail: songData.artwork_url.replace('-large', '-t500x500')
                    } )
                }
            })
        })

    }

    useEffect(() => {
        const isPlayable = SoundCloudPlayer.canPlay(url) || YouTubePlayer.canPlay(url);
        setPlayable(isPlayable);
        }, [url])
;
    function handleError(field) {
        return song[field].length === 0
    }

    const {thumbnail, title, artist} = song;
    return (
        <div className={classes.container}>
            <ReactPlayer url={url} hidden onReady={handleEditSong} />
            <Dialog
                open={dialog}
                onClose={handleDialog}
            >
                <DialogTitle>Add Song</DialogTitle>
                <DialogContent>
                    <img src={thumbnail}
                         alt={'thumbnail'}
                         className={classes.thumbnail}
                    />
                    <TextField
                        onChange={handleChangeSongData}
                        value={title}
                        name={'title'}
                        label={'Title'}
                        fullWidth
                        margin={'dense'}
                        error={handleError('title')}
                        helperText={handleError('title') && 'Fill out title'}
                    />
                    <TextField
                        onChange={handleChangeSongData}
                        value={artist}
                        name={'artist'}
                        label={'Artist'}
                        fullWidth
                        margin={'dense'}
                        error={handleError('artist')}
                        helperText={handleError('artist') && 'Fill out artist'}
                    />
                        <TextField
                        onChange={handleChangeSongData}
                        value={thumbnail}
                        name={'thumbnail'}
                        label={'Thumbnail'}
                        fullWidth
                        margin={'dense'}
                        error={handleError('thumbnail')}
                        helperText={handleError('thumbnail') && 'Fill out thumbnail'}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialog} color={'secondary'} >Cancel</Button>
                    <Button
                        onClick={handleAddSong}
                        variant={'outlined'}
                        color={'primary'}
                    >Add song</Button>
                </DialogActions>
            </Dialog>
            <TextField
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                placeholder={'paste url here'}
                fullWidth
                type={'url'}
                margin={'normal'}
                InputProps={{
                     startAdornment: (
                        <InputAdornment position={'start'}>
                            <Link/>
                        </InputAdornment>
                    )
                }
            }
                className={classes.urlInput}
            />
            <Button
                disabled={!playable}
                onClick={handleDialog}
            variant={'contained'}
            color={ "primary"}
            endIcon={ <AddBoxOutlined/>}
                className={classes.addSongButton}
             style={{ padding: '.9rem 0.8rem', margin: '0.5rem 1rem 0 1rem'}}
            >
                Add
            </Button>
        </div>
    );
}

export default AddSong;
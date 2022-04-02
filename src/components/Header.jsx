import React from 'react';
import {AppBar, Toolbar, Typography} from "@mui/material";
import {HeadsetTwoTone} from "@mui/icons-material";
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles({
    title : {
        marginRight: '18px',
    }
})

function Header(props) {
    const classes = useStyles()
    return (
        <div>
            header
            <AppBar>
                <Toolbar>
                    <HeadsetTwoTone className={classes.title} />
                    <Typography component={'h1'} variant={'h6'} >
                        Beezer music share
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { CssBaseline } from '@material-ui/core';
import LandingHeader from './LandingHeader';


const useStyles = makeStyles((theme)=> ({
    root: {
        minHeight: '100vh',
        backgroundImage:`url(${process.env.PUBLIC_URL + "https://images.unsplash.com/photo-1572286145082-0534d1586f9d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
}));


export default function Home(){
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <CssBaseline/>

        </div>
    )
} 
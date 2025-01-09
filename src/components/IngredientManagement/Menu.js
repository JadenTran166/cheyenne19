import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import listRoute from "../../config/configureRoute";
import Typography from "@material-ui/core/Typography";


const useStyle = makeStyles((theme) => {return {
    root: {
        backgroundColor: '#FFFFFF',
        borderRadius: '5px',
    },
    button: {
        backgroundColor: 'primary',
        textTransform: 'none',
        color: '#EAE7A1',
        '&.MuiIconButton-root': {
            position: 'absolute',
            top: 0,
            right: 0,
            color: '#EAE7A1',
            backgroundColor: theme.palette.error.main,
            borderRadius: 0,
            '&:hover': {
                backgroundColor: theme.palette.error.light,
            },
        },
        fontSize: '0.75rem',
        margin: theme.spacing(1,0,1,0),
        textAlign: 'center',
        minWidth: '10rem',
    },
    container: {
        padding: theme.spacing(2,2,2,2),
        display: 'grid',
        justifyItems: 'center',
        alignContent: 'space-around'
    }
}
})
const route = listRoute.filter((r) => {return r.key === 'manage_connected_site'});
const handleViewConnectedCompanies = (history) => {
    history.push({
        pathname: route[0].path,
        isConnectedClientRoute: false
    })
}
const handleViewConnectedClients = (history) => {
    history.push({
        pathname: route[0].path,
        isConnectedClientRoute: true
    })
}
const handleViewConnectedIngredients = (history) => {
    history.push('')
}
export default function Menu(props){
    const classes = useStyle();
    const history = useHistory();
    return (
        <Box className={classes.root}>
            <Grid container className={classes.container}>
                <Button  variant='contained' color='primary' className={classes.button} onClick={() => {handleViewConnectedCompanies(history)}}>
                    Công ty đã liên kết
                </Button>
                <Button  variant='contained' color='primary' className={classes.button} onClick={() => {handleViewConnectedClients(history)}}>
                    Khách hàng đã liên kết
                </Button>
                <Button  variant='contained'
                         color='primary' className={classes.button} onClick={() => {handleViewConnectedIngredients(history)}}>
                    Nguyên liệu liên kết
                </Button>
            </Grid>
        </Box>
    )
}
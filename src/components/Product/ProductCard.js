import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Box, CardMedia } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { ENV_ASSETS_ENDPOINT } from '../../env/local';
import defaultImg from "../../assets/img/default_img.png";
import { noop } from 'lodash';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '20px 20px 0px',
        transition: 'all .3s linear',
        border: 'none',
        borderRadius: 0,
        minHeight: 250,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height : '100%',
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0 0 11px rgba(33,33,33,.2)',
        },
    },
    status: {
        position: 'absolute',
        right: '0',
        top: '0',
        padding: '10px',
        background: theme.palette.secondary.main,
    },
    media: {
        paddingTop: '100%',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    actionButton: {
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    product_name: {
        color: "#9496A5",
        fontWeight: 500,
    },
    text: {
        fontWeight: 500,
    },
    button: {
        width: '80%',
        backgroundColor: "#E35847",
        color: "white",
        '&:hover': {
            backgroundColor: red[300],
        },
    },
    content: {
        padding: '16px 0',
    }
}));

export default function ProductCard(props) {
    const classes = useStyles();
    const { product, imgPath, deleteIngrident, supplier, status } = props
    return (
        <Card className={classes.root} variant="outlined">
            {status === 'pending' && <Box className={classes.status}>Chờ xét duyệt</Box>}
            <CardMedia
                className={classes.media}
                image={
                    imgPath ? `${ENV_ASSETS_ENDPOINT}${imgPath}` : defaultImg
                }
            />
            <CardContent className={classes.content}>
                <Typography variant="body2" className={classes.product_name} component="p">
                    {product.name}
                </Typography>
                <Typography variant="body2" className={classes.text} color="primary" component="p">
                    {supplier?.name}
                </Typography>
            </CardContent>
            <CardActions className={classes.actionButton}>
                <Button
                    variant="contained"
                    size="large"
                    className={classes.button}
                    onClick={deleteIngrident} >
                    Xóa
                </Button>
            </CardActions>
        </Card>
    );
}

ProductCard.propTypes = {
    product: PropTypes.object,
    supplier: PropTypes.object,
    imgPath: PropTypes.string,
    deleteIngrident: PropTypes.func,
};
ProductCard.defaultProps = {
    product: {},
    imgPath: '',
    deleteIngrident: noop
};

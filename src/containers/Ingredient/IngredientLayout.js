import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles, styled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import CommonSearchBar from '../../components/CommonSearchBar';
import ProductCard from '../../components/Product/ProductCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import { noop } from 'lodash';

const Container = styled(Box)({
    'flexGrow': 1,
    'background': 'white',
    'padding': 20,
});

const useStyles = makeStyles({
    root: {
    },
    searchbar: {
    },
    list: {
        marginTop: 20,
    },
    noProduct: {
        padding: 20,
        textAlign: 'center',
    },
    text: {

    }
});


export default function IngredientListLayout(props) {
    const classes = useStyles();
    const { ingredients, isLoading, onValueSearchChange, deleteIngrident } = props

    return (
        <Container>
            <CommonSearchBar value='' onChange={() => { }} className={classes.searchbar} />
            {
                (ingredients && ingredients.length > 0) ? (
                    <Grid container spacing={1} className={classes.list}>
                        {ingredients.map((data, key) => {
                            const productInfo = data.product_id
                            return (
                                <Grid key={key} item xs={3}>
                                    <ProductCard
                                        product={productInfo}
                                        supplier={data.supplier}
                                        imgPath={productInfo.imgs[0] ? productInfo.imgs[0].link : null}
                                        deleteIngrident={() => {
                                            deleteIngrident(data._id)
                                        }}
                                        status={data.verifiedStatus ? data.verifiedStatus : 'accept'}
                                    />
                                </Grid>
                            )
                        })}

                    </Grid>
                ) : (
                        isLoading ? (
                            <Box className={classes.noProduct}>
                                <CircularProgress color="primary" />
                            </Box>

                        )
                            : (
                                <Box className={classes.noProduct}>
                                    <Typography variant="body1" className={classes.text} component="p">
                                        Không tìm thấy Nguyên Liệu
                                </Typography>
                                </Box>

                            )
                    )

            }

        </Container>
    );
}

IngredientListLayout.propTypes = {
    ingredients: PropTypes.array,
    isLoading: PropTypes.bool,
    onValueSearchChange: PropTypes.func,
    deleteIngrident: PropTypes.func,
};
IngredientListLayout.defaultProps = {
    ingredients: [],
    isLoading: false,
    onValueSearchChange: noop,
    deleteIngrident: noop,
};

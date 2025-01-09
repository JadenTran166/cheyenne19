import {
    Box,
    Button,
    makeStyles,
    Typography
} from "@material-ui/core";
import { noop } from "lodash";
import PropTypes from 'prop-types';
import React from "react";
import IngredientTypeFilter from "../../components/FilterBar/IngredientTypeFilter";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: 30,
    },
    text: {
        marginBottom: 20
    },
    button: {
        marginTop: 20,
        width: '50%',
    }
}));

export default function AddIngredient(props) {
    const { onSiteTypeSelected, onTypeChange } = props
    const classes = useStyles();

    return (
        <Box pt={3.5} className={classes.root} px={6}>
            <Typography variant="h6" className={classes.text}>
                Nguồn Gốc Nguyên LIệu
            </Typography>
            <IngredientTypeFilter handleSelectedChange={onTypeChange} disableAllOption={true} />
            <Button
                size='large'
                variant="contained"
                color="primary"
                onClick={() => {
                    onSiteTypeSelected()
                }}
                className={classes.button}>
                <Box color="secondary.main" component="span">
                    Tiếp theo
                </Box>
            </Button>
        </Box>
    );
}

AddIngredient.propTypes = {
    onSiteTypeSelected: PropTypes.func,
    onTypeChange: PropTypes.func
};
AddIngredient.defaultProps = {
    onSiteTypeSelected: noop,
    onTypeChange: noop
};

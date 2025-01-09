import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FilterCategory from 'components/Common/FilterCategory';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { listRouteByKey } from '../../config/configureRoute';

const useStyle = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: '#FFFFFF',
      borderRadius: '5px',
    },
    button: {
      backgroundColor: 'primary',
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
      // fontSize: '0.875rem',
      minHeight: '40px',
      margin: theme.spacing(1, 0, 1, 0),
      textAlign: 'center',
      // minWidth: '11rem',
      '& .MuiButton-label': {
        textTransform: 'uppercase',
      },
      [theme.breakpoints.down('md')]: {
        fontSize: '12px',
      },
    },
    container: {
      padding: theme.spacing(1.5, 2.5, 2.5, 2.5),
      display: 'grid',
      justifyItems: 'center',
      alignContent: 'space-around',
    },
  };
});

export default function Menu(props) {
  const classes = useStyle();
  const history = useHistory();
  const [rerenderCategory, setRerenderCategory] = useState(false);
  const handleViewConnectedCompanies = (history) => {
    history.push(listRouteByKey.manage_connected_site.path);
    setRerenderCategory(!rerenderCategory);
  };
  const handleViewConnectedClients = (history) => {
    history.push(listRouteByKey.manage_connected_site.path + '/customer');
    setRerenderCategory(!rerenderCategory);
  };
  const handleViewConnectedIngredients = (history) => {
    history.push(listRouteByKey.manage_connected_ingredient.path);
  };

  return (
    <Box className={classes.root}>
      <Grid container className={classes.container}>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={() => {
            handleViewConnectedCompanies(history);
          }}>
          Công ty đã liên kết
        </Button>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={() => {
            handleViewConnectedClients(history);
          }}>
          Khách hàng đã liên kết
        </Button>
        {/* <Button
          fullWidth
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={() => {
            handleViewConnectedIngredients(history);
          }}>
          Nguyên liệu liên kết
        </Button> */}
        {/* <CommonCategories
          rerenderCategory={rerenderCategory}
          subCateOnClick={(subCategoryId, subCategoryName) => {
            props.handleFilterBySubCategory(subCategoryId, subCategoryName);
          }}
          categories={props.categories}
        /> */}

        {!props.isHideFilter && (
          <FilterCategory
            // listSubCategoryShow={props.listSubCategory}
            handleActiveSubCategory={props.handleFilterBySubCategory}
            isShowAll
          />
        )}
      </Grid>
    </Box>
  );
}

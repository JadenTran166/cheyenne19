import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Menu from '../../components/ClientManagement/Menu';
import Grid from '@material-ui/core/Grid';
import Item from '../../components/IngredientManagement/Item';
import Box from '@material-ui/core/Box';
import axiosService from '../../config/axiosService';

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(1, 7),
    paddingTop: theme.spacing(2),
    backgroundColor: '#F7F7F7',
    width: '100%',
  },
}));

export default function ConnectedIngredientManagementCtn(props) {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    categories: [],
    subCategoryFilter: '',
  });
  useEffect(() => {
    async function getCategories() {
      const res = await axiosService.get(`/category`);
      setState({ ...state, categories: res.data });
    }
    getCategories();
  }, []);
  const handleFilterBySubCategory = (subCategoryId, subCategoryName) => {
    setState({
      ...state,
      subCategoryFilter: subCategoryId,
    });
  };
  return (
    <Box className={classes.root} mb={4}>
      <div>
        <Grid container className={classes.root}>
          <Grid item lg={3} md={3} xs={3}>
            <Menu
              categories={state.categories}
              handleFilterBySubCategory={handleFilterBySubCategory}
            />
          </Grid>
          <Grid item lg={9} md={9} xs={9}>
            <Item subCategoryFilter={state.subCategoryFilter} />
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

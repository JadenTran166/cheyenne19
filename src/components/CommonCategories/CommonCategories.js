import { Grid, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import CategoryList from './CategoryList';

const useStyles = makeStyles((theme) => ({
  root: {
    '& *': {
      margin: 0,
      padding: 0,
    },
    '& ul': {
      padding: 0,
      margin: '10px 0',
      cursor: 'pointer',
      color: 'black',

      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    '& li': {
      padding: 0,
      margin: '10px 25px',
      color: 'rgba(27, 28, 30, 0.5)',
      '&:hover': {
        // background: 'green',
        color: theme.palette.primary.main,
      },
      '&:active': {
        color: theme.palette.primary.main,
      },
    },
    backgroundColor: '#FFFFFF',
    borderRadius: '0.313rem',
    padding: theme.spacing(3, 0, 0, 0),
    display: 'flex',
    justifyContent: 'flex-start',
    minHeight: 'inherit',
  },
  listSubCategories: {
    color: '#1B1C1E',
    fontSize: '0.875rem',
  },
  title: {
    fontSize: '1rem',
    textTransform: 'uppercase',
    marginTop: 20,
  },
}));

export default function CommonCategories(props) {
  const classes = useStyles();
  const listCategories = props.categories;
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const handleSelectedSubCategory = (subCategoryId, subCategoryName) => {
    setSelectedSubCategoryId(subCategoryId);
    props.subCateOnClick(subCategoryId, subCategoryName);
  };
  useEffect(() => {
    setSelectedSubCategoryId('');
  }, [props.rerenderCategory]);
  const ListCategoriesComponent = listCategories.map((category) => {
    return (
      <Grid
        key={category.id}
        item
        xs={12}
        // md={12}
        className={classes.listSubCategories}>
        <CategoryList
          subCateOnClick={handleSelectedSubCategory}
          childs={category?.sub_category}
          categoryName={category.name}
          selectedSubCategoryId={selectedSubCategoryId}
          rerenderCategory={props.rerenderCategory}
        />
      </Grid>
    );
  });

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} md={12}>
        <Typography>DANH MỤC:</Typography>
        {ListCategoriesComponent}
      </Grid>
    </Grid>
  );
}

import { Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { LeftSideBar } from 'components/SaleNote/LeftSideBar';
import { SaleNoteManage } from 'components/SaleNote/SaleNoteManage';
import React, { useState } from 'react';
import { useLocation } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 3),
    backgroundColor: '#FFFFFF',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3, 3),
      flexDirection: 'column-reverse',
    },
  },
}));
function SaleNote(props) {
  const classes = useStyles();
  const location = useLocation();
  const selectedUser = new URLSearchParams(location?.search).get('user');
  const [filterCategoryId, setFilterCategoryId] = useState([]);
  const [listSubCategory, setListSubCategory] = useState([]);
  return (
    <div className={classes.root}>
      <Grid container className={classes.root}>
        <Grid item lg={3} md={12} xs={12}>
          <LeftSideBar
            selectedUser={selectedUser}
            setFilterCategoryId={setFilterCategoryId}
            filterCategoryId={filterCategoryId}
            listSubCategory={listSubCategory}
          />
        </Grid>
        <Grid item lg={9} md={12} xs={12}>
          <SaleNoteManage
            selectedUser={selectedUser}
            filterCategoryId={filterCategoryId}
            setListSubCategory={setListSubCategory}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default SaleNote;

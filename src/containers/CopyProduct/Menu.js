import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FilterCategory from 'components/Common/FilterCategory';
import React from 'react';

const useStyle = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: '#FFFFFF',
      borderRadius: '5px',
    },
    button: {
      textTransform: 'none',
      color: theme.palette.secondary.main,
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
    danger: {
      backgroundColor: '#E35847',
      color: 'white',
      '&:hover': {
        backgroundColor: '#e93923',
      },
    },
    container: {
      padding: theme.spacing(2, 2, 2, 2),
      display: 'grid',
      justifyItems: 'center',
      alignContent: 'space-around',
    },
  };
});

export default function Menu(props) {
  const classes = useStyle();

  return (
    <Box className={classes.root}>
      <Grid container className={classes.container}>
        <Button
          fullWidth
          variant='contained'
          disabled={!props.isSelected}
          color='primary'
          onClick={() => props.onCopy()}
          className={classes.button}>
          Copy
        </Button>
        <Button
          fullWidth
          variant='contained'
          disabled={!props.isSelected}
          // color="warning"
          onClick={() => props.onClear()}
          className={`${classes.button} ${classes.danger}`}>
          Bỏ chọn
        </Button>

        <FilterCategory
          // listSubCategoryShow={props.listSubCategory}
          handleActiveSubCategory={props.setSelectedSubCategoryId}
          isShowAll
        />
      </Grid>
    </Box>
  );
}

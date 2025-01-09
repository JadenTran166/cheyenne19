import { Box, Button, Grid, makeStyles, Paper } from '@material-ui/core';
import MaterialTable, { MTableToolbar } from 'material-table';
import React, { useState } from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles((theme) => ({
  customToolbar: {
    '& .MuiToolbar-root': {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(0, 1, 0, 2),
      '& .MuiTextField-root': {
        width: '100%',
      },
    },
    '& input[aria-label="Search"]': {
      paddingTop: '12px',
      paddingBottom: '12px',
    },
  },
  stateProductSelled: {
    color: theme.palette.success.main,
  },
  stateProductNotSell: {
    color: theme.palette.error.main,
  },
  customBodyTable: {
    '& .MuiTable-root': {
      minWidth: '1200px',
    },
  },
  formControl: {
    width: '100%',
  },
  typoPromo: {
    color: '#1C523C',
    fontWeight: 'bold',
  },
  typoConnected: {
    color: '#2DCF58',
    fontWeight: 'bold',
  },
  typoVip: {
    color: '#f20d0d',
    fontWeight: 'bold',
  },
  tdBorderRight: {
    borderRight: '1px solid #e0e0e0',
  },
  tableCustom: {
    overflowX: 'initial',
  },
  containerTable: {
    '& .MuiButton-label': {
      textTransform: 'uppercase',
      alignItems: 'center',
    },
  },
  buttonFilter: {
    height: '100%',
  },
}));
function ListTableProduct(props) {
  const classes = useStyles();

  const columns = props.columns.map((column) => {
    return { ...column };
  });

  return (
    <MaterialTable
      tableRef={props.tableRef}
      columns={columns}
      // isLoading={props.isLoading}
      data={props.productData}
      title=''
      options={props.options}
      components={{
        Toolbar: (propsToolbar) => (
          <Grid container className={classes.customToolbar} display='flex'>
            <Grid item xs={12}>
              <Box display='flex'>
                <Box width='100%' height={1}>
                  <MTableToolbar {...propsToolbar} color='secondary' />
                </Box>
                <Box mr={2}>
                  <Button
                    variant={props.options.filtering ? 'contained' : 'outlined'}
                    color='primary'
                    className={classes.buttonFilter}
                    onClick={props.toggleFilter}>
                    <Box
                      component='span'
                      display='flex'
                      justifyContent='center'>
                      <FilterListIcon />
                      <Box ml='5px' whiteSpace='nowrap'>
                        Bộ lọc
                      </Box>
                    </Box>
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ),
        Container: (props) => (
          <Paper {...props} elevation={0} className={classes.containerTable} />
        ),
      }}
      localization={{
        body: {
          emptyDataSourceMessage: 'Chưa có sản phẩm',
        },
        toolbar: {
          searchTooltip: 'Tìm kiếm',
          searchPlaceholder: 'Tìm kiếm',
        },
      }}
    />
  );
}

export default ListTableProduct;

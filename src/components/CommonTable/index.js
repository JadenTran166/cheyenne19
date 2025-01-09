import {
  Box,
  Button,
  Grid,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@material-ui/core';
import MaterialTable, { MTableFilterRow, MTableToolbar } from 'material-table';
import React, { useState } from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';
import PropTypes from 'prop-types';

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
  containerTable: {
    '& .MuiButton-label': {
      textTransform: 'uppercase',
      alignItems: 'center',
    },
    '& .MuiTableSortLabel-icon': {
      opacity: 0.2,
    },
    '& .MuiTableSortLabel-root': {
      whiteSpace: 'nowrap',
    },
  },
  buttonFilter: {
    height: '100%',
  },
}));
function CommonTable(props) {
  const classes = useStyles();

  const columns = props.columns.map((column) => {
    return { ...column };
  });

  return (
    <MaterialTable
      tableRef={props.tableRef}
      columns={columns}
      isLoading={false}
      data={props.data}
      title=''
      options={props.options}
      components={{
        Toolbar: ({ onSearchChanged, ...restPropsToolbar }) => {
          return (
            <Grid container className={classes.customToolbar} display='flex'>
              <Grid item xs={12}>
                <Box display='flex'>
                  <Box width='100%' height={1}>
                    <MTableToolbar
                      {...restPropsToolbar}
                      onSearchChanged={
                        props.handleSearchChange
                          ? props.handleSearchChange
                          : onSearchChanged
                      }
                      color='secondary'
                    />
                  </Box>
                  {props.isFilterButton && (
                    <Box mr={2}>
                      <Button
                        variant={
                          props.options.filtering ? 'contained' : 'outlined'
                        }
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
                  )}
                </Box>
              </Grid>
            </Grid>
          );
        },
        Container: (containerProps) => (
          <Paper
            {...containerProps}
            elevation={0}
            className={classes.containerTable}
          />
        ),
      }}
      localization={{
        toolbar: {
          searchTooltip: 'Tìm kiếm',
          searchPlaceholder: 'Tìm kiếm',
        },
        ...props.localization,
      }}
    />
  );
}

CommonTable.defaultProps = {
  data: [],
  tableRef: null,
  columns: [],
  isFilterButton: false,
};
CommonTable.propTypes = {
  data: PropTypes.instanceOf([PropTypes.array, PropTypes.func]),
  options: PropTypes.object,
  columns: PropTypes.array.isRequired,
  isFilterButton: PropTypes.bool,
  localization: PropTypes.object,
};

export default CommonTable;

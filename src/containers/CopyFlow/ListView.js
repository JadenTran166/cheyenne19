import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import useUserData from 'hooks/useUserData';
import MaterialTable, { MTableToolbar } from 'material-table';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  customToolbar: {
    '& .MuiToolbar-root': {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(0, 2, 0, 2),
      '& .MuiTextField-root': {
        width: '100%',
      },
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
  groupAction: {
    '& .MuiButton-label': {
      textTransform: 'uppercase',
      alignItems: 'center',
    },
  },
  vipColor: {
    color: theme.palette.secondary.main,
  },
}));
export default function CopyFlowListView(props) {
  const classes = useStyles();
  const { connectedSiteList, openDetail, handleUnlinkOnClick } = props;
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const [columnList, setColumnList] = useState([]);
  const columns = columnList.map((column) => {
    return { ...column };
  });

  const [optionsListProduct, setOptionsListProduct] = useState({
    headerStyle: {
      fontWeight: 'bold',
    },
    searchFieldVariant: 'outlined',
    searchFieldStyle: {
      width: '100%',
    },
    grouping: false,
    showTextRowsSelected: false,
    showSelectAllCheckbox: false,
    searchFieldAlignment: 'left',
    showTitle: false,
    filtering: false,
  });

  useEffect(() => {
    setColumnList([
      {
        title: 'Tên công ty',
        field: 'name',
        minWidth: '150',
        render: (data) => {
          return data.name;
        },
      },
      {
        title: 'Ngày liên kết',
        field: 'connectedDate',
        render: (data) => {
          return data.connectedDate;
        },
      },
      {
        title: 'Số sản phẩm copy',
        field: 'productNumber',
        minWidth: '150px',
        render: (data) => {
          return data.totalCopiedProducts;
        },
      },
      {
        title: 'Nguồn gốc Copy',
        field: 'origin',
        minWidth: '200px',
        render: (data) => {
          return data.origin;
        },
      },
      {
        title: 'Trạng thái',
        field: 'connectedStatus',
        render: (data) => {
          return (
            <div
              className={data.isVip ? classes.vipColor : {}}
              style={
                data.isVip
                  ? {}
                  : { color: data.connectedDate ? '#2DCF58' : '#f20d0d' }
              }>
              <div>
                {data.connectedDate
                  ? data.isVip
                    ? 'Khách Hàng Vip'
                    : 'Đã Liên Kết'
                  : 'Chưa liên kết'}
              </div>
            </div>
          );
        },
      },
      {
        title: 'Thao tác',
        field: 'action',
        sorting: false,
        filtering: false,
        render: (data) => {
          return (
            <Box display='inline-flex' ml={-2}>
              <Button
                onClick={() => {
                  openDetail(data);
                }}>
                <Box component='span' color='#0B86D0' whiteSpace='noWrap'>
                  Xem chi tiết
                </Box>
              </Button>
              {userData?.site?.id === data.imported_site._id &&
                data.connectedDate && (
                  <Button
                    onClick={() => {
                      handleUnlinkOnClick(data.id, data.name);
                    }}>
                    <Box component='span' color='#E35847'>
                      Hủy
                    </Box>
                  </Button>
                )}
            </Box>
          );
        },
      },
    ]);
    //   }
  }, [connectedSiteList]);

  return (
    <Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        p={2}>
        <Typography variant='h6'>
          <Box
            fontWeight='bold'
            component='div'
            style={{ textTransform: 'uppercase' }}>
            Dây Chuyển Phân Phối Sản Phẩm
          </Box>
        </Typography>
      </Box>
      <MaterialTable
        tableRef={props.tableRef}
        columns={columns}
        // isLoading={props.isLoading}
        data={connectedSiteList}
        title=''
        options={optionsListProduct}
        components={{
          Toolbar: (propsToolbar) => (
            <Grid container className={classes.customToolbar} display='flex'>
              <Grid item xs={12}>
                <Box display='flex'>
                  <Box width='100%' height={1} mb={3}>
                    <MTableToolbar {...propsToolbar} color='secondary' />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          ),
          Container: (props) => (
            <Paper
              {...props}
              elevation={0}
              className={classes.containerTable}
            />
          ),
        }}
        localization={{
          body: {
            emptyDataSourceMessage: 'Chưa có liên kết',
          },
          toolbar: {
            searchTooltip: 'Tên sản phẩm muốn tìm',
            searchPlaceholder: 'Tên sản phẩm muốn tìm',
          },
        }}
      />
    </Box>
  );
}

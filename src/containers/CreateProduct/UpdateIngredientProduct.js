import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import MaterialTable, { MTableToolbar, MTableGroupbar } from 'material-table';
import React, { useEffect, useRef } from 'react';
import CommonConfirmStatus from '../../components/CommonConfirmStatus';
import { ENV_ASSETS_ENDPOINT } from '../../env/local';
function UpdateIngredientProduct(props) {
  const { ingredients_data, selected_ingre } = props;
  const listIdSelectIngre = selected_ingre.map((item) => item._id);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const tableRef = useRef(null);

  useEffect(() => {
    tableRef.current.dataManager.data.map((item) => {
      item.tableData.checked = listIdSelectIngre.includes(item._id);
    });
  }, [selected_ingre]);
  return (
    <Box width={1}>
      <Grid container spacing={matches ? 1 : 3}>
        <Grid item xs={12} sm={8}>
          <MaterialTable
            tableRef={tableRef}
            columns={[
              {
                title: 'Mã sản phẩm',
                field: 'id',
                render: (data) => {
                  return data._id.slice(-4);
                },
              },
              {
                title: 'Hình ảnh',
                field: 'img',
                render: (data) => {
                  return (
                    <img
                      style={{ maxWidth: '100%', width: '150px' }}
                      alt={
                        data?.product_id?.imgs[0]
                          ? data.product_id.imgs[0].alt
                          : ''
                      }
                      src={
                        data?.product_id?.imgs[0]
                          ? ENV_ASSETS_ENDPOINT +
                            '/' +
                            data.product_id.imgs[0].link
                          : ''
                      }
                    />
                  );
                },
              },
              { title: 'Tên', field: 'product_id.name' },
              {
                title: 'Nhà cung cấp',
                editable: 'never',
                field: 'site_name',
                render: (rowData) => {
                  let status = 'confirm';
                  if (rowData.importedSiteType === 'connected-site') {
                    switch (rowData.verifiedStatus) {
                      case 'pending':
                        status = 'noHave';
                        break;
                      case 'accept':
                        status = 'confirm';
                        break;
                      default:
                        status = 'unconfirmed';
                        break;
                    }
                  }
                  if (rowData) {
                    // if (rowData.product_id.supplier) {
                    //   return (
                    //     <CommonConfirmStatus
                    //       status={status}
                    //       nameSite={rowData.product_id.supplier.name}
                    //     />
                    //   );
                    // } else {
                    //   return <CommonConfirmStatus status="noHave" />;
                    // }
                    return (
                      <CommonConfirmStatus
                        isNewTab='true'
                        status={
                          rowData.supplier
                            ? rowData.importedSiteType === 'temp-site'
                              ? 'unconfirmed'
                              : 'confirm'
                            : 'noHave'
                        }
                        // : PropTypes.oneOf(['confirm', 'unconfirmed', 'noHave']),
                        idSite={
                          rowData.importedSiteType !== 'temp-site' &&
                          rowData.supplier &&
                          rowData.supplier.id
                        }
                        nameSite={
                          rowData.supplier
                            ? rowData.supplier.name
                            : 'Không rõ nguồn gốc'
                        }></CommonConfirmStatus>
                    );
                  }
                },
              },
            ]}
            data={ingredients_data.ingredientsFilter}
            title=''
            options={{
              selection: true,
              selectionProps: (data) => {
                return {
                  color: 'primary',
                };
              },
              headerStyle: {},
            }}
            onSelectionChange={(data, rowData) => {
              props.handleSelectRow(data);
            }}
            components={{
              Toolbar: (props) => (
                <MTableToolbar
                  {...props}
                  showTextRowsSelected={false}
                  color='secondary'
                />
              ),
            }}
            localization={{
              body: {
                emptyDataSourceMessage: 'Chưa có dữ liệu',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant='h6' color='primary'>
            Đã chọn
          </Typography>
          <Box overflow='auto' mt='1'>
            {selected_ingre?.length > 0 &&
              selected_ingre.map((ing, index) => {
                let status = 'confirm';
                if (ing.importedSiteType === 'connected-site') {
                  switch (ing.verifiedStatus) {
                    case 'pending':
                      status = 'noHave';
                      break;
                    case 'accept':
                      status = 'confirm';
                      break;
                    default:
                      status = 'unconfirmed';
                      break;
                  }
                }
                let confirmStatus;
                if (ing) {
                  // if (ing.product_id.supplier) {
                  //   confirmStatus = (
                  //     <CommonConfirmStatus
                  //       status={status}
                  //       nameSite={ing.product_id.supplier.name}
                  //     />
                  //   );
                  // } else {
                  //   confirmStatus = <CommonConfirmStatus status="noHave" />;
                  // }
                  confirmStatus = (
                    <CommonConfirmStatus
                      status={
                        ing.supplier
                          ? ing.importedSiteType === 'temp-site'
                            ? 'unconfirmed'
                            : 'confirm'
                          : 'noHave'
                      }
                      // : PropTypes.oneOf(['confirm', 'unconfirmed', 'noHave']),
                      idSite={
                        ing.importedSiteType !== 'temp-site' &&
                        ing.supplier &&
                        ing.supplier.id
                      }
                      nameSite={
                        ing.supplier ? ing.supplier.name : 'Không rõ nguồn gốc'
                      }></CommonConfirmStatus>
                  );
                }

                return (
                  <Box
                    key={ing._id}
                    py={1}
                    borderBottom='0.3px solid #E9EDEB'
                    px={2.5}>
                    <Grid container alignItems='center'>
                      <Grid item xs={4}>
                        <Box component='div' textOverflow='ellipsis'>
                          {ing.product_id.name}
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box component='div' textOverflow='ellipsis'>
                          {confirmStatus}
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          variant='text'
                          onClick={() => props.handleRemoveRow(ing)}>
                          <Box component='span' color='error.main'>
                            Xóa
                          </Box>
                        </Button>
                      </Grid>
                    </Grid>
                    {/* <Typography variant="body1">
                      {index}.{ing.product_id.name}- {ing.site.name}
                    </Typography> */}
                  </Box>
                );
              })}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default React.memo(UpdateIngredientProduct);

import { Avatar, CircularProgress, lighten } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import cn from 'classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';

const useStyle = makeStyles((theme) => {
  return {
    root: {
      width: '100%',
      boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
      padding: '10px 10px',
    },
    listWrapper: {
      maxHeight: 467,
      overflow: 'auto',
    },
    itemWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
    itemWrapperActive: {
      background: lighten(theme.palette.primary.light, 0.9),
    },
    photo: {
      width: 50,
      height: 50,
      border: '1px solid #efefef',
      borderRadius: '50%',
    },
    photoWrapper: {
      padding: 5,
      marginRight: 5,
    },
    buttonWrapper: {
      display: 'flex',
      marginLeft: 'auto',
      height: 40,
    },
    buttonView: {
      padding: '0 10px',
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
    buttonDelete: {
      padding: '0 10px',
      color: 'red',
      cursor: 'pointer',
    },
    addMore: {
      color: theme.palette.primary.main,
      marginTop: 5,
      padding: 5,
      textAlign: 'center',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    less: {
      color: theme.palette.secondary,
      marginTop: 5,
      padding: 5,
      textAlign: 'center',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  };
});
export function UserList(props) {
  const classes = useStyle();
  const history = useHistory();

  const {
    users,
    total,
    handleUserView,
    handleUserDelete,
    handleViewMore,
    handleShowLess,
    isLoading,
    emptyMessage,
    hideBoxShadow,
    highlightItem,
    deleteAble,
    viewAble,
    handleUserDeleteAll,
    deleteAllAble,
  } = props;

  const renderListItem = (user) => {
    if (!user) return <></>;
    return (
      <Box
        key={user._id}
        className={cn({
          [classes.itemWrapper]: true,
          [classes.itemWrapperActive]:
            highlightItem && highlightItem === user._id,
        })}
        py={1}>
        <Box className={classes.photoWrapper}>
          <Avatar className={classes.photo} />
        </Box>
        <Box>
          <Box fontSize={16} fontWeight={500}>
            {`${user?.first_name || ''} ${user?.name || ''}`}{' '}
            {highlightItem && highlightItem === user._id ? `(đang xem)` : ''}
          </Box>
          <Box fontSize={14}>
            {user?.email || 'không có email'} -{' '}
            {user.local_phone_number || 'không có số điện thoại'}
          </Box>
        </Box>
        <Box className={classes.buttonWrapper}>
          {viewAble && (
            <Box
              fontSize={14}
              fontWeight={500}
              className={classes.buttonView}
              onClick={() => handleUserView(user)}>
              xem
            </Box>
          )}
          {deleteAble && (
            <Box
              fontSize={14}
              fontWeight={500}
              className={classes.buttonDelete}
              onClick={() => handleUserDelete(user)}>
              xóa
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      className={classes.root}
      boxShadow={hideBoxShadow ? 'none !important' : ''}>
      {users?.length > 0 ? (
        <>
         {deleteAllAble && (
            <Box
              fontSize={14}
              fontWeight={500}
              className={classes.buttonDelete}
              textAlign="end"
              onClick={() => handleUserDeleteAll()}>
              Xóa tất cả
            </Box>
          )}
          <Box className={classes.listWrapper}>
            {props.users.map((user) => renderListItem(user))}
          </Box>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              {users?.length >= 3 &&
                users?.length < 7 &&
                users?.length < total && (
                  <Box className={classes.addMore} onClick={handleViewMore}>
                    Xem thêm
                  </Box>
                )}
              {users?.length > 3 && users?.length === total && (
                <Box className={classes.less} onClick={handleShowLess}>
                  Thu gọn
                </Box>
              )}
            </>
          )}
        </>
      ) : (
        <Box p={2} textAlign='center'>
          {emptyMessage || 'Không có dữ liệu'}
        </Box>
      )}
    </Box>
  );
}

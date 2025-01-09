import {
  Avatar,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { cloneDeep, remove } from 'lodash';
import React, { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import { useHistory } from 'react-router-dom';
import defaultImg from '../../../assets/img/default_img.png';
import { UserList } from './UserList';

const useStyle = makeStyles((theme) => {
  return {
    root: {
      width: '100%',
      height: '100%',
    },
    button: {
      marginLeft: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontWeight: 700,
    },
    form_footer: {
      padding: '15px 24px 30px',
      textAlign: 'end',
    },
    info: {
      alignItems: 'center',
      display: 'flex',
    },
    itemWrapper: {
      display: 'flex',
      alignItems: 'center',
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
    selectUser: {
      marginRight: 10,
      '& .dropdown-heading': {
        height: '50px !important',
      },
    },
    filter: {
      padding: 25,
      paddingTop: 0,
    },
    button: {
      width: '100%',
      height: '100%',
    },
  };
});
export function ShareModal(props) {
  const classes = useStyle();
  const history = useHistory();
  const {
    title,
    isSeller,
    users,
    isLoading,
    handleViewMore,
    handleShowLess,
    handleUserDelete,
    total,
    emptyMessage,
    usersToShare,
    isFetchingUsersToShare,
    setSearchKeyWord,
    onShareToUser,
    setIsClosePopper,
    handleUserDeleteAll,
  } = props;
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleBackClick = (e) => {
    setIsClosePopper(false);
  };

  const renderListItem = (user, haveButton = true) => {
    if (!user) return <></>;
    return (
      <Box key={user.id} className={classes.itemWrapper}>
        <Box className={classes.photoWrapper}>
          <Avatar className={classes.photo} />
        </Box>
        <Box>
          <Box fontSize={16} fontWeight={500}>
            {user?.first_name || ''} {user?.name || ''}
          </Box>
          <Box fontSize={14}>
            {user?.email || 'không có email'} -{' '}
            {user?.local_phone_number || 'không có số điện thoại'}
          </Box>
        </Box>
        {haveButton && (
          <Box className={classes.buttonWrapper}>
            <Box
              fontSize={14}
              fontWeight={500}
              className={classes.buttonDelete}>
              xóa
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const renderSelectedValue = (key, item) => {
    const handleDeleteSelectedItem = () => {
      const cloneData = cloneDeep(selectedUsers);
      remove(cloneData, (user) => user.value === item.value);
      setSelectedUsers(cloneData);
    };

    return (
      <Chip
        variant='outlined'
        label={item?.label}
        color='primary'
        size='small'
        key={key}
        style={{ marginRight: 10 }}
        onDelete={() => {
          handleDeleteSelectedItem();
        }}
      />
    );
  };

  return (
    <Box component={Paper} className={classes.root}>
      <Box p={3}>
        <Typography variant='h5' className={classes.title}>
          {title}
        </Typography>
      </Box>
      <Grid container className={classes.filter}>
        <Grid item xs={10}>
          <MultiSelect
            options={usersToShare.map((item) => ({
              value: item._id,
              label: `${item?.first_name || ''} ${item?.name || ''}`,
              email: item.email,
              name: item.name,
              first_name: item?.first_name || '',
              local_phone_number: item.local_phone_number,
            }))}
            // isLoading={isFetchingUsersToShare}
            height={50}
            className={classes.selectUser}
            labelledBy={'user'}
            value={selectedUsers}
            filterOptions={(options, filter) => {
              setSearchKeyWord(filter);
              return options;
            }}
            ItemRenderer={(data) => {
              const { checked, option, onClick, disabled } = data;
              return (
                <div className={`item-renderer ${disabled && 'disabled'}`}>
                  <input
                    type='checkbox'
                    onChange={onClick}
                    checked={checked}
                    tabIndex={-1}
                    disabled={disabled}
                  />
                  {option.value ? (
                    renderListItem(option, false)
                  ) : (
                    <span style={{ marginLeft: 10 }}>{option.label}</span>
                  )}
                </div>
              );
            }}
            valueRenderer={(selected, options) => {
              return selected.length
                ? selected.map((item, index) => {
                    return renderSelectedValue(index, item);
                  })
                : '';
            }}
            hasSelectAll={isSeller ? true : false}
            onChange={setSelectedUsers}
            overrideStrings={{
              selectSomeItems: !isSeller
                ? 'Chọn người dùng để chia sẻ'
                : 'Chọn nhân viên để chia sẻ',
              allItemsAreSelected: isSeller
                ? 'Tất cả nhân viên'
                : 'Tất cả người dùng',
              selectAll: 'Chọn tất cả',
              search: 'Nhập tên / email / số điện thoại',
              clearSearch: 'Xóa hết các lựa chọn',
              noOptions: 'Không có người dùng nào phù hợp',
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            className={classes.button}
            variant='contained'
            color='primary'
            disabled={!selectedUsers || selectedUsers.length === 0}
            onClick={() => {
              setSelectedUsers([]);
              onShareToUser(selectedUsers);
            }}>
            Chia sẻ
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <Box p={2}>
        <UserList
          users={users}
          isLoading={isLoading}
          handleViewMore={handleViewMore}
          handleShowLess={handleShowLess}
          handleUserDelete={handleUserDelete}
          total={total}
          deleteAble
          emptyMessage={emptyMessage}
          hideBoxShadow
          deleteAllAble
          handleUserDeleteAll={handleUserDeleteAll}
        />
      </Box>
      <Divider />
      <Box className={classes.form_footer}>
        <Button onClick={handleBackClick} variant='outlined'>
          Đóng
        </Button>
      </Box>
    </Box>
  );
}

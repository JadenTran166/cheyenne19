import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ReplyIcon from '@material-ui/icons/Reply';
import FilterCategory from 'components/Common/FilterCategory';
import CommonCategories from 'components/CommonCategories/CommonCategories';
import OldCommonModal from 'components/CommonModal/oldCommonModal';
import axiosService from 'config/axiosService';
import { USER_ROLE } from 'constants/common';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AlertModal } from '../../AlertModal/AlertModal';
import { ShareModal } from './ShareModal';
import { UserList } from './UserList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyle = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: '#FFFFFF',
      borderRadius: '5px',
    },
    backButton: {
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      borderRadius: 5,
      width: '100%',
      height: 47,
      fontSize: 15,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      background: theme.palette.primary.main,
      padding: 10,
      color: 'white',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      [theme.breakpoints.down('lg')]: {
        fontSize: 12,
      },
    },
    shareButton: {
      height: 35,
      boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
      [theme.breakpoints.down('lg')]: {
        fontSize: 12,
      },
    },
    collapseView: {
      [theme.breakpoints.up('lg')]: {
        display: 'none',
      },
    },
    normalView: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
  };
});

export function LeftSideBar(props) {
  const classes = useStyle();

  const [isOpenShare, setIsOpenShare] = useState(false);
  const userData = useSelector((state) => state?.user?.userData);
  const isSeller = !!userData?.site;
  const history = useHistory();

  const [sharedMember, setSharedMember] = useState([]);
  const [sharedUserLimit, setSharedUserLimit] = useState(3);
  const [sharedUserTotal, setSharedUserTotal] = useState(0);
  const [isFetchingSharedUser, setIsFetchingSharedUser] = useState(true);

  const [beSharedNotes, setBeSharedNotes] = useState([]);
  const [beSharedNotesLimit, setBeSharedNotesLimit] = useState(3);
  const [beSharedNotesTotal, setBeSharedNotesTotal] = useState(0);
  const [isFetchingBeSharedNotes, setIsFetchingBeSharedNotes] = useState(true);

  const [searchKeyWord, setSearchKeyWord] = useState('');
  const [usersToShare, setUsersToShare] = useState([]);
  const [isFetchingUsersToShare, setIsFetchingUsersToShare] = useState(true);
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { selectedUser, setFilterCategoryId, filterCategoryId } = props;

  const handleFilterBySubCategory = (subCategoryId, subCategoryName) => {
    setFilterCategoryId([subCategoryId]);
  };

  const fetchSharedUser = () => {
    axiosService
      .get(`/memo-paper/share/member`, {
        offset: 0,
        limit: sharedUserLimit,
      })
      .then((res) => {
        setSharedMember(res?.data?.users || []);
        setSharedUserTotal(res?.data?.paging?.total || 0);
        setIsFetchingSharedUser(false);
      })
      .catch((data) => {
        const messageTrigger = {
          title: data.err || `Không thể xem danh sách người được chia sẻ`,
          timer: 1500,
          icon: 'error',
        };
        AlertModal(messageTrigger);
        setIsFetchingSharedUser(false);
      });
  };

  const fetchBeSharedNotes = () => {
    if (!isSeller) {
      axiosService
        .get(`/memo-paper/user/shared`, {
          offset: 0,
          limit: beSharedNotesLimit,
        })
        .then((res) => {
          setBeSharedNotes(res?.data?.users || []);
          setBeSharedNotesTotal(res?.data?.paging?.total || 0);
          setIsFetchingBeSharedNotes(false);
        })
        .catch((data) => {
          const messageTrigger = {
            title:
              data.err || `Không thể xem danh sách giấy ghi nhớ được chia sẻ`,
            timer: 1500,
            icon: 'error',
          };
          AlertModal(messageTrigger);
          setIsFetchingBeSharedNotes(false);
        });
    }
  };

  const fetchUserToShare = () => {
    if (!isSeller || (isSeller && userData?.role === USER_ROLE.OWNER)) {
      axiosService
        .get(`/memo-paper/user/lookup`, {
          offset: 0,
          limit: 999,
          search: searchKeyWord,
        })
        .then((res) => {
          setUsersToShare(res?.data?.users || []);
          setIsFetchingUsersToShare(false);
        })
        .catch((data) => {
          if (data?.response?.data?.code === 'ACCESS_DENINED') {
            const messageTrigger = {
              title:
                data.err ||
                `Bạn không có quyền truy cập giấy ghi nhớ của công ty`,
              timer: 2500,
              icon: 'error',
            };
            AlertModal(messageTrigger);
            setTimeout(() => {
              if (selectedUser) {
                history.push('/note');
              } else {
                history.push('/portal');
              }
            }, 1000);
          } else {
            const messageTrigger = {
              title: data.err || `Không thể xem danh sách người dùng`,
              timer: 1500,
              icon: 'error',
            };
            AlertModal(messageTrigger);
          }
          setIsFetchingUsersToShare(false);
        });
    }
  };

  const viewMoreSharedMember = () => {
    if (sharedUserLimit < 7) {
      setSharedUserLimit(99);
    }
  };

  const showLessSharedMember = () => {
    if (sharedUserLimit > 3) {
      setSharedUserLimit(3);
    }
  };

  const deleteSharedMember = (user = 'all') => {
    Swal.mixin({
      timer: 4000,
      confirmButtonText: 'Tiếp tục',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
    })
      .fire({
        icon: 'info',
        title: `Bạn có thật sự muốn bỏ chia sẻ  ${
          user === 'all' ? 'tất cả' : user?.name || ''
        } ?`,
        showCancelButton: true,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axiosService
            .post(
              `/memo-paper/prevent-share`,
              { users: user === 'all' ? 'remove-all' : [user._id] },
              {}
            )
            .then((res) => {
              fetchSharedUser();
              fetchUserToShare();
            })
            .catch((data) => {
              const messageTrigger = {
                title: data.err || `Không thể bỏ chia sẻ người dùng này`,
                timer: 1500,
                icon: 'error',
              };
              AlertModal(messageTrigger);
            });
        }
      });
  };

  const deleteSharedNote = (user) => {
    Swal.mixin({
      timer: 4000,
      confirmButtonText: 'Tiếp tục',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
    })
      .fire({
        icon: 'info',
        title: `Bạn có muốn xóa giấy ghi nhớ của ${user?.name || ''} ?`,
        showCancelButton: true,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axiosService
            .delete(`/memo-paper/refuse-share/${user._id}`, {}, {})
            .then((res) => {
              fetchBeSharedNotes();
              history.push('/note');
            })
            .catch((data) => {
              const messageTrigger = {
                title: data.err || `Không thể xóa giấy ghi nhớ này`,
                timer: 1500,
                icon: 'error',
              };
              AlertModal(messageTrigger);
            });
        }
      });
  };

  const viewMoreBeSharedNotes = () => {
    if (beSharedNotesLimit < 7) {
      setBeSharedNotesLimit(99);
    }
  };

  const showLessBeSharedNotes = () => {
    if (beSharedNotesLimit > 3) {
      setBeSharedNotesLimit(3);
    }
  };

  const onViewBeSharedNotes = (user) => {
    if (user && user._id) {
      history.push(`/note?user=${user._id}`);
    }
  };

  const onShareToUser = (selectedUsers) => {
    if (selectedUsers?.length > 0) {
      const formatSelectedUsers =
        !isSeller &&
        selectedUsers.length === usersToShare.length &&
        !searchKeyWord
          ? 'all-employee'
          : selectedUsers.map((item) => item?.value);
      axiosService
        .post(`/memo-paper/share`, { users: formatSelectedUsers }, {})
        .then((res) => {
          const messageTrigger = {
            title: `Chia sẻ thành công`,
            timer: 2000,
            icon: 'success',
          };
          AlertModal(messageTrigger);
          fetchUserToShare();
          fetchSharedUser();
        })
        .catch((data) => {
          const messageTrigger = {
            title: data.err || `Không thể Chia sẻ những người dùng này`,
            timer: 1500,
            icon: 'error',
          };
          AlertModal(messageTrigger);
        });
    }
  };

  useEffect(() => {
    fetchSharedUser();
  }, [sharedUserLimit]);

  useEffect(() => {
    if (!isSeller) {
      fetchBeSharedNotes();
    }
  }, [beSharedNotesLimit]);

  useEffect(() => {
    fetchUserToShare();
  }, [searchKeyWord]);

  useEffect(() => {
    fetchUserToShare();
  }, []);

  return (
    <Box className={classes.root}>
      {selectedUser && (
        <Box mb={4}>
          <Button
            variant='contained'
            color='primary'
            className={classes.backButton}
            onClick={() => {
              history.push('/note');
            }}>
            Quay lại giấy của bạn
          </Button>
        </Box>
      )}
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
        className={classes.collapseView}
        style={{ marginBottom: 20 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1d-content'
          id='panel1d-header'>
          <Typography style={{ fontWeight: 500 }}>Quản lí chia sẻ</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ flexDirection: 'column' }}>
          <Box mb={4} width='100%'>
            <Box className={classes.header}>
              <Box className={classes.title}>
                {isSeller ? 'Nhân viên có thể xem' : 'User đã chia sẻ'}
              </Box>
              {(!isSeller ||
                (isSeller && userData?.role === USER_ROLE.OWNER)) && (
                <Box>
                  <Button
                    className={classes.shareButton}
                    variant='contained'
                    color='primary'
                    startIcon={<ReplyIcon />}
                    onClick={() => {
                      setIsOpenShare(true);
                    }}>
                    Chia sẻ
                  </Button>
                </Box>
              )}
            </Box>
            <UserList
              users={sharedMember}
              isLoading={isFetchingSharedUser}
              handleViewMore={viewMoreSharedMember}
              handleShowLess={showLessSharedMember}
              handleUserDelete={deleteSharedMember}
              total={sharedUserTotal}
              deleteAble={
                !isSeller || (isSeller && userData?.role === USER_ROLE.OWNER)
              }
              deleteAllAble={
                !isSeller || (isSeller && userData?.role === USER_ROLE.OWNER)
              }
              handleUserDeleteAll={deleteSharedMember}
              emptyMessage='Giấy ghi nhớ chưa được chia sẻ'
            />
          </Box>
          {!isSeller && (
            <Box mb={4} width='100%'>
              <Box className={classes.header}>
                <Box className={classes.title}>Đã chia sẻ với bạn</Box>
              </Box>
              <UserList
                users={beSharedNotes}
                isLoading={isFetchingBeSharedNotes}
                handleViewMore={viewMoreBeSharedNotes}
                handleShowLess={showLessBeSharedNotes}
                handleUserView={onViewBeSharedNotes}
                handleUserDelete={deleteSharedNote}
                total={beSharedNotesTotal}
                emptyMessage='Bạn chưa được chia sẻ giấy ghi nhớ'
                highlightItem={selectedUser}
                viewAble
              />
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
        className={classes.collapseView}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2d-content'
          id='panel2d-header'>
          <Typography style={{ fontWeight: 500 }}>Lọc theo danh mục</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box width='100%'>
            <FilterCategory
              handleActiveSubCategory={handleFilterBySubCategory}
              isShowAll
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box mb={4} width='100%' className={classes.normalView}>
        <Box className={classes.header}>
          <Box className={classes.title}>
            {isSeller ? 'Nhân viên có thể xem' : 'User đã chia sẻ'}
          </Box>
          {(!isSeller || (isSeller && userData?.role === USER_ROLE.OWNER)) && (
            <Box>
              <Button
                className={classes.shareButton}
                variant='contained'
                color='primary'
                startIcon={<ReplyIcon />}
                onClick={() => {
                  setIsOpenShare(true);
                }}>
                Chia sẻ
              </Button>
            </Box>
          )}
        </Box>
        <UserList
          users={sharedMember}
          isLoading={isFetchingSharedUser}
          handleViewMore={viewMoreSharedMember}
          handleShowLess={showLessSharedMember}
          handleUserDelete={deleteSharedMember}
          total={sharedUserTotal}
          deleteAble={
            !isSeller || (isSeller && userData?.role === USER_ROLE.OWNER)
          }
          deleteAllAble={
            !isSeller || (isSeller && userData?.role === USER_ROLE.OWNER)
          }
          handleUserDeleteAll={deleteSharedMember}
          emptyMessage='Giấy ghi nhớ chưa được chia sẻ'
        />
      </Box>
      {!isSeller && (
        <Box mb={4} className={classes.normalView}>
          <Box className={classes.header}>
            <Box className={classes.title}>Đã chia sẻ với bạn</Box>
          </Box>
          <UserList
            users={beSharedNotes}
            isLoading={isFetchingBeSharedNotes}
            handleViewMore={viewMoreBeSharedNotes}
            handleShowLess={showLessBeSharedNotes}
            handleUserView={onViewBeSharedNotes}
            handleUserDelete={deleteSharedNote}
            total={beSharedNotesTotal}
            emptyMessage='Bạn chưa được chia sẻ giấy ghi nhớ'
            highlightItem={selectedUser}
            viewAble
          />
        </Box>
      )}

      <Box className={classes.normalView}>
        <FilterCategory
          handleActiveSubCategory={handleFilterBySubCategory}
          isShowAll
        />
      </Box>

      <OldCommonModal
        isOpen={isOpenShare}
        handleClose={() => {
          setIsOpenShare(false);
        }}
        maxWidth='md'>
        <ShareModal
          title={isSeller ? 'Danh sách nhân viên' : 'Chia sẻ với người khác'}
          isSeller={isSeller}
          users={sharedMember}
          isLoading={isFetchingSharedUser}
          handleViewMore={viewMoreSharedMember}
          handleShowLess={showLessSharedMember}
          handleUserDelete={deleteSharedMember}
          total={sharedUserTotal}
          usersToShare={usersToShare}
          isFetchingUsersToShare={isFetchingUsersToShare}
          setSearchKeyWord={setSearchKeyWord}
          onShareToUser={onShareToUser}
          setIsClosePopper={setIsOpenShare}
          emptyMessage='Giấy ghi nhớ chưa được chia sẻ'
          handleUserDeleteAll={deleteSharedMember}
        />
      </OldCommonModal>
    </Box>
  );
}

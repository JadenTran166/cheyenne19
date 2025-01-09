import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Icon,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import axiosService from 'config/axiosService';
import useUserData from 'hooks/useUserData';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  root: {},
  list: {
    padding: 0,
    listStyleType: 'none',
    '& li': {
      marginBottom: theme.spacing(2),
    },
  },
  tableTitle: {
    textAlign: 'center',
    '& h6': {
      fontWeight: 'bold',
    },
    '&:first-child': {
      textAlign: 'left',
    },
  },
  row: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: '1px solid ' + theme.palette.grey[200],
  },
  checkBox: {
    display: 'flex',
    justifyContent: 'center',
    margin: 0,
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    '& .material-icons': {
      color: theme.palette.grey[500],
      marginLeft: theme.spacing(2),
      cursor: 'pointer',
    },
  },
}));

export default function EditSharing(props) {
  const { userData } = useUserData();
  const [settings, setSettings] = useState([]);
  const [editedValue, setEditedValue] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect(() => {
    axiosService
      .get('/site/' + userData?.site?._id)
      .then((res) => {
        const settings = res?.data?.site?.settings || [];
        setSettings(settings);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const handleCheck = (key, type, checked) => {
    const index = settings.findIndex((item) => {
      return item.key === key;
    });
    const _settings = [...settings];
    _settings[index].value[type] = checked;
    // Tracking the value edited
    const editValue = `${key}.${type}`;
    if (!editedValue.includes(editValue)) {
      setEditedValue([...editedValue, editValue]);
    } else {
      setEditedValue([...editedValue.filter((key) => key !== editValue)]);
    }
    setSettings(_settings);
  };
  const handleSave = () => {
    setIsSubmit(true);
    axiosService
      .patch('/site/' + userData?.site?._id, {
        settings,
      })
      .then((res) => {
        const new_settings = res.data?.site?.settings;
        setSettings(new_settings);
        setEditedValue([]);
        setIsSubmit(false);
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
        });
      })
      .catch((err) => {
        setIsSubmit(false);
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại',
        });
      });
  };
  const classes = useStyles();
  return (
    <Box>
      <Box component={Paper} p={3} mb={3}>
        <Typography variant='h5'>Hướng dẫn:</Typography>
        <ul className={classes.list}>
          <li>
            <Typography variant='body1'>
              - Tick vào ô tương ứng với đối tượng bạn muốn hiển thị thông tin.
            </Typography>
          </li>
          <li>
            <Typography variant='body1'>- Nhấn nút Lưu để lưu lại.</Typography>
          </li>
        </ul>
        <Button
          variant='contained'
          color='primary'
          style={{
            minWidth: '70px',
            minHeight: '40px',
          }}
          disabled={editedValue.length === 0 || isSubmit}
          onClick={handleSave}>
          {!isSubmit ? (
            'Lưu'
          ) : (
            <CircularProgress size={20} color='primary'></CircularProgress>
          )}
        </Button>
      </Box>
      <Box component={Paper} p={3}>
        <Grid container className={classes.row}>
          <Grid item xs={6} className={classes.tableTitle}>
            <Typography variant='subtitle1'>Danh mục</Typography>
          </Grid>
          <Grid item xs={2} className={classes.tableTitle}>
            <Typography variant='subtitle1'>Khách lạ</Typography>
          </Grid>
          <Grid item xs={2} className={classes.tableTitle}>
            <Typography variant='subtitle1'>Khách đã liên kết</Typography>
          </Grid>
          <Grid item xs={2} className={classes.tableTitle}>
            <Typography variant='subtitle1'>Khách VIP</Typography>
          </Grid>
        </Grid>
        {settings.map((setting) => {
          return (
            <Grid container className={classes.row} key={setting.key}>
              <Grid item xs={6} className={classes.label}>
                <Typography>{setting.label}</Typography>
                <Tooltip title={setting.description} placement='top' arrow>
                  <Icon>info</Icon>
                </Tooltip>
              </Grid>
              <Grid item xs={2}>
                <FormControlLabel
                  key={`${setting.key}.value.public`}
                  className={classes.checkBox}
                  control={
                    <Checkbox
                      checked={setting.value.public}
                      onChange={(event) =>
                        handleCheck(setting.key, 'public', event.target.checked)
                      }
                      name={`${setting.key}.value.public`}
                      color='primary'
                    />
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <FormControlLabel
                  key={`${setting.key}.value.connected`}
                  className={classes.checkBox}
                  control={
                    <Checkbox
                      checked={setting.value.connected}
                      onChange={(event) =>
                        handleCheck(
                          setting.key,
                          'connected',
                          event.target.checked
                        )
                      }
                      name={`${setting.key}.value.connected`}
                      color='primary'
                    />
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <FormControlLabel
                  key={`${setting.key}.value.vip`}
                  className={classes.checkBox}
                  control={
                    <Checkbox
                      checked={setting.value.vip}
                      onChange={(event) =>
                        handleCheck(setting.key, 'vip', event.target.checked)
                      }
                      name={`${setting.key}.value.vip`}
                      color='primary'
                    />
                  }
                />
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </Box>
  );
}

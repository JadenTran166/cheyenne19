import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Avatar,
  makeStyles,
} from '@material-ui/core';
import GroupText from './GroupText';
import PreviewAvatarModal from '../PreviewAvatarModal';
import { ENV_ASSETS_ENDPOINT } from 'env/local';

const useStyles = makeStyles((theme) => ({
  img: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  avatar: {
    '& .MuiAvatar-img': {
      // objectFit: 'fill'
    },
    backgroundColor: 'transparent',
    '&:hover': {
      opacity: 0.5,
      cursor: 'pointer',
    },
  },
}));

export default function PortalInfo(props) {
  const { userData } = props;
  const classes = useStyles();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const handleClosePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };
  return (
    <Container>
      <Box py={3} minHeight='227px' display='flex' alignItems='center'>
        <Grid container>
          <Grid item xs={6}>
            <PreviewAvatarModal
              open={isPreviewOpen}
              onClose={() => {
                handleClosePreview();
              }}
              imgSrc={ENV_ASSETS_ENDPOINT + userData?.site?.avatar}
            />
            <Box>
              <Box mb={1}>
                <Typography variant='h5'>
                  <Box component='span' color='background.contrastText'>
                    Xin chào{' '}
                    <Box component='span' fontWeight='700'>
                      {userData?.first_name || ''} {userData?.name || ''} !
                    </Box>
                  </Box>
                </Typography>
              </Box>

              {userData?.current_level?.name === 'business' && (
                <Box mb={1}>
                  <GroupText
                    label='Công ty của bạn là'
                    value={userData?.site?.name || '...'}
                  />
                </Box>
              )}
              <Box mb={1}>
                <GroupText label='Email' value={userData?.email || '...'} />
              </Box>
              <Box mb={1}>
                <GroupText
                  label='Phone'
                  value={userData?.local_phone_number || '...'}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box width={1} display='flex' justifyContent='flex-end'>
              <div className={classes.avatar}>
                <Avatar
                  onClick={() => {
                    setIsPreviewOpen(!isPreviewOpen);
                  }}
                  src={
                    userData?.site?.avatar
                      ? `${ENV_ASSETS_ENDPOINT}${userData?.site?.avatar}`
                      : ''
                  }
                  alt={
                    userData?.site?.avatar ? userData?.site?.name : undefined
                  }
                  className={classes.img}
                  variant='square'
                />
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

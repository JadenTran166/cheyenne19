import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles, Box } from '@material-ui/core';
import cn from 'classnames';
import defaultImg from '../../assets/img/default_img.png';
import PreviewAvatarModal from 'components/PreviewAvatarModal';
import { replaceImg } from 'constants/common';
const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid #9496A5',
    borderRadius: theme.shape.borderRadius2,
    width: '100%',
    // height: (props) => props.size,
    // width: (props) => (props.fullWidth ? '100%' : 'unset'),
    position: 'relative',
    paddingTop: '100%',
    overflow: 'hidden',
  },
  img: {
    objectFit: 'cover',
    objectPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    transform: 'scale(1)',
    transition: '0.3s transform',
    cursor: 'pointer',
    maxWidth: '100%',
    height: '100%',
    width: '100%',
    '&:hover': {
      borderColor: lighten(theme.palette.secondary.light, 0.5),
      transform: ({ isZoom, src }) => (isZoom && src ? 'scale(1.3)' : ''),
      // border: '1px solid',
    },
  },
  active: {
    '& img': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

function CommonImg(props) {
  const classes = useStyles(props);
  const { src, alt, className, isActive, isReview } = props;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  function handleClose() {
    setIsPreviewOpen(!isPreviewOpen);
  }
  return (
    <Box width={props.size}>
      <div
        className={cn({
          [classes.root]: true,
          [classes.active]: isActive,
          [className]: !!className,
        })}>
        <img
          draggable={false}
          className={classes.img}
          src={src || defaultImg}
          alt={alt}
          onError={replaceImg}
          onClick={() => {
            if (isReview) {
              setIsPreviewOpen(true);
            }
          }}
        />
      </div>
      {isReview && (
        <PreviewAvatarModal
          open={isPreviewOpen}
          onClose={handleClose}
          imgSrc={src || defaultImg}
        />
      )}
    </Box>
  );
}

CommonImg.defaultProps = {
  fullWidth: false,
  src: '',
  className: '',
  size: '82px',
  isZoom: false,
  isActive: false,
  isReview: false,
};

CommonImg.propTypes = {
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.string,
  isZoom: PropTypes.bool,
  isActive: PropTypes.bool,
  isReview: PropTypes.bool,
};

export default CommonImg;

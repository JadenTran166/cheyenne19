import { Box, ButtonBase, alpha, Grid, makeStyles } from '@material-ui/core';
import React, { memo, useEffect, useState } from 'react';
import { BaseIcon } from '../../assets/icon/BaseIcon';
import xIcon from '../../assets/icon/xicon.svg';
const useStyles = makeStyles((theme) => ({
  ctn: {
    width: (props) => props.width || '250px',
    height: (props) => props.height || '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '5px dashed ',
    borderRadius: theme.shape.borderRadius,
    borderColor: alpha(theme.palette.primary.main, 0.5),
    cursor: 'pointer',
    '&.multi': {
      width: '100%',
      minHeight: '106px',
      height: 'auto',
      border: '3px dashed',
      borderColor: alpha(theme.palette.primary.main, 0.5),
    },
  },
  img: {
    // width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  },
  groupImg: {
    position: 'relative',
    // width: "80%",
    minHeight: '76px',
  },
  btnRemoveImg: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(50%, -50%)',
    borderRadius: '999px',
  },
}));
function BoxDragDropImage(props) {
  const classes = useStyles(props);
  const { isMulti, isReplaceError } = props;
  const [isErrorImg, setIsErrorImg] = useState(false);
  function handleError(e) {
    if (isReplaceError) {
      setIsErrorImg(true);
    }
  }
  useEffect(() => {
    setIsErrorImg(false);
  }, [props.imgData]);

  if (isMulti) {
    const { listImgData } = props;
    return (
      <div
        className={`${classes.ctn} multi`}
        onClick={(props.isMy && props.onClick) || (() => {})}>
        {listImgData && listImgData.length > 0 ? (
          <Grid container>
            {listImgData.map(({ imageUrl, fileName, listImgData }, index) => (
              <Grid item xs={3} key={index}>
                <Box display='flex' justifyContent='center' p={2}>
                  <Box className={classes.groupImg}>
                    <img
                      alt={fileName}
                      src={imageUrl}
                      className={classes.img}
                    />
                    {props.isMy && (
                      <ButtonBase
                        className={classes.btnRemoveImg}
                        onClick={props.handleRemove(index)}>
                        <img alt='icon x' src={xIcon} />
                      </ButtonBase>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <BaseIcon.Camera color='primary' width='25%' height='50%' />
        )}
      </div>
    );
  }

  const { imageUrl, fileName } = props.imgData;

  return (
    <div className={classes.ctn} onClick={props.onClick}>
      {imageUrl ? (
        isReplaceError && isErrorImg ? (
          <BaseIcon.Camera color='primary' width='50%' height='50%' />
        ) : (
          <img
            alt={fileName}
            src={imageUrl}
            className={classes.img}
            onError={handleError}
          />
        )
      ) : (
        <BaseIcon.Camera color='primary' width='50%' height='50%' />
      )}
    </div>
  );
}
BoxDragDropImage.defaultProps = {
  isMulti: false,
  imgData: {},
  listImgData: [],
  isMy: true,
  isReplaceError: false,
};

export default memo(BoxDragDropImage, (prevProps, nextProps) => {
  const { listImgData, imgData } = prevProps;
  const { listImgData: listImgDataNext, imgData: imgDataNext } = nextProps;
  if (
    listImgData?.length !== listImgDataNext?.length ||
    imgData.imageUrl !== imgDataNext.imageUrl
  )
    return false;
  return true;
});

import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  img: {
    maxWidth: '100%',
    height: '100px',
    objectFit: 'contain',
    objectPosition: 'center',
    width: '100%',
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    display: '-webkit-box',
  },
}));
export default function ProductBasic(props) {
  const { src, alt, name } = props;
  const classes = useStyles();
  return (
    <Box width={1} height={1}>
      <img draggable={false} src={src} alt={alt} className={classes.img} />
      <Typography variant='body1' className={classes.name} title={name}>
        {name}
      </Typography>
    </Box>
  );
}

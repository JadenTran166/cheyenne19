import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { formatDateTime } from 'utils';
const useStyles = makeStyles((theme) => ({
  img: {
    maxWidth: '100%',
    objectFit: 'contain',
    height: '225px',
    width: '100%',
  },
  hr: {
    opacity: 0.24,
    border: '1px solid #000000',
  },
  promoTitle: {
    fontSize: '30px',
    fontWeight: 700,
    marginTop: '30px',
  },
}));
export default function PromoDetail(props) {
  const { src, alt, promoTitle, promoContent, createAt } = props;
  const classes = useStyles();
  return (
    <Box width='100%' p={4}>
      {src && <img className={classes.img} src={src} alt={alt} />}
      <Box textAlign='center'>
        <Typography variant='h2' className={classes.promoTitle}>
          {promoTitle}
        </Typography>
        {createAt && (
          <Typography variant='body2'>{formatDateTime(createAt)}</Typography>
        )}
      </Box>
      <Box px={4} my={2}>
        <hr className={classes.hr} />
      </Box>
      {promoContent && (
        <div dangerouslySetInnerHTML={{ __html: promoContent }}></div>
      )}
    </Box>
  );
}

import { Box, Collapse, makeStyles, useTheme } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(1, 7),
    padding: '15px',
    borderColor: '#ddd',
    backgroundColor: '#fff',
    border: '1px solid transparent',
    borderLeft: '10px solid',
    marginTop: 0,
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
  },
  item: {
    color: theme.palette.grey[500],
    fontWeight: 'normal',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

export default function CategoryItem(props) {
  const [checked, setChecked] = useState(false);
  const classes = useStyles();

  const theme = useTheme();
  return (
    <ul
      onClick={() => {
        setChecked((value) => !value);
      }}
      style={{
        borderLeftColor: props.color,
      }}
      className={classes.root}>
      {props.children}
      <Collapse in={checked}>
        <Box pl={3}>
          {props.data.map((item) => (
            <Box
              className='pointer'
              component='li'
              key={item._id}
              py={1}
              style={
                item._id === props.activeId
                  ? { color: theme.palette.primary.main, fontWeight: 600 }
                  : { color: props.pure_color, fontWeight: 'normal' }
              }
              onClick={(e) => {
                e.stopPropagation();
                if (props.activeId === item._id) {
                  props.handleActive(null);
                } else {
                  props.handleActive(item._id, item.name);
                }
              }}>
              {item.name}
            </Box>
          ))}
        </Box>
        {/* </Paper> */}
      </Collapse>
    </ul>
  );
}

import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: (props) =>
      `repeat(${props.column || 'auto-fill'},minmax(${props.min || '192px'}, ${
        props.max || '1fr'
      }))`,
    gridTemplateRows: (props) =>
      `repeat(${props.row || 'auto-fill'},minmax(${props.min || '192px'}, ${
        props.max || '1fr'
      }))`,
    gridGap: theme.spacing(3),
  },
}));

export default function FeatureListLayout(props) {
  const classes = useStyles(props);

  return <div className={classes.root}>{props.children}</div>;
}

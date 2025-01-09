import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import PropTypes from 'prop-types';
import React from 'react';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  mainText: {
    '& .MuiListItemIcon-root': {
      minWidth: '30px',
    },
    '& .MuiListItemText-root span': {
      fontWeight: 'bold',
      color: '#574537',
      opacity: '0.5',
      whiteSpace: 'nowrap',
    },
  },
  mainIcon: {
    width: '0.75em',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function CommonCollapseBox(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      component='div'
      aria-labelledby='nested-list-subheader'
      className={classes.root}>
      <ListItem button className={classes.mainText} onClick={handleClick}>
        {props.mainIcon ? (
          <ListItemIcon>
            <props.mainIcon className={classes.mainIcon} />
          </ListItemIcon>
        ) : (
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
        )}
        <ListItemText primary={props.mainTitle} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit>
        {props.children}
      </Collapse>
    </List>
  );
}

CommonCollapseBox.propTypes = {
  mainTitle: PropTypes.string.isRequired,
  mainIcon: PropTypes.elementType,
};

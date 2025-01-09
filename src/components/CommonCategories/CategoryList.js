import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(0, 1, 1, 1),
  },
  parentCategory: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subCategory_focus: {
    color: `${theme.palette.primary.main} !important`,
    fontWeight: 600,
  },
  subCategory: {
    color: 'rgba(27, 28, 30, 0.5)',
  },
}));

export default function CategoryList(props) {
  const classes = useStyles();
  const [showItem, setShowItem] = useState(false);
  const { childs } = props;
  const [focus, setFocus] = useState(() => {
    const focus = [];
    for (let i = 0; i < childs.length; ++i) {
      focus.push({
        ...childs[i],
        value: false,
        color: 'rgba(27, 28, 30, 0.5)',
        name: childs[i].name,
      });
    }
    return focus;
  });

  const handleClickParentCategory = () => {
    setShowItem(!showItem);
  };
  const handleSelectSubCategory = (subCategoryId, subCategoryName, e) => {
    e.stopPropagation();
    props.subCateOnClick(subCategoryId, subCategoryName);
  };

  const ItemCategoryComponent = focus.map((item, i) => {
    return (
      <li
        className={
          props.selectedSubCategoryId === item._id
            ? classes.subCategory_focus
            : classes.subCategory
        }
        onClick={(e) => {
          handleSelectSubCategory(item._id, item.name, e);
        }}>
        {item.name}
      </li>
    );
  });

  useEffect(() => {
    setShowItem(false);
  }, [focus, props.rerenderCategory]);

  return (
    <div className={classes.parentCategory}>
      <ul
        onClick={() => {
          handleClickParentCategory();
        }}
        className={classes.root}>
        <Typography variant='body2'>
          {props.categoryName}
          {` (${focus.length})`}
          {showItem ? ItemCategoryComponent : ''}
        </Typography>
      </ul>
    </div>
  );
}

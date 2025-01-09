import React, { useMemo, useRef, useState } from 'react';
import CategoryItem from './CategoryItem';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';

const randomColorArray = [
  '#7dc727',
  '#00a7e7',
  '#ef8311',
  '#00a7ac',
  '#ed1c24',
  '#2744a0',
  '#777777',
  '#FFEC27',
  '#008751',
  '#000000',
  '#FFCCAA',
  '#83769C',
  '#AB5236',
  '#9debe6',
  '#8d198f',
];

export default function FilterCategory(props) {
  const categoryList = useSelector((state) => {
    return state.global.initData.category;
  });
  const [activeId, setActiveId] = useState(() => props.activeId || null);
  const filterCategoryList = useMemo(() => {
    if (props.isShowAll) return categoryList;
    return categoryList
      .map((category) => ({
        ...category,
        sub_category: category.sub_category.filter((subCate) =>
          props.listSubCategoryShow.includes(subCate._id)
        ),
      }))
      .filter((item) => item.sub_category.length);
  }, [props.listSubCategoryShow, categoryList]);

  function handleActiveSubCategory(id, name) {
    setActiveId(id);

    if (typeof handleActiveSubCategory === 'function') {
      props.handleActiveSubCategory(id, name);
    }
  }
  return (
    <Box mt={1}>
      <Box pb={1}>
        <Typography variant='h6'>Danh mục:</Typography>
      </Box>
      {filterCategoryList.map((item, index) => (
        <CategoryItem
          handleActive={handleActiveSubCategory}
          data={item.sub_category}
          key={index}
          color={randomColorArray[index % randomColorArray.length]}
          activeId={activeId}>
          <Typography>{item.name}</Typography>
        </CategoryItem>
      ))}
    </Box>
  );
}

FilterCategory.defaultProps = {
  listSubCategoryShow: [],
  isShowAll: false,
};

FilterCategory.propTypes = {
  activeId: PropTypes.string,
  handleActiveSubCategory: PropTypes.func,
  listSubCategoryShow: PropTypes.array,
  isShowAll: PropTypes.bool,
};

import {
  Box,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import React from 'react';
const useStyles = makeStyles((theme) => {
  return {
    customToolbar: {},
    formControl: {},
  };
});

const SearchWithFilter = (props) => {
  const { category } = props;
  const classes = useStyles();
  const handleSelectItem = (e) => {
    props.handleSelect(e.target.value);
  };
  return (
    <Box width='100%' pl={2}>
      <FormControl
        style={{ width: '100%' }}
        variant='outlined'
        className={classes.formControl}>
        <InputLabel htmlFor='grouped-select'>Danh mục</InputLabel>
        <Select
          defaultValue=''
          value={props.selectedSubCategoryId}
          onChange={(e) => {
            handleSelectItem(e);
          }}
          id='grouped-select'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {category
            ? category.map((cate) => {
                return (
                  <MenuItem
                    key={cate._id}
                    disabled={cate.isParent}
                    style={
                      cate.isParent
                        ? {
                            background: 'white',
                            zIndex: 10,
                            color: 'black',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            display: 'block',
                          }
                        : undefined
                    }
                    value={cate._id}>
                    {cate.isParent ? `-------${cate.name}-------` : cate.name}
                  </MenuItem>
                );
                // const children = cate.sub_category.map((sub) => {
                //   return (
                //     <MenuItem
                //       key={sub._id}
                //       value={sub._id}
                //       onClick={() => {
                //         handleSelectItem(sub._id);
                //       }}>
                //       {sub.name}
                //     </MenuItem>
                //   );
                // });
                // return (
                //   <React.Fragment key={cate._id}>
                //     <MenuItem
                //       style={{
                //         background: 'white',
                //         zIndex: 10,
                //         color: 'black',
                //         textTransform: 'uppercase',
                //         textAlign: 'center',
                //       }}>
                //       -------- {cate.name} --------
                //       {children}
                //     </MenuItem>
                //   </React.Fragment>
                // );
              })
            : ''}
        </Select>
      </FormControl>
    </Box>
  );
};
export default SearchWithFilter;

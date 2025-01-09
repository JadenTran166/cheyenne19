import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

const styled = withStyles(theme => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

class CommonPagination extends Component {
  state = {
    currentPage: this.props.count,
  };

  render() {
    const { classes, handleChangePage, count, page } = this.props;
    return (
      <div className={classes.root}>
        {count > 1 ? (
          <Pagination
            onChange={handleChangePage}
            page={page}
            count={count}
            color='primary'
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default styled(CommonPagination);

CommonPagination.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
  handleChangePage: PropTypes.func,
};

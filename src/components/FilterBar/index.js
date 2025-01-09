import React from 'react';
import { makeStyles, Box, Chip, Typography, Divider } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const Container = styled('div')({
    background: 'white',
    borderRadius: 5,
    padding: '25px 30px',
});
const Title = styled('div')({
    fontSize: 18,
    fontWeight: 400,
    marginBottom: 20,
});
export default function FilterBar(props) {
    const { title, children } = props
    return (
        <Container component='div' fontWeight='600'>
            <Title>{title}:</Title>
            {children}
        </Container>
    );
}

FilterBar.propTypes = {
    title: PropTypes.string,
};
FilterBar.defaultProps = {
    title: '',
};

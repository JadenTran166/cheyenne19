import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
const filterValue = [
    {
        value: "my-site",
        label: "Của chính bạn"
    },
    {
        value: "connected-site",
        label: "Từ site đã liên kết"
    },
    {
        value: "temp-site",
        label: "Từ site tạm"
    },
    {
        value: "all",
        label: "Tất cả"
    }
]

export default function IngredientTypeFilter(props) {
    const { handleSelectedChange, disableAllOption } = props
    const [value, setValue] = React.useState('all');
    let filterOption = filterValue
    if (disableAllOption) {
        filterOption = filterOption.filter(item => item.value !== 'all')
    }

    const handleRadioChange = async (event) => {
        setValue(event.target.value);
        await handleSelectedChange(event.target.value);
    };

    return (
        <RadioGroup aria-label="type-filter" name="quiz" value={value} onChange={handleRadioChange}>
            {
                filterOption.map((filter, key) => <FormControlLabel key={key} value={filter.value}
                    control={<Radio color="primary" />} label={filter.label} />)
            }
        </RadioGroup>
    );
}

IngredientTypeFilter.propTypes = {
    handleSelectedChange: PropTypes.func,
    disableAllOption: PropTypes.bool
};
IngredientTypeFilter.defaultProps = {
    handleSelectedChange: noop,
    disableAllOption: false
};

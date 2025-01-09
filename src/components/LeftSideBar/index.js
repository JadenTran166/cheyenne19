import React, { useState } from 'react';
import { makeStyles, Box, Chip, Typography, Divider } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import FilterBar from '../FilterBar';
import IngredientTypeFilter from '../FilterBar/IngredientTypeFilter';
import CommonCategory from '../FilterBar/CategoryFilter';
import { noop } from 'lodash';
import CommonModal from '../CommonModal';
import AddIngredient from '../../containers/Ingredient/AddIngredient'
import AddNewIngredient from '../../containers/Ingredient/AddNewIngredient';

const Container = styled('div')({
    background: 'white',
    borderRadius: 5,
    padding: '25px 0',
});
const ActionContainer = styled('div')({
});
const Img = styled('div')({
});
const Name = styled('div')({
});
const ButtonGroup = styled('div')({
    padding: '0 30px',
    marginBottom: 20,
});
const OptionBar = styled('div')({
});
export default function LeftSideBar(props) {
    const [openAdModal, setOpenAdModal] = useState(false);
    const [openProductModal, setOpenProductModal] = useState(false);
    const [siteType, setSiteType] = useState("");

    const onSiteTypeSelected = () => {
        setOpenAdModal(false)
        setOpenProductModal(true)
    }
    const onTypeChange = (newSiteType) => {
        setSiteType(newSiteType)
    }

    const { categorys, onSubCategorySelect, handleSelectedChange, fetchIngredient } = props;
    return (
        <Container component='div' fontWeight='600'>
            <ActionContainer>
                <Img />
                <Name />
                <ButtonGroup>
                    <Button fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => { setOpenAdModal(true) }}>
                        <Box color="secondary.main" component="span">
                            Thêm Nguyên Liệu
                        </Box>
                    </Button>
                </ButtonGroup>
                <Divider />
                <OptionBar>
                    <FilterBar title='Danh mục'>
                        <CommonCategory categorys={categorys} onSubCategorySelect={onSubCategorySelect} />
                    </FilterBar>
                    <Divider />
                    <FilterBar title='Nguồn gốc'>
                        <IngredientTypeFilter handleSelectedChange={handleSelectedChange} disableAllOption={false} />
                    </FilterBar>
                </OptionBar>
            </ActionContainer>
            <CommonModal
                isOpen={openAdModal}
                handleClose={() => {
                    setOpenAdModal(false);
                }}
                maxWidth="xs"
            >
                <AddIngredient
                    onTypeChange={onTypeChange}
                    onSiteTypeSelected={onSiteTypeSelected} />
            </CommonModal>
            {
                siteType && (
                    <CommonModal
                        isOpen={openProductModal}
                        handleClose={() => {
                            setOpenProductModal(false);
                        }}
                        maxWidth="md"
                    >
                        <AddNewIngredient
                            fetchIngredient={fetchIngredient}
                            siteType={siteType}
                            handleClose={() => {
                                setOpenProductModal(false);
                            }} />
                    </CommonModal>
                )
            }

        </Container>
    );
}

LeftSideBar.propTypes = {
    categorys: PropTypes.array,
    onSubCategorySelect: PropTypes.func,
    handleSelectedChange: PropTypes.func,
};
LeftSideBar.defaultProps = {
    categorys: [],
    onSubCategorySelect: noop,
    handleSelectedChange: noop,
};

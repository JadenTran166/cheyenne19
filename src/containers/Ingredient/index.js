import { Grid, styled } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import LeftSideBar from '../../components/LeftSideBar';
import IngredientListLayout from './IngredientLayout';
import { Container } from '@material-ui/core';
import { Alert } from '../../utils';
import Typography from '@material-ui/core/Typography';
import axiosService from '../../config/axiosService';

const StyledContainer = styled(Container)({
  background: '#F7F7F7',
});

export default function IngredientList() {
  const [categorys, setcategory] = useState([]);
  const [ingredients, setingredient] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({});

  const fetchCategory = async () => {
    setIsLoading(true);
    try {
      const data = await axiosService
        .get('/category', {})
        .then((res) => res.data);
      setcategory(data);
    } catch (error) {
      Alert.fire({
        icon: 'warning',
        title: "Can't load product data. Try again !",
      });
    } finally {
      // setIsLoading(false);
    }
  };

  const fetchIngredient = async (param) => {
    try {
      const data = await axiosService
        .get('/ingredient-in-site', {
          limit: 99,
          ...param,
        })
        .then((res) => res.data);
      setingredient(data.ingredientsFilter);
    } catch (error) {
      Alert.fire({
        icon: 'warning',
        title: "Can't load product data. Try again !",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIngrident = async (ingredient) => {
    try {
      axiosService
        .delete(
          '/ingredient-in-site',
          {
            ingredient_list: [ingredient],
          },
          {}
        )
        .then(async (res) => {
          Alert.fire({
            icon: 'success',
            title: 'Xóa nguyên liệu thành công',
          });
          await fetchIngredient();
        });
    } catch (error) {
      Alert.fire({
        icon: 'warning',
        title: "Can't load product data. Try again !",
      });
    } finally {
    }
  };

  const onSubCategorySelect = async (subCate) => {
    setFilterData({
      ...filterData,
      sub_categories: subCate,
    });
    await fetchIngredient({
      ...filterData,
      sub_categories: subCate,
    });
  };

  const handleSelectedChange = async (site_type) => {
    setFilterData({
      ...filterData,
      site_type: site_type,
    });
    await fetchIngredient({
      ...filterData,
      site_type: site_type,
    });
  };

  const onValueSearchChange = async (key_work) => {
    setFilterData({
      ...filterData,
      key: key_work,
    });
    await fetchIngredient({
      ...filterData,
      key: key_work,
    });
  };

  useEffect(() => {
    fetchCategory();
    fetchIngredient();
  }, []);

  return (
    <StyledContainer>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <LeftSideBar
            fetchIngredient={fetchIngredient}
            categorys={categorys}
            onSubCategorySelect={onSubCategorySelect}
            handleSelectedChange={handleSelectedChange}
            onValueSearchChange={onValueSearchChange}
          />
        </Grid>
        <Grid item xs={9}>
          <IngredientListLayout
            ingredients={ingredients}
            isLoading={isLoading}
            deleteIngrident={deleteIngrident}
          />
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

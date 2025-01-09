import React, { useEffect, useState } from 'react';

import ReactExport from 'react-data-export';
import { ENV_ASSETS_ENDPOINT } from '../../env/local';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const filterExportData = (productData) => {
  const deepCopyProductData = JSON.parse(JSON.stringify(productData));
  const productExportData = [];

  deepCopyProductData.map((productData) => {
    let newProductExport = {
      name: productData.name,
      hscode: productData.hscode,
      barcode: productData.barcode,
      description: productData.detail_description,
      instruction: productData.instruction,
      preservation: productData.preservation,
      weight: productData.weight,
      sub_category: productData.sub_category
        ? productData.sub_category.name
        : '',
      country: productData.country ? productData.country.name : '',
      ingredients: productData.ingredients.length
        ? productData.ingredients
        : [],
      nutritional_ingredients: productData.nutritional_ingredients.length
        ? productData.nutritional_ingredients
        : [],
      images: productData.imgs.length
        ? productData.imgs
            .map((i) => {
              return `${ENV_ASSETS_ENDPOINT}${i.link}`;
            })
            .toString()
        : '',
      price_list: productData.product_in_site[0].price_list.length
        ? productData.product_in_site[0].price_list
        : [],
      price_list_vip: productData.product_in_site[0].price_list_vip.length
        ? productData.product_in_site[0].price_list_vip
        : [],
      connected_price: productData.product_in_site[0].connected_price
        ? productData.product_in_site[0].connected_price
        : {},
      public_price: productData.product_in_site[0].public_price
        ? productData.product_in_site[0].public_price
        : {},
    };
    /**
     * Special case with ingredient and nutritional ingredient, parse from array to string
     */
    newProductExport.ingredients = newProductExport.ingredients
      .map((i) => {
        return Object.values(i).toString().replace(/,/g, ' ');
      })
      .toString();
    /**
     * Sort order of property in nutritional ingredient
     */
    newProductExport.nutritional_ingredients =
      newProductExport.nutritional_ingredients.map((i) => {
        return { label: i.label, value: `${i.value}${i.unit}` };
      });
    newProductExport.nutritional_ingredients =
      newProductExport.nutritional_ingredients
        .map((i) => {
          return Object.values(i).toString().replace(/,/g, ' ');
        })
        .toString();

    /**
     * Special cases for price
     */
    newProductExport.price_list = newProductExport.price_list.length
      ? newProductExport.price_list
          .map((p) => {
            return `${p.price}d/${p.quantity} sản phẩm`;
          })
          .toString()
      : '';
    newProductExport.price_list_vip = newProductExport.price_list_vip.length
      ? newProductExport.price_list_vip
          .map((p) => {
            return `${p.price}d/${p.quantity} sản phẩm`;
          })
          .toString()
      : '';
    newProductExport.public_price = newProductExport.public_price
      ? `${newProductExport.public_price.price}d/1 sản phẩm`
      : '';
    newProductExport.connected_price = newProductExport.connected_price.price
      ? `${newProductExport.connected_price.price}d/1 sản phẩm`
      : '';
    productExportData.push(newProductExport);
  });
  return productExportData;
};
export default function ExportExcel(props) {
  // const classes = useStyles();
  const { data } = props;
  const [multiDataSet, setMultiDataSet] = useState([]);

  useEffect(() => {
    if (props.data.length) {
      const exportData = filterExportData(data);
      const columns = Object.keys(exportData[0]);
      const dataInDataSet = exportData.map((dataSet) => {
        dataSet = Object.values(dataSet).map((d) => {
          return {
            value: d,
            style: {
              alignment: {
                wrapText: true,
                horizontal: 'top',
                vertical: 'top',
                readingOrder: 1,
              },
            },
          };
        });
        return dataSet;
      });
      const newMultiDataSet = [
        {
          columns: columns.map((c) => {
            return { title: c };
          }),
          data: dataInDataSet,
        },
      ];
      setMultiDataSet(newMultiDataSet);
    }
  }, [props.data]);

  return (
    <ExcelFile element={props.downloadButton}>
      <ExcelSheet dataSet={multiDataSet} name='Organization' />
    </ExcelFile>
  );
}

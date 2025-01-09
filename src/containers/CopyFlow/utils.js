import { cloneDeep, find, remove } from 'lodash';

const createCombineSameSiteArray = (levelArray, rootArrayData) => {
  let resultArray = cloneDeep(levelArray);
  if (levelArray[0].length > 0) {
    resultArray[0] = levelArray[0].map((item) => {
      const checkingDuplicateDatas = rootArrayData.filter((data) => data?.imported_site_list.length > 1 && data?.id === item.id)
      let combineData = {
        copied_products: item?.copied_products || [],
        copied_products_raw: item?.copied_products_raw || [],
        product_images: item?.product_images || [],
        totalCopiedProducts: item?.totalCopiedProducts || 0,
      };

      if (checkingDuplicateDatas.length > 0) {
        checkingDuplicateDatas.forEach((dupItem) => {
          combineData = {
            copied_products: combineData?.copied_products.concat(
              dupItem?.copied_products || []
            ),
            copied_products_raw: combineData?.copied_products_raw.concat(
              dupItem?.copied_products_raw || []
            ),
            product_images: combineData?.product_images.concat(
              dupItem?.product_images || []
            ),
            totalCopiedProducts:
              combineData?.totalCopiedProducts + dupItem?.totalCopiedProducts,
          };
        });
      }
      return {
        ...item,
        ...combineData,
      };
    });
  }

  return resultArray;
};

const createLevelArray = (arrayData) => {
  const newArray = cloneDeep(arrayData);
  const resultArray = [];
  let idx = 1;
  while (newArray.length > 0 && idx < 11) {
    resultArray.push(
      arrayData.filter((item) => item?.imported_site_list?.length === idx)
    );
    remove(newArray, (item) => item?.imported_site_list?.length === idx);
    idx++;
  }
  return createCombineSameSiteArray(resultArray, arrayData);
};

export const createDiagramData = (arrayData) => {
  const levelArray = createLevelArray(arrayData);
  const resultArray = [];
  for (let index = levelArray.length - 1; index >= 0; index--) {
    const itemLevel = levelArray[index];
    itemLevel.forEach((item) => {
      if (index !== 0) {
        const parentId = item?.imported_site_list[index]._id;
        const parentList = levelArray[index - 1];
        levelArray[index - 1] = parentList.map((upLevelItem, upIdx) => {
          if (upLevelItem.id === parentId) {
            const currentChildren = upLevelItem?.children || [];
            return {
              ...upLevelItem,
              children: [...currentChildren, item],
            };
          }

          return upLevelItem;
        });
      } else {
        resultArray.push(item);
      }
    });
  }

  return resultArray;
};

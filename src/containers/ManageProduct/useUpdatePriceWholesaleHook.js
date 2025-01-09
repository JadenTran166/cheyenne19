import _ from 'lodash';
import { useEffect, useState } from 'react';

export default function useUpdatePriceWholesaleHook(priceList) {
  const saveData = priceList
    ? priceList.map((item, index) => ({
        quantity: item.quantity, // from
        price: item.price,
        to: priceList[index + 1]?.quantity
          ? +priceList[index + 1]?.quantity - 1
          : '',
      }))
    : [];
  const [newPriceList, setNewPriceList] = useState(saveData);

  const [errorList, setErrorList] = useState([]);

  const handleChangeInput = (value, key, index) => {
    if (isNaN(Number(value))) {
      return;
    }

    setNewPriceList((newPL) => {
      const newData = [...newPL];
      newData[index] = {
        ...newData[index],
        [key]: value ? +value : value,
      };

      if (key === 'to') {
        newData[index + 1] = {
          ...newData[index + 1],
          quantity: Number(value) + 1,
        };
      }

      return newData;
    });
  };

  const debounceValidate = _.debounce(validateAll, 300);

  const handleAddNew = () => {
    setNewPriceList((newPL) => {
      const lengthList = newPL.length;

      return [
        ...newPL,
        {
          quantity: newPL[lengthList - 1]?.to
            ? +newPL[lengthList - 1]?.to + 1
            : '',
          price: '',
          promo: '',
          to: '',
        },
      ];
    });
  };

  const handleRemove = (index) => {
    setNewPriceList((oldData) => {
      let newData = oldData.filter((item, i) => i !== index);

      if (newData[index] && index !== 0) {
        newData[index].quantity = newData[index - 1].to + 1;
      }

      if (newData.length === 0) {
        newData = [
          {
            quantity: '',
            price: '',
            promo: '',
            to: '',
          },
        ];
      }

      return newData;
    });
  };

  function validateAll() {
    setErrorList((oldErrorList) => {
      let curentErrorList = [...oldErrorList];

      newPriceList.every((item, index) => {
        let { quantity, to, price } = item;
        let isError = false;
        if (
          newPriceList.length !== 1 &&
          index !== newPriceList.length - 1 &&
          +quantity >= +to
        ) {
          curentErrorList = [...new Set([...curentErrorList, index])];
          return false;
        }

        if (index === newPriceList.length - 1 && !newPriceList[index].price) {
          curentErrorList = [...new Set([...curentErrorList, index])];
          return false;
        }

        if (
          index !== 0 &&
          newPriceList[index - 1] &&
          price >= newPriceList[index - 1].price
        ) {
          isError = true;
        }

        if (isError) {
          curentErrorList = [...new Set([...curentErrorList, index])];
        } else {
          const indexError = curentErrorList.indexOf(index);
          if (indexError >= 0) {
            curentErrorList.splice(indexError, 1);
          }
        }
        return true;
      });
      const currentNewPriceListLength = newPriceList.length;

      return curentErrorList.filter(
        (item) => item <= currentNewPriceListLength - 1
      );
    });
  }

  useEffect(() => {
    debounceValidate();
  }, [newPriceList]);

  return {
    newPriceList,
    handleChangeInput,
    handleAddNew,
    handleRemove,
    validateAll,
    errorList,
  };
}

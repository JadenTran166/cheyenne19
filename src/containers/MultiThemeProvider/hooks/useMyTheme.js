import { createTheme, responsiveFontSizes } from '@material-ui/core';
import useUserData from 'hooks/useUserData';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosService from '../../../config/axiosService';
import { convertArrayToObject } from '../../../utils';

const defaultTheme = {
  warning: '#E35847',
  success: '#2DCF58',
  info: '#5bc0de',
  error: '#dc3545',
};
const listThemeLocal = {
  theme1: {
    primary: '#1C523C',
    secondary: '#EAE7A1',
    ...defaultTheme,
  },
  theme2: {
    primary: '#653593',
    secondary: '#EEBA00',
    ...defaultTheme,
  },
  theme3: {
    primary: '#173551',
    secondary: '#FFC951',
    ...defaultTheme,
  },
  theme4: {
    primary: '#DE3535',
    secondary: '#222222',
    ...defaultTheme,
  },
  theme5: {
    primary: '#1D6D9E',
    secondary: '#F4BA7A',
    ...defaultTheme,
  },
};
export default function useMyTheme() {
  const { userData } = useUserData();
  const { themeKeySetting } = useSelector((state) => state.theme);

  const [key, setKey] = useState(userData?.site?.color || '');
  const [listTheme, setListTheme] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (listTheme && key && listTheme[key]) {
      return getTheme(listTheme[key]);
    }
    return getTheme(listThemeLocal['theme1']);
  });

  useEffect(() => {
    async function getData() {
      try {
        const data = await axiosService
          .get('/business-color')
          .then((res) => res.data);
        const dataWithDefaultTheme = data.map((item) => ({
          ...item,
          ...defaultTheme,
        }));
        const themeObj = convertArrayToObject(dataWithDefaultTheme, '_id');
        window.localStorage.setItem(
          'list_theme_data',
          JSON.stringify(themeObj)
        );

        setListTheme(themeObj);
      } catch (error) {
        console.error("Can't load data theme");
      }
    }

    const themeObj = window.localStorage.getItem('list_theme_data');

    if (themeObj) {
      setListTheme(JSON.parse(themeObj));
    } else {
      getData();
    }
  }, []);

  useEffect(() => {
    let color = themeKeySetting || userData?.site?.color || '';

    if (listTheme && color && listTheme[color]) {
      setTheme(getTheme(listTheme[color]));
    } else {
      setTheme(getTheme(listThemeLocal['theme1']));
    }
  }, [themeKeySetting, userData, listTheme]);

  function getTheme(props) {
    const { primary, secondary, warning, success, info, error } = props;
    const theme = {
      palette: {
        primary: {
          main: primary,
        },
        secondary: {
          main: secondary,
        },
        warning: {
          main: warning,
        },
        success: {
          main: success,
        },
        info: {
          main: info,
        },
        error: {
          main: error,
        },
        background: {
          dark: '#2C2C2E',
          contrastText: '#ffffff',
          default: '#F7F7F7',
        },
      },
      shape: {
        borderRadius: 5,
        borderRadius2: 10,
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1108,
          xl: 1920,
        },
      },
      mixins: {
        toolbar: {
          minHeight: 40,
        },
      },
      overrides: {
        MuiButton: {
          label: {
            textTransform: 'none',
          },
        },
      },
      typography: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
      },
    };

    return responsiveFontSizes(createTheme(theme));
  }

  return {
    theme,
    listTheme,
  };
}

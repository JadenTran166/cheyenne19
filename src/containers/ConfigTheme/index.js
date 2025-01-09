import { Box, Container } from '@material-ui/core';
import useUserData from 'hooks/useUserData';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateColor } from 'slice/userSlice';
import { cancleConfigTheme, updateSettingTheme } from 'slice/themeSlice';
import ConfigThemeStep1 from '../../components/ConfigTheme/ConfigThemeStep1';
import ConfigThemeStep2 from '../../components/ConfigTheme/ConfigThemeStep2';
import ConfigThemeStep3 from '../../components/ConfigTheme/ConfigThemeStep3';
import { listRouteByKey } from '../../config/configureRoute';
import useStep from '../../hooks/useStep';

export default function ConfigTheme() {
  const { themeKeySetting, themeKey } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const { curentStep, nextStep } = useStep(3);

  const { userData } = useUserData();
  const [loadingImg, setLoadingImg] = useState(false);
  const [imgData, setImgData] = useState({});
  const history = useHistory();

  const handleThemeClick = (themeName) => {
    dispatch(updateSettingTheme(themeName));
  };
  const handleEndStep = () => {
    const data = {
      color: themeKeySetting,
      avatar: imgData?.enc,
    };

    dispatch(updateColor(data)).then(() => {
      history.push(listRouteByKey['manage_site'].path);
    });

    // axiosService
    //   .patch('/business/admin', data)
    //   .then((res) => {
    //     updateColor(userDispatch, res.data);
    //     history.push(listRouteByKey['manage_site'].path);
    //   })
    //   .catch((err) => {
    //     Alert.fire({
    //       icon: 'error',
    //       title: 'Some thing wrong!',
    //       showConfirmButton: false,
    //     });
    //   });

    // history.push(listRouteByKey['manage_site'].path);
  };
  const handleCancle = async () => {
    // userDispatch({
    //   type: 'CANCEL_CONFIG',
    // });
    await dispatch(cancleConfigTheme());
    history.push(listRouteByKey['manage_site'].path);
  };

  const onUpdateAvatar = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.fileName = file.name;
    reader.onloadstart = () => {
      setLoadingImg(true);
    };
    reader.onloadend = (readerEvt) => {
      var base64result = reader.result.split(',')[1];
      setLoadingImg(false);
      setImgData({
        imageUrl: reader.result,
        enc: base64result,
        fileName: readerEvt.target.fileName,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      margin='0 auto'
      minHeight='500px'
      py={{ xs: 2, md: 4 }}>
      {curentStep === 1 && <ConfigThemeStep1 nextStep={nextStep} />}
      {curentStep === 2 && (
        <ConfigThemeStep2
          themeActive={themeKeySetting || themeKey}
          handleThemeClick={handleThemeClick}
          nextStep={nextStep}
          handleCancle={handleCancle}
          onUpdateAvatar={onUpdateAvatar}
          imgData={imgData}
          isDisableNext={
            !userData?.site?.color && !themeKeySetting
          }></ConfigThemeStep2>
      )}
      {curentStep === 3 && (
        <ConfigThemeStep3
          handleEndStep={handleEndStep}
          handleCancle={handleCancle}></ConfigThemeStep3>
      )}
    </Box>
  );
}

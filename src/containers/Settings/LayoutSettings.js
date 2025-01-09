import axiosService from 'config/axiosService';
import { ENV_ASSETS_ENDPOINT } from 'env/local';
import useUserData from 'hooks/useUserData';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { cancleConfigTheme, updateSettingTheme } from 'slice/themeSlice';
import { updateUserSiteBannerData, updateUserSiteData } from 'slice/userSlice';
import { Alert } from 'utils';
import CommonLayout from '../../components/CommonLayout';
import { listRouteByKey } from '../../config/configureRoute';
import EditAvatarAndColor from './EditLayout';
import SliderEditor from './SliderEditor';
import { setLoading } from 'slice/global';

const LayoutSettings = () => {
  const dispatch = useDispatch();
  const { userData } = useUserData();
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [loadingImg, setLoadingImg] = useState(false);
  const [imgData, setImgData] = useState({});
  const [bannerData, setBannerData] = useState([]);

  const { themeKeySetting } = useSelector((state) => state.theme);
  const history = useHistory();

  const sliderEditorRef = useRef(null);

  const handleThemeClick = (themeName) => {
    if (themeName === themeKeySetting) return;
    if (!themeKeySetting && themeName === userData?.site?.color) return;

    dispatch(updateSettingTheme(themeName));
  };
  // const handleEndStep = () => {
  //   const data = {
  //     color: themeKeySetting || undefined,
  //     avatar: imgData?.enc,
  //   };

  //   if (!data.color & !data.avatar) return;

  //   dispatch(updateColor(data));
  // };
  const handleCancle = async () => {
    await dispatch(cancleConfigTheme());
    history.push(listRouteByKey['manage_site'].path);
  };

  const onUpdateBanner = (e, index) => {
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
      setBannerData((prevState) => {
        const newState = [...prevState];
        newState[index] = {
          imageUrl: reader.result,
          enc: base64result,
          fileName: readerEvt.target.fileName,
        };
        return newState;
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
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

  async function updateData() {
    const { banners } = userData.site;

    const formBannerData = sliderEditorRef.current.getFormValue();

    const newData = [];
    for (let i = 0; i < 3; i++) {
      const item = formBannerData[i];
      let newDataBanner = {};
      let { description, href, isNewTab } = item;

      let bannerIndex = banners
        ? banners.findIndex((b) => b.priority === i)
        : -1;
      let { url, new_tab, alt } = bannerIndex < 0 ? {} : banners[bannerIndex];
      if (alt !== description && (description || alt))
        newDataBanner.alt = description;

      if (url !== href && (href || url)) newDataBanner.url = href;
      if (!!new_tab !== !!isNewTab) newDataBanner.new_tab = !!isNewTab;
      if (bannerData[i] && bannerData[i].imageUrl) {
        newDataBanner.img = bannerData[i].imageUrl;
      }
      if (Object.keys(newDataBanner).length > 0) {
        newData.push({
          ...newDataBanner,
          priority: i,
        });
      }
    }

    let listRequest = [];

    if (newData.length > 0) {
      //update new
      listRequest.push(
        axiosService
          .post('/site/banner', {
            banners: newData,
          })
          .then((res) => res.data)
      );
    }

    const data = {
      color: themeKeySetting || undefined,
      avatar: imgData?.enc,
    };

    if (data.color || data.avatar) {
      listRequest.push(
        axiosService.patch('/business/admin', data).then((res) => res.data)
      );
    }

    if (!listRequest.length) return;

    dispatch(setLoading(true));

    try {
      const resData = await Promise.all(listRequest);

      if (newData.length > 0 && (data.color || data.avatar)) {
        dispatch(updateUserSiteBannerData(resData[0].site?.banners));

        dispatch(updateUserSiteData(resData[1]));
      } else {
        if (newData.length > 0) {
          dispatch(updateUserSiteBannerData(resData[0].site?.banners));
        }

        if (data.color || data.avatar) {
          dispatch(updateUserSiteData(resData[0]));
        }
      }

      let item = [];
      if (data.color) item.push('màu');
      if (data.avatar) item.push('ảnh đại diện');
      if (newData.length) item.push('banner');

      let title = `Cập nhật ${
        item.length > 0 ? item.join(', ') : ''
      } thành công!`;

      await Alert.fire({
        icon: 'success',
        title: title,
        showConfirmButton: false,
      });
      setBannerData([]);
    } catch (error) {
      console.error({ error });
      await Alert.fire({
        icon: 'error',
        title: 'Cập nhật thất bại. Vui lòng thử lại.',
        showConfirmButton: false,
      });
    } finally {
      dispatch(setLoading(false));
    }

    // return axiosService
    // .patch('/business/admin', data)
    // .then((res) => {
    //   let item = [];
    //   if (data.color) item.push('màu');
    //   if (data.avatar) item.push('ảnh đại diện');

    //   let title = `Cập nhật ${
    //     item.length > 0 ? item.join(', ') : ''
    //   } thành công!`;

    //   Alert.fire({
    //     icon: 'success',
    //     title: title,
    //     showConfirmButton: false,
    //   });
    //   return res.data;
    // })
    // .catch((err) => {
    //   Alert.fire({
    //     icon: 'error',
    //     title: 'Some thing wrong!',
    //     showConfirmButton: false,
    //   });
    // });
  }

  useEffect(() => {
    if (userData?.site?.avatar) {
      setImgData({
        imageUrl: ENV_ASSETS_ENDPOINT + userData?.site?.avatar,
      });
    }
  }, [userData]);

  return (
    <CommonLayout
      isLoading={loadingUpdate}
      leftComponent={() => {
        return (
          <EditAvatarAndColor
            themeActive={themeKeySetting || userData?.site?.color || ''}
            handleThemeClick={handleThemeClick}
            // nextStep={handleEndStep}
            nextStep={updateData}
            handleCancle={handleCancle}
            onUpdateAvatar={onUpdateAvatar}
            imgData={imgData}
            // isDisableNext={
            //   !themeKeySetting && !imgData?.enc
            // }
          />
        );
      }}
      rightComponent={() => {
        return (
          <SliderEditor
            ref={sliderEditorRef}
            onUpdateBanner={onUpdateBanner}
            bannerData={bannerData}
            siteData={userData.site}
          />
        );
      }}
    />
  );
};
export default LayoutSettings;

import { Box, Grid } from '@material-ui/core';
import BoxDragDropImage from 'components/BoxDragDropImage';
import InputWrapper from 'components/InputWrapper';
import { ENV_ASSETS_ENDPOINT } from 'env/local';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { useForm } from 'react-hook-form';

function TabPanelDetail(props, ref) {
  const { index, bannerData, newBannerImgData } = props;

  const inputImg = useRef(null);

  const newDataRef = useRef(
    (() => {
      const { alt, new_tab, url } = bannerData || {};
      const newData = [
        {
          key: 'description',
          label: 'Chú thích',
          type: 'text',
          defaultValue: alt || '',
          col: [12, 12],
        },
        {
          key: 'href',
          label: 'Liên kết',
          type: 'text',
          defaultValue: url || '',
          col: [12, 8],
        },
        {
          key: 'isNewTab',
          label: 'Mở trang mới',
          type: 'checkbox',
          defaultValue: !!new_tab,
          labelPlacement: 'end',
          col: [12, 4],
        },
      ];
      return newData;
    })()
  );

  const { errors, control, getValues, setValue } = useForm(() => {
    return {
      defaultValues: {
        ...newDataRef.current.reduce(
          (currentObj, { key, defaultValue }) => ({
            ...currentObj,
            [key]: defaultValue || '',
          }),
          {}
        ),
      },
    };
  });

  function handleBoxImgClick() {
    inputImg.current.click();
  }

  useImperativeHandle(ref, () => ({
    getFormValue: getValues,
  }));
  useEffect(() => {
    const { alt, new_tab, url } = bannerData || {};

    setValue('description', alt || '');
    setValue('href', url || '');
    setValue('isNewTab', !!new_tab);
  }, [props.bannerData]);
  return (
    <Box>
      <Box mb={3} display='flex' justifyContent='center'>
        <BoxDragDropImage
          width='100%'
          height='300px'
          isReplaceError
          imgData={
            newBannerImgData ||
            (bannerData?.src && {
              imageUrl: ENV_ASSETS_ENDPOINT + bannerData.src,
            }) ||
            {}
          }
          onClick={handleBoxImgClick}
        />
      </Box>
      <Box>
        <Grid container spacing={2} alignItems='center'>
          {newDataRef.current.map((input, index) => (
            <Grid
              item
              xs={input.col[0]}
              md={input.col[1]}
              key={`banner_${index}`}>
              <InputWrapper
                helperText={
                  errors[input.key]
                    ? `${errors[input.key].message || 'This field is required'}`
                    : ''
                }
                error={!!errors[input.key] || undefined}
                variant='outlined'
                margin='dense'
                label={input.label}
                type={input.type || 'text'}
                fullWidth
                name={input.key}
                control={control}
                rules={input.rules ? { ...input.rules } : undefined}
                disabled={!!input.disabled}
                defaultValue={input.defaultValue || ''}
                labelPlacement={input.labelPlacement}
                isVertical
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <input
        ref={inputImg}
        type='file'
        style={{ display: 'none' }}
        onChange={(e) => {
          props.onUpdateBanner(e, index);
        }}
        accept='image/*'
      />
    </Box>
  );
}

export default forwardRef(TabPanelDetail);

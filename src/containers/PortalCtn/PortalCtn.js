import { Box, Container } from '@material-ui/core';
import useUserData from 'hooks/useUserData';
import React from 'react';
import { useHistory } from 'react-router-dom';
import FeatureItem from '../../components/Portal/FeatureItem';
import FeatureListLayout from '../../components/Portal/FeatureListLayout';
import PortalInfo from '../../components/Portal/PortalInfo';
import useGetFeature from './hooks/useGetFeature';

export default function PortalCtn() {
  const features = useGetFeature();
  const { userData } = useUserData();
  const history = useHistory();
  // const currentRole = useRole();
  const listFeature =
    features &&
    features.map((item) => (
      <FeatureItem
        key={item.key}
        onClick={() => {
          if (typeof item.onClick === 'function') {
            item.onClick();
          } else {
            history.push(item.link);
          }
        }}
        src=''
        data={item}
        isSpecial={item.isSpecial}
        isLock={item.isLock}>
        {item.name}
      </FeatureItem>
    ));

  return (
    <Box pb={4}>
      <Box boxShadow={4} bgcolor='background.dark'>
        <PortalInfo userData={userData} />
      </Box>

      <Box
        minHeight={400}
        display='flex'
        justifyContent='center'
        alignItems='center'
        py={{ xs: 2, md: 8, lg: 12 }}>
        <Container>
          <FeatureListLayout>{listFeature}</FeatureListLayout>
        </Container>
      </Box>
    </Box>
  );
}

// test_admin_001@yopmail.com

import React from 'react';
import { Icon } from '@material-ui/core';
import styled from 'styled-components';

function IconStar() {
  return <Icon color='secondary'>star</Icon>;
}
const StyledIconStar = styled(IconStar)`
  right: 50%;
  top: 50%;
  position: absolute;
  color: 'red';
  padding: 100px;
`;
export default StyledIconStar;

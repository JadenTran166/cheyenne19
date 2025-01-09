import { useHistory } from 'react-router';

import { listRouteByKey } from 'config/configureRoute';

export default function useCustomHistory() {
  const history = useHistory();

  function goTo(keyPath, dynamicParam) {
    try {
      if (!keyPath) {
        throw new Error('Required param keyPath.');
      }

      if (keyPath === '404') {
        history.push('404');
      }

      if (!listRouteByKey[keyPath]) {
        throw new Error('Route not defined.');
      }

      if (dynamicParam && !listRouteByKey[keyPath].pathDynamic) {
        throw new Error(`Param dynamicParam required pathDynamic key.`);
      }

      let pathname = dynamicParam
        ? listRouteByKey[keyPath].pathDynamic
        : typeof listRouteByKey[keyPath].path === 'string'
        ? listRouteByKey[keyPath].path
        : listRouteByKey[keyPath].path?.[0];

      if (dynamicParam && typeof dynamicParam === 'object') {
        Object.entries(dynamicParam).forEach(([key, value]) => {
          pathname = pathname.replaceAll(`[${key}]`, value);
        });
      }

      if (dynamicParam && typeof dynamicParam === 'string') {
        pathname += dynamicParam;
      }
      history.push(pathname);
    } catch (error) {
      console.error(error);
    }
  }

  return { goTo };
}

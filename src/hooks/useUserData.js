import { useSelector } from 'react-redux';

export default function useUserData() {
  const userStore = useSelector((state) => state.user);
  return userStore;
}

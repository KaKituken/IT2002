import { createContext } from 'react';

interface UserType {
  userType: string;
  setUserType: (userType: string) => void;
}

export const UserContext = createContext<UserType>({
  userType: 'Guest',
  setUserType: () => {},
});

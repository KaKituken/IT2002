import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface UserInfoState{
  userType: string,
  userToken: string
}

const initialState: UserInfoState = {
  userType: 'Guest',
  userToken: ''
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload;
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload;
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const { setUserType, setUserToken } = userInfoSlice.actions;

// selectors 等其他代码可以使用导入的 `RootState` 类型
export const selectUserType = (state: RootState) => state.userInfoTracker.userType
export const selectUserToken = (state: RootState) => state.userInfoTracker.userToken

export default userInfoSlice.reducer;
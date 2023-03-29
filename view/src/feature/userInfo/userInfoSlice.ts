import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface UserTypeState{
  value: string
}

const initialState: UserTypeState = {
  value: ''
}

export const userInfoSlice = createSlice({
  name: 'usertype',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const { setValue } = userInfoSlice.actions;

// selectors 等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.userInfoTracker.value

export default userInfoSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { AppDispatch } from 'src/store/Store';

interface StateType {
  statcount: any;
  statstock: any;
  statfacture: any;
  selectedVente: any;
}
const initialState: StateType = {
  statcount: {},
  statstock: {},
  statfacture: {},
  selectedVente: null,
};

export const statSlice = createSlice({
  name: 'stat',
  initialState,
  reducers: {
    setStatcount: (state: StateType, action) => {
      state.statcount = action.payload;
    },
    setStatstock: (state: StateType, action) => {
      state.statstock = action.payload;
    },
    setStatfacture: (state: StateType, action) => {
      state.statfacture = action.payload;
    },
  },
});
export const { setStatcount, setStatstock, setStatfacture } = statSlice.actions;

export const fetchstatcount = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/stat/count/');
    dispatch(setStatcount(response));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const fetchstatstock = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/stat/stock/');
    dispatch(setStatstock(response));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const fetchstatfacture = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/stat/facture/');
    dispatch(setStatfacture(response));
  } catch (err: any) {
    throw new Error(err);
  }
};
export default statSlice.reducer;

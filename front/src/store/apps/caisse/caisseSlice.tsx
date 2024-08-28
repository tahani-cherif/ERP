import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { AppDispatch } from 'src/store/Store';

interface StateType {
  caisses: any[];
  selectedCaisse: any;
}
const initialState: StateType = {
  caisses: [],
  selectedCaisse: null,
};

export const creditSlice = createSlice({
  name: 'Caisse',
  initialState,
  reducers: {
    setCaisses: (state: StateType, action) => {
      state.caisses = action.payload;
    },
    setCaissesAdd: (state: StateType, action) => {
      state.caisses = [action.payload, ...state.caisses];
    },

    setCaisse: (state: StateType, action) => {
      state.selectedCaisse = action.payload;
    },
  },
});
export const { setCaisses, setCaisse, setCaissesAdd } = creditSlice.actions;

export const fetchCaisses = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/caisses/');
    dispatch(setCaisses(response.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const addCaisse =
  (body: { designation: string; encaissement: number; decaissement: number; date: Date }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post('/caisses/', body);
      dispatch(setCaissesAdd(response.data));

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };

export const fetchCaisseById = (clientId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/caisses/${clientId}`);
    dispatch(setCaisse(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const deleteCaisse = (clientId: string) => async () => {
  try {
    await axios.delete(`/caisses/${clientId}`);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateCaisse =
  (
    body: {
      designation: string;
      encaissement: number;
      decaissement: number;
      date: Date;
    },
    id: string,
  ) =>
  async () => {
    try {
      const response = await axios.put('/caisses/' + id, body);

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };
export default creditSlice.reducer;

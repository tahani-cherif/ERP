import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { AppDispatch } from 'src/store/Store';

interface StateType {
  banques: any[];
  selectedBanque: any;
}
const initialState: StateType = {
  banques: [],
  selectedBanque: null,
};

export const banqueSlice = createSlice({
  name: 'Banque',
  initialState,
  reducers: {
    setBanques: (state: StateType, action) => {
      state.banques = action.payload;
    },
    setBanquesAdd: (state: StateType, action) => {
      state.banques = [action.payload, ...state.banques];
    },

    setBanque: (state: StateType, action) => {
      state.selectedBanque = action.payload;
    },
  },
});
export const { setBanques, setBanque, setBanquesAdd } = banqueSlice.actions;

export const fetchBanques = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/banques/');
    dispatch(setBanques(response.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const addBanque =
  (body: { banque: string; rib: string; iban: string; swift: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post('/banques/', body);
      dispatch(setBanquesAdd(response.data));

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };

export const fetchBanqueById = (clientId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/banques/${clientId}`);
    dispatch(setBanque(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const deleteBanque = (clientId: string) => async () => {
  try {
    await axios.delete(`/banques/${clientId}`);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateBanque =
  (body: { banque: string; rib: string; iban: string; swift: string }, id: string) => async () => {
    try {
      const response = await axios.put('/banques/' + id, body);

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };
export default banqueSlice.reducer;

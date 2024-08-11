import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { AppDispatch } from 'src/store/Store';

interface StateType {
  achats: any[];
  selectedAchat: any;
}
const initialState: StateType = {
  achats: [],
  selectedAchat: null,
};

export const AchatSlice = createSlice({
  name: 'achat',
  initialState,
  reducers: {
    setAchats: (state: StateType, action) => {
      state.achats = action.payload;
    },
    setAchatsAdd: (state: StateType, action) => {
      state.achats = [action.payload, ...state.achats];
    },

    setAchat: (state: StateType, action) => {
      state.selectedAchat = action.payload;
    },
  },
});
export const { setAchats, setAchat, setAchatsAdd } = AchatSlice.actions;

export const fetchAchats = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/facture/achat/');
    dispatch(setAchats(response.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const addAchat =
  (body: {
    fournisseur: string;
    modepaiement: string;
    date: Date;
    total_general: number;
    tva: number;
    totalHTV: number;
    articles: any[];
    admin: string;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post('/facture/', body);
      dispatch(setAchatsAdd(response.data));

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };

export const fetchAchatById = (clientId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/facture/${clientId}`);
    dispatch(setAchat(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const deleteAchat = (clientId: string) => async () => {
  try {
    await axios.delete(`/facture/${clientId}`);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateAchat =
  (
    body: {
      fullName: string;
      address: string;
      email: string;
      matriculeFiscale: string;
      phone: string;
    },
    id: string,
  ) =>
  async () => {
    try {
      const response = await axios.put('/facture/' + id, body);

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };
export default AchatSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { AppDispatch } from 'src/store/Store';

interface StateType {
  ventes: any[];
  selectedVente: any;
}
const initialState: StateType = {
  ventes: [],
  selectedVente: null,
};

export const VenteSlice = createSlice({
  name: 'vente',
  initialState,
  reducers: {
    setVentes: (state: StateType, action) => {
      state.ventes = action.payload;
    },
    setVentesAdd: (state: StateType, action) => {
      state.ventes = [action.payload, ...state.ventes];
    },

    setVente: (state: StateType, action) => {
      state.selectedVente = action.payload;
    },
  },
});
export const { setVentes, setVente, setVentesAdd } = VenteSlice.actions;

export const fetchVentes = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/facture/vente/');
    dispatch(setVentes(response.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const addVente =
  (body: {
    client: string;
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
      dispatch(setVentesAdd(response.data));

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };

export const fetchVenteById = (clientId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/facture/${clientId}`);
    dispatch(setVente(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const deleteVente = (clientId: string) => async () => {
  try {
    await axios.delete(`/facture/${clientId}`);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateVente =
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
export const updateStatus = (body: { status: string }, id: string) => async () => {
  try {
    const response = await axios.put('/facture/status/' + id, { ...body, type: 'vente' });

    return response.data;
  } catch (err: any) {
    throw new Error(err);
  }
};
export default VenteSlice.reducer;

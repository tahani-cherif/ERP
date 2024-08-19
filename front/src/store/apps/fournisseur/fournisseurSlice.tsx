import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { AppDispatch } from 'src/store/Store';

interface StateType {
  fournisseurs: any[];
  selectedFournisseur: any;
}
const initialState: StateType = {
  fournisseurs: [],
  selectedFournisseur: null,
};

export const fournisseurSlice = createSlice({
  name: 'Fournisseur',
  initialState,
  reducers: {
    setFournisseurs: (state: StateType, action) => {
      state.fournisseurs = action.payload;
    },
    setFournisseursAdd: (state: StateType, action) => {
      state.fournisseurs = [action.payload, ...state.fournisseurs];
    },

    setFournisseur: (state: StateType, action) => {
      state.selectedFournisseur = action.payload;
    },
  },
});
export const { setFournisseurs, setFournisseur, setFournisseursAdd } = fournisseurSlice.actions;

export const fetchFournisseurs = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/fournisseurs/');
    dispatch(setFournisseurs(response.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const addFournisseur =
  (body: {
    fullName: string;
    address: string;
    email: string;
    matriculeFiscale: string;
    phone: string;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post('/fournisseurs/', body);
      dispatch(setFournisseursAdd(response.data));

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };

export const fetchFournisseurById = (clientId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/fournisseurs/${clientId}`);
    dispatch(setFournisseur(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const deleteFournisseur = (clientId: string) => async () => {
  try {
    await axios.delete(`/fournisseurs/${clientId}`);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateFournisseur =
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
      const response = await axios.put('/fournisseurs/' + id, body);

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };
export default fournisseurSlice.reducer;

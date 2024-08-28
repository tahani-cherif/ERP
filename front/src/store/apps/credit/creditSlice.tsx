import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { AppDispatch } from 'src/store/Store';

interface StateType {
  credits: any[];
  selectedCredit: any;
}
const initialState: StateType = {
  credits: [],
  selectedCredit: null,
};

export const creditSlice = createSlice({
  name: 'Credit',
  initialState,
  reducers: {
    setCredits: (state: StateType, action) => {
      state.credits = action.payload;
    },
    setCreditsAdd: (state: StateType, action) => {
      state.credits = [action.payload, ...state.credits];
    },

    setCredit: (state: StateType, action) => {
      state.selectedCredit = action.payload;
    },
  },
});
export const { setCredits, setCredit, setCreditsAdd } = creditSlice.actions;

export const fetchCredits = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/credits/');
    dispatch(setCredits(response.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const addCredit =
  (body: {
    banque: string;
    type: string;
    echeance: string;
    principal: number;
    interet: number;
    total: number;
    montantemprunt: number;
    encours: number;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post('/credits/', body);
      dispatch(setCreditsAdd(response.data));

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };

export const fetchCreditById = (clientId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/credits/${clientId}`);
    dispatch(setCredit(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};
export const deleteCredit = (clientId: string) => async () => {
  try {
    await axios.delete(`/credits/${clientId}`);
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateCredit =
  (
    body: {
      banque: string;
      montantemprunt: string;
      type: string;
      echeance: string;
      principal: string;
      interet: string;
      total: string;
      encours: string;
      etat: string;
    },
    id: string,
  ) =>
  async () => {
    try {
      const response = await axios.put('/credits/' + id, body);

      return response.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };
export default creditSlice.reducer;

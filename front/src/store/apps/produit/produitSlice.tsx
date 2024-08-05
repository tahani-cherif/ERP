import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { AppDispatch } from 'src/store/Store';

interface StateType {
  produits: any[];
  selectedProduit: any;
}
const initialState: StateType = {
  produits: [],
  selectedProduit: null,
};

export const ProduitSlice = createSlice({
  name: 'Produit',
  initialState,
  reducers: {
    setProduits: (state: StateType, action) => {
      state.produits = action.payload;
    },
    setProduitsAdd: (state: StateType, action) => {
      state.produits =[action.payload,...state.produits ];
    },

    setProduit: (state: StateType, action) => {
      state.selectedProduit = action.payload;
    },
  },
});
export const { setProduits, setProduit ,setProduitsAdd} = ProduitSlice.actions;

export const fetchProduits = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/produits/');
    dispatch(setProduits(response.data));
  } catch (err:any) {
    throw new Error(err);
  }
};
export const addProduit =(body:{
  name:string,
  description:string,
  price:number | null,
})=> async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post('/produits/',body);
    dispatch(setProduitsAdd(response.data));
    
    return response.data
  } catch (err:any) {
    throw new Error(err);
  }
};

export const fetchProduitById = (clientId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/produits/${clientId}`);
    dispatch(setProduit(response.data.data));
  } catch (err:any) {
    throw new Error(err);
  }
};
export const deleteProduit = (clientId: string) => async () => {
  try {
   await axios.delete(`/produits/${clientId}`);
  } catch (err:any) {
    throw new Error(err);
  }
};

export const updateProduit =(body: {
  name:string,
  description:string,
  price:number | null,},id:string)=> async () => {
  try {
    const response = await axios.put('/produits/'+id,body);

    return response.data
  } catch (err:any) {
    throw new Error(err);
  }
};
export default ProduitSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { AppDispatch } from 'src/store/Store';

interface StateType {
  clients: any[];
  selectedClient: any;
}
const initialState: StateType = {
  clients: [],
  selectedClient: null,
};

export const ClientSlice = createSlice({
  name: 'Client',
  initialState,
  reducers: {
    setClients: (state: StateType, action) => {
      state.clients = action.payload;
    },
    setClientsAdd: (state: StateType, action) => {
      state.clients =[action.payload,...state.clients ];
    },

    setClient: (state: StateType, action) => {
      state.selectedClient = action.payload;
    },
  },
});
export const { setClients, setClient ,setClientsAdd} = ClientSlice.actions;

export const fetchClients = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get('/clients/', { responseType: 'json' });
    console.log('Fetched clients:', response);
    dispatch(setClients(response.data));
  } catch (err) {
    // Cast err to an Error if it's not already
    const error = err instanceof Error ? err : new Error('An unknown error occurred');
    console.error('Error fetching clients:', error.message);
    throw error; // Re-throw the error after logging it
  }
};
export const addClient =(body: {  fullName: string,
  address: string,
  email: string,
  matriculeFiscale: string,
  phone: string,})=> async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post('/clients/',body);
    dispatch(setClientsAdd(response.data));
    
    return response.data
  } catch (err:any) {
    throw new Error(err);
  }
};

export const fetchClientById = (clientId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/clients/${clientId}`);
    dispatch(setClient(response.data.data));
  } catch (err:any) {
    throw new Error(err);
  }
};
export const deleteClient = (clientId: string) => async () => {
  try {
   await axios.delete(`/clients/${clientId}`);
  } catch (err:any) {
    throw new Error(err);
  }
};

export const updateClient =(body: {  fullName: string,
  address: string,
  email: string,
  matriculeFiscale: string,
  phone: string,},id:string)=> async () => {
  try {
    const response = await axios.put('/clients/'+id,body);

    return response.data
  } catch (err:any) {
    throw new Error(err);
  }
};
export default ClientSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import CustomizerReducer from './customizer/CustomizerSlice';
import EcommerceReducer from './apps/eCommerce/ECommerceSlice';
import ChatsReducer from './apps/chat/ChatSlice';
import NotesReducer from './apps/notes/NotesSlice';
import EmailReducer from './apps/email/EmailSlice';
import TicketReducer from './apps/tickets/TicketSlice';
import ContactsReducer from './apps/contacts/ContactSlice';
import UserProfileReducer from './apps/userProfile/UserProfileSlice';
import BlogReducer from './apps/blog/BlogSlice';
import ClientReducer from './apps/client/clientSlice';
import FournisseurReducer from './apps/fournisseur/fournisseurSlice';
import ProduitReducer from './apps/produit/produitSlice';
import VenteReducer from './apps/vente/venteSlice';
import AchatReducer from './apps/achat/achatSlice';
import BanqueReducer from './apps/banque/banqueSlice';
import CreditReducer from './apps/credit/creditSlice';
import CaisseReducer from './apps/caisse/caisseSlice';
import { combineReducers } from 'redux';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
  TypedUseSelectorHook,
} from 'react-redux';

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    ecommerceReducer: EcommerceReducer,
    chatReducer: ChatsReducer,
    emailReducer: EmailReducer,
    notesReducer: NotesReducer,
    contactsReducer: ContactsReducer,
    ticketReducer: TicketReducer,
    userpostsReducer: UserProfileReducer,
    blogReducer: BlogReducer,
    clientReducer: ClientReducer,
    fournisseurReducer: FournisseurReducer,
    produitReducer: ProduitReducer,
    venteReducer: VenteReducer,
    achatReducer: AchatReducer,
    banqueReducer: BanqueReducer,
    creditReducer: CreditReducer,
    caisseReducer: CaisseReducer,
  },
});

const rootReducer = combineReducers({
  customizer: CustomizerReducer,
  ecommerceReducer: EcommerceReducer,
  chatReducer: ChatsReducer,
  emailReducer: EmailReducer,
  notesReducer: NotesReducer,
  contactsReducer: ContactsReducer,
  ticketReducer: TicketReducer,
  userpostsReducer: UserProfileReducer,
  blogReducer: BlogReducer,
  clientReducer: ClientReducer,
  fournisseurReducer: FournisseurReducer,
  produitReducer: ProduitReducer,
  venteReducer: VenteReducer,
  achatReducer: AchatReducer,
  banqueReducer: BanqueReducer,
  creditReducer: CreditReducer,
  caisseReducer: CaisseReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const { dispatch } = store;
export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<AppState> = useAppSelector;

export default store;

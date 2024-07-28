import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from './ProtectedRoute';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const EcommerceDash = Loadable(lazy(() => import('../views/dashboard/Ecommerce')));
const Client = Loadable(lazy(() => import('../views/dashboard/client')));
const Fournisseur = Loadable(lazy(() => import('../views/dashboard/fournisseur')));

/* ****Apps***** */
const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog')));
const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogPost')));
const Contacts = Loadable(lazy(() => import('../views/apps/contacts/Contacts')));
const Chats = Loadable(lazy(() => import('../views/apps/chat/Chat')));
const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
const Ecommerce = Loadable(lazy(() => import('../views/apps/eCommerce/Ecommerce')));
const EcommerceDetail = Loadable(lazy(() => import('../views/apps/eCommerce/EcommerceDetail')));
const EcomProductList = Loadable(lazy(() => import('../views/apps/eCommerce/EcomProductList')));
const EcomProductCheckout = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceCheckout')),
);
const Calendar = Loadable(lazy(() => import('../views/apps/calendar/BigCalendar')));
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));
const Followers = Loadable(lazy(() => import('../views/apps/user-profile/Followers')));
const Friends = Loadable(lazy(() => import('../views/apps/user-profile/Friends')));
const Gallery = Loadable(lazy(() => import('../views/apps/user-profile/Gallery')));
const Email = Loadable(lazy(() => import('../views/apps/email/Email')));

// ui components
const MuiAlert = Loadable(lazy(() => import('../views/ui-components/MuiAlert')));
const MuiAccordion = Loadable(lazy(() => import('../views/ui-components/MuiAccordion')));
const MuiAvatar = Loadable(lazy(() => import('../views/ui-components/MuiAvatar')));
const MuiChip = Loadable(lazy(() => import('../views/ui-components/MuiChip')));
const MuiDialog = Loadable(lazy(() => import('../views/ui-components/MuiDialog')));
const MuiList = Loadable(lazy(() => import('../views/ui-components/MuiList')));
const MuiPopover = Loadable(lazy(() => import('../views/ui-components/MuiPopover')));
const MuiRating = Loadable(lazy(() => import('../views/ui-components/MuiRating')));
const MuiTabs = Loadable(lazy(() => import('../views/ui-components/MuiTabs')));
const MuiTooltip = Loadable(lazy(() => import('../views/ui-components/MuiTooltip')));
const MuiTransferList = Loadable(lazy(() => import('../views/ui-components/MuiTransferList')));
const MuiTypography = Loadable(lazy(() => import('../views/ui-components/MuiTypography')));

// form elements
const MuiAutoComplete = Loadable(
  lazy(() => import('../views/forms/form-elements/MuiAutoComplete')),
);
const MuiButton = Loadable(lazy(() => import('../views/forms/form-elements/MuiButton')));
const MuiCheckbox = Loadable(lazy(() => import('../views/forms/form-elements/MuiCheckbox')));
const MuiRadio = Loadable(lazy(() => import('../views/forms/form-elements/MuiRadio')));
const MuiSlider = Loadable(lazy(() => import('../views/forms/form-elements/MuiSlider')));
const MuiDateTime = Loadable(lazy(() => import('../views/forms/form-elements/MuiDateTime')));
const MuiSwitch = Loadable(lazy(() => import('../views/forms/form-elements/MuiSwitch')));

// forms
const FormLayouts = Loadable(lazy(() => import('../views/forms/FormLayouts')));
const FormCustom = Loadable(lazy(() => import('../views/forms/FormCustom')));
const FormHorizontal = Loadable(lazy(() => import('../views/forms/FormHorizontal')));
const FormVertical = Loadable(lazy(() => import('../views/forms/FormVertical')));
const FormWizard = Loadable(lazy(() => import('../views/forms/FormWizard')));
const FormValidation = Loadable(lazy(() => import('../views/forms/FormValidation')));
const QuillEditor = Loadable(lazy(() => import('../views/forms/quill-editor/QuillEditor')));

// pages
const RollbaseCASL = Loadable(lazy(() => import('../views/pages/rollbaseCASL/RollbaseCASL')));
const Treeview = Loadable(lazy(() => import('../views/pages/treeview/Treeview')));
const Faq = Loadable(lazy(() => import('../views/pages/faq/Faq')));
const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing')));
const AccountSetting = Loadable(
  lazy(() => import('../views/pages/account-setting/AccountSetting')),
);

// charts
const AreaChart = Loadable(lazy(() => import('../views/charts/AreaChart')));
const CandlestickChart = Loadable(lazy(() => import('../views/charts/CandlestickChart')));
const ColumnChart = Loadable(lazy(() => import('../views/charts/ColumnChart')));
const DoughnutChart = Loadable(lazy(() => import('../views/charts/DoughnutChart')));
const GredientChart = Loadable(lazy(() => import('../views/charts/GredientChart')));
const RadialbarChart = Loadable(lazy(() => import('../views/charts/RadialbarChart')));
const LineChart = Loadable(lazy(() => import('../views/charts/LineChart')));

// tables
const BasicTable = Loadable(lazy(() => import('../views/tables/BasicTable')));
const EnhanceTable = Loadable(lazy(() => import('../views/tables/EnhanceTable')));
const PaginationTable = Loadable(lazy(() => import('../views/tables/PaginationTable')));
const FixedHeaderTable = Loadable(lazy(() => import('../views/tables/FixedHeaderTable')));
const CollapsibleTable = Loadable(lazy(() => import('../views/tables/CollapsibleTable')));
const SearchTable = Loadable(lazy(() => import('../views/tables/SearchTable')));

// widget
const WidgetCards = Loadable(lazy(() => import('../views/widgets/cards/WidgetCards')));
const WidgetBanners = Loadable(lazy(() => import('../views/widgets/banners/WidgetBanners')));
const WidgetCharts = Loadable(lazy(() => import('../views/widgets/charts/WidgetCharts')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps2')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

// landingpage
const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
       children: [
      { path: '/', element: <Navigate to="/dashboards/modern" /> },
      { path: '/dashboards/modern', exact: true, element: <ProtectedRoute element={<ModernDash />} /> },
      { path: '/dashboards/clients', exact: true, element: <ProtectedRoute element={<Client />} /> },
      { path: '/dashboards/Fournisseurs', exact: true, element: <ProtectedRoute element={<Fournisseur />} /> },
      { path: '/dashboards/ecommerce', exact: true, element: <ProtectedRoute element={<EcommerceDash />} /> },
      { path: '/apps/contacts', element: <ProtectedRoute element={<Contacts />} /> },
      { path: '/apps/blog/posts', element: <ProtectedRoute element={<Blog />} /> },
      { path: '/apps/blog/detail/:id', element: <ProtectedRoute element={<BlogDetail />} /> },
      { path: '/apps/chats', element: <ProtectedRoute element={<Chats />} /> },
      { path: '/apps/email', element: <ProtectedRoute element={<Email />} /> },
      { path: '/apps/notes', element: <ProtectedRoute element={<Notes />} /> },
      { path: '/apps/tickets', element: <ProtectedRoute element={<Tickets />} /> },
      { path: '/apps/ecommerce/shop', element: <ProtectedRoute element={<Ecommerce />} /> },
      { path: '/apps/ecommerce/eco-product-list', element: <ProtectedRoute element={<EcomProductList />} /> },
      { path: '/apps/ecommerce/eco-checkout', element: <ProtectedRoute element={<EcomProductCheckout />} /> },
      { path: '/apps/ecommerce/detail/:id', element: <ProtectedRoute element={<EcommerceDetail />} /> },
      { path: '/apps/followers', element: <ProtectedRoute element={<Followers />} /> },
      { path: '/apps/friends', element: <ProtectedRoute element={<Friends />} /> },
      { path: '/apps/gallery', element: <ProtectedRoute element={<Gallery />} /> },
      { path: '/user-profile', element: <ProtectedRoute element={<UserProfile />} /> },
      { path: '/apps/calendar', element: <ProtectedRoute element={<Calendar />} /> },
      { path: '/ui-components/alert', element: <ProtectedRoute element={<MuiAlert />} /> },
      { path: '/ui-components/accordion', element: <ProtectedRoute element={<MuiAccordion />} /> },
      { path: '/ui-components/avatar', element: <ProtectedRoute element={<MuiAvatar />} /> },
      { path: '/ui-components/chip', element: <ProtectedRoute element={<MuiChip />} /> },
      { path: '/ui-components/dialog', element: <ProtectedRoute element={<MuiDialog />} /> },
      { path: '/ui-components/list', element: <ProtectedRoute element={<MuiList />} /> },
      { path: '/ui-components/popover', element: <ProtectedRoute element={<MuiPopover />} /> },
      { path: '/ui-components/rating', element: <ProtectedRoute element={<MuiRating />} /> },
      { path: '/ui-components/tabs', element: <ProtectedRoute element={<MuiTabs />} /> },
      { path: '/ui-components/tooltip', element: <ProtectedRoute element={<MuiTooltip />} /> },
      { path: '/ui-components/transfer-list', element: <ProtectedRoute element={<MuiTransferList />} /> },
      { path: '/ui-components/typography', element: <ProtectedRoute element={<MuiTypography />} /> },
      { path: '/pages/casl', element: <ProtectedRoute element={<RollbaseCASL />} /> },
      { path: '/pages/treeview', element: <ProtectedRoute element={<Treeview />} /> },
      { path: '/pages/pricing', element: <ProtectedRoute element={<Pricing />} /> },
      { path: '/pages/faq', element: <ProtectedRoute element={<Faq />} /> },
      { path: '/pages/account-settings', element: <ProtectedRoute element={<AccountSetting />} /> },
      { path: '/tables/basic', element: <ProtectedRoute element={<BasicTable />} /> },
      { path: '/tables/enhanced', element: <ProtectedRoute element={<EnhanceTable />} /> },
      { path: '/tables/pagination', element: <ProtectedRoute element={<PaginationTable />} /> },
      { path: '/tables/fixed-header', element: <ProtectedRoute element={<FixedHeaderTable />} /> },
      { path: '/tables/collapsible', element: <ProtectedRoute element={<CollapsibleTable />} /> },
      { path: '/tables/search', element: <ProtectedRoute element={<SearchTable />} /> },
      { path: '/forms/form-elements/autocomplete', element: <ProtectedRoute element={<MuiAutoComplete />} /> },
      { path: '/forms/form-elements/button', element: <ProtectedRoute element={<MuiButton />} /> },
      { path: '/forms/form-elements/checkbox', element: <ProtectedRoute element={<MuiCheckbox />} /> },
      { path: '/forms/form-elements/radio', element: <ProtectedRoute element={<MuiRadio />} /> },
      { path: '/forms/form-elements/slider', element: <ProtectedRoute element={<MuiSlider />} /> },
      { path: '/forms/form-elements/date-time', element: <ProtectedRoute element={<MuiDateTime />} /> },
      { path: '/forms/form-elements/switch', element: <ProtectedRoute element={<MuiSwitch />} /> },
      { path: '/forms/form-elements/switch', element: <ProtectedRoute element={<MuiSwitch />} /> },
      { path: '/forms/form-layouts', element: <ProtectedRoute element={<FormLayouts />} /> },
      { path: '/forms/form-custom', element: <ProtectedRoute element={<FormCustom />} /> },
      { path: '/forms/form-wizard', element: <ProtectedRoute element={<FormWizard />} /> },
      { path: '/forms/form-validation', element: <ProtectedRoute element={<FormValidation />} /> },
      { path: '/forms/form-horizontal', element: <ProtectedRoute element={<FormHorizontal />} /> },
      { path: '/forms/form-vertical', element: <ProtectedRoute element={<FormVertical />} /> },
      { path: '/forms/quill-editor', element: <ProtectedRoute element={<QuillEditor />} /> },
      { path: '/charts/area-chart', element: <ProtectedRoute element={<AreaChart />} /> },
      { path: '/charts/line-chart', element: <ProtectedRoute element={<LineChart />} /> },
      { path: '/charts/gredient-chart', element: <ProtectedRoute element={<GredientChart />} /> },
      { path: '/charts/candlestick-chart', element: <ProtectedRoute element={<CandlestickChart />} /> },
      { path: '/charts/column-chart', element: <ProtectedRoute element={<ColumnChart />} /> },
      { path: '/charts/doughnut-pie-chart', element: <ProtectedRoute element={<DoughnutChart />} /> },
      { path: '/charts/radialbar-chart', element: <ProtectedRoute element={<RadialbarChart />} /> },
      { path: '/widgets/cards', element: <ProtectedRoute element={<WidgetCards />} /> },
      { path: '/widgets/banners', element: <ProtectedRoute element={<WidgetBanners />} /> },
      { path: '/widgets/charts', element: <ProtectedRoute element={<WidgetCharts />} /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/forgot-password2', element: <ForgotPassword2 /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/two-steps2', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '/landingpage', element: <Landingpage /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;

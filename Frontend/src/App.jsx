import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './Home';
import UserContext from './UseContext.jsx';
import { First } from './first';
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from './components/RegisterForm.jsx';
import SingleProduct from './SingleProduct.jsx';
import Cart from './cart.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AuthProvider from './AuthContext.jsx';
import Wishlist from './wishlist.jsx';
import Admin from "./ProductAddForm.jsx";
import EditProductForm from "./EditProductForm.jsx";
import PublicRoute from './PublicRoute.jsx';

import Productorder from './productorder.jsx';
import GetMyOrders from './GetMyOrders.jsx'; 
import AllOrders from './AllOrders.jsx';
import SuccessPage from './SuccessPage.jsx';
import CancelPage from './CancelPage.jsx';




const router = createBrowserRouter([
  {
    path: '/',
    element: <First />,
    children: [
      // { index: true, element: <RegisterForm /> },
      // { path: 'LoginForm', element: <LoginForm /> },

           { 
        index: true, 
        element: (
          <PublicRoute>
            <RegisterForm /> 
          </PublicRoute>
        ) 
      },
      { 
        path: 'LoginForm', 
        element: (
          <PublicRoute> 
            <LoginForm /> 
          </PublicRoute>
        ) 
      },

      {
        path: 'Home',
        element: (
       
            <Home />
        
        ),
      },


      
        {
        path: '/AddProduct',
        element: (
          <ProtectedRoute>
            < Admin />
          </ProtectedRoute>
        ),
      },

          {
        path: '/productorder',
        element: (
          <ProtectedRoute>
            < Productorder />
          </ProtectedRoute>
        ),
      },


        {
        path: '/GetMyOrders',
        element: (
          <ProtectedRoute>
            <GetMyOrders />
          </ProtectedRoute>
        ),
      },

        {
        path: '/AllOrders',
        element: (
          <ProtectedRoute>
            <AllOrders />
          </ProtectedRoute>
        ),
      },

      {
        path: '/success',
        element: <SuccessPage />,
      },

      {
        path: '/cancel',
        element: <CancelPage />,
      },

      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },

        {
        path: '/wishList',
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ),
      },

      {
  path: 'admin/edit-product/:id',
  element: (
    <ProtectedRoute>
      <EditProductForm />
    </ProtectedRoute>
  ),
},

      {
        path: 'product/:id',
        element: (
         
            <SingleProduct />
        
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <UserContext>
        <RouterProvider router={router} />
      </UserContext>
    </AuthProvider>
  );
}

export default App;
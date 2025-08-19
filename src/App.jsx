import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Post from './pages/Post';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const App = () => {
    const { auth } = useAuth();
    const router = createBrowserRouter([
    auth ?
      {
        path: "/",
        element: <Post />,
        children: [
          {
            index: true,
            element: <Post />,
          },
        ],
      }
      :
      {
        path: "/",
        element: <Login />,
      },
    {
        path: '/register',
        element: <Register />,
    },
    ]);     
    return (
       <RouterProvider router={router} />
    );
};

export default App;
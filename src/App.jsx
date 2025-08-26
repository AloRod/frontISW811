import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Connections from './pages/Connections';
import Schedule from './pages/Schedule';
import History from './pages/History';
import Verify2FA from './pages/Verify2FA';
import Enable2FA from './pages/Enable2FA';
import OAuthAuth from './components/OAuthAuth';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import { 
    CONNECTION_LINKEDIN_ROUTE, 
    CONNECTION_REDDIT_ROUTE, 
    CONNECTION_MASTODON_ROUTE, 
    CREATE_POST_ROUTE,
    QUEUE_ROUTE
} from './constants/routes';
import CreatePost from './pages/CreatePost';
import QueueManager from './pages/QueueManager';

const App = () => {
    const { auth } = useAuth();
    
    const router = createBrowserRouter([
        {
            path: "/",
            element: auth ? <Layout /> : <Login />,
            children: [
                {
                    index: true,
                    element: <Dashboard />,
                },
                {
                    path: "/dashboard",
                    element: <Dashboard />,
                },
                {
                    path: "/connections",
                    element: <Connections />,
                },
                {
                    path: "/schedule",
                    element: <Schedule />,
                },
                {
                    path: CREATE_POST_ROUTE,
                    element: <CreatePost />,
                },
                {
                    path: QUEUE_ROUTE,
                    element: <QueueManager />,
                },
                {
                    path: "/history",
                    element: <History />,
                },
                {
                    path: "/two-factor-authentication",
                    element: <Enable2FA />,
                },
                {
                    path: CONNECTION_LINKEDIN_ROUTE,
                    element: <OAuthAuth provider="linkedin" url={import.meta.env.VITE_LINKEDIN_ACCESS_TOKEN} />
                },
                {
                    path: CONNECTION_REDDIT_ROUTE,
                    element: <OAuthAuth provider="reddit" url={import.meta.env.VITE_REDDIT_ACCESS_TOKEN} />
                },
                {
                    path: CONNECTION_MASTODON_ROUTE,
                    element: <OAuthAuth provider="mastodon" url={import.meta.env.VITE_MASTODON_ACCESS_TOKEN} />
                },
            ],
        },
        {
            path: '/register',
            element: <Register />,
        },
        {
            path: '/verify-2fa',
            element: <Verify2FA />,
        },
    ]);     
    
    return (
       <RouterProvider router={router} />
    );
};

export default App;
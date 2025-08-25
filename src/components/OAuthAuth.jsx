import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONNECTIONS_ROUTE } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import axios from '../api/axios';
import Spinner from './Spinner';

const OAuthAuth = ({ provider, url }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    const getAccessToken = async () => {
      const body = {
        code: code,
        user_id: user.id
      };

      try {
        const response = await axios.post(url, body);

        if (!response.ok) {
          throw new Error(`Error - ${response.status}`);
        }

      } catch (error) {
        console.error(error);
      } finally {
        navigate(CONNECTIONS_ROUTE);
      }
    };

    if (code) {
      getAccessToken();
    }
  }, [ user, url]);

  return (
    <Spinner text={`Conectando con ${provider}...`} />
  );
};

export default OAuthAuth;

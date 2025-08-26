import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONNECTIONS_ROUTE } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { useOAuth } from '../hooks/useOAuth';
import axios from '../api/axios';
import Spinner from './Spinner';

const OAuthAuth = ({ provider, url }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasProcessed, startProcessing, finishProcessing } = useOAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    
    // Evitar procesamiento múltiple
    if (!code || !user?.id || hasProcessed) {
      return;
    }

    // Intentar iniciar el procesamiento
    if (!startProcessing()) {
      return; // Ya se está procesando
    }

    const getAccessToken = async () => {
      const body = {
        code: code,
        user_id: user.id
      };

      try {
        console.log(`Processing OAuth callback for ${provider} with code:`, code);
        const response = await axios.post(url, body);

        if (!response.ok) {
          throw new Error(`Error - ${response.status}`);
        }

        console.log(`OAuth callback successful for ${provider}`);
        
        // Limpiar el código de la URL para evitar reprocesamiento
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('code');
        window.history.replaceState({}, '', newUrl.toString());

      } catch (error) {
        console.error(`OAuth callback error for ${provider}:`, error);
      } finally {
        finishProcessing();
        // Navegar después de un breve delay para asegurar que el estado se actualice
        setTimeout(() => {
          navigate(CONNECTIONS_ROUTE);
        }, 100);
      }
    };

    getAccessToken();
  }, [provider, url, user?.id, hasProcessed, startProcessing, finishProcessing]);

  return (
    <Spinner text={`Conectando con ${provider}...`} />
  );
};

export default OAuthAuth;

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
    const error = new URLSearchParams(window.location.search).get('error');
    
    // Si hay un error en la URL, redirigir inmediatamente
    if (error) {
      console.error(`OAuth error for ${provider}:`, error);
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete('error');
      newUrl.searchParams.set('auth_error', error);
      window.history.replaceState({}, '', newUrl.toString());
      navigate(CONNECTIONS_ROUTE);
      return;
    }
    
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

        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`Error - ${response.status}: ${response.statusText}`);
        }

        console.log(`OAuth callback successful for ${provider}`);
        
        // Limpiar el código de la URL para evitar reprocesamiento
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('code');
        newUrl.searchParams.set('auth_success', 'true');
        window.history.replaceState({}, '', newUrl.toString());

      } catch (error) {
        console.error(`OAuth callback error for ${provider}:`, error);
        // Limpiar el código de la URL y agregar error
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('code');
        newUrl.searchParams.set('auth_error', error.message || 'Error desconocido');
        window.history.replaceState({}, '', newUrl.toString());
      } finally {
        finishProcessing();
        // Navegar después de un breve delay para asegurar que el estado se actualice
        setTimeout(() => {
          window.location.replace(CONNECTIONS_ROUTE);
        }, 100);
      }
    };

    getAccessToken();
  }, [provider, url, user?.id, hasProcessed, startProcessing, finishProcessing, navigate]);

  return (
    <Spinner text={`Conectando con ${provider}...`} />
  );
};

export default OAuthAuth;

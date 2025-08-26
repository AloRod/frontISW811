import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import dayjs from 'dayjs';
import config from '../config/env';
import axios from '../api/axios';
import { 
    Linkedin, 
    MessageSquare, 
    Globe, 
    Link,
    Clock,
    Calendar,
    Send,
    Plus
} from 'lucide-react';

const CreatePost = () => {
  const [isUnlinkedAccount, setIsUnlinkedAccount] = useState(false);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [status, setStatus] = useState('queue');
  const [post, setPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialNetworks, setSocialNetworks] = useState([]);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState('');

  // Estados para el tipo de publicación
  const [publishType, setPublishType] = useState('queue'); // 'queue' | 'scheduled' | 'immediate'
  const [connections, setConnections] = useState([]);

  const { user } = useAuth();

  const socialNetworksConfig = [
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-500' },
    { id: 'reddit', name: 'Reddit', icon: MessageSquare, color: 'bg-orange-500' },
    { id: 'mastodon', name: 'Mastodon', icon: Globe, color: 'bg-purple-500' }
  ];

  useEffect(() => {
    const getPlatformStatus = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/connections/user/${user.id}/platform-status`);

        if (response.status !== 200) {
          throw new Error(`Error de red - ${response.status}`);
        }

        const data = await response.data;
        console.log(data);
        if (data.data.length > 0) {
          // Transformar para el formato de conexiones
          const activeConnections = data.data
            .filter(item => item.status === true)
            .map(item => ({
                id: item.id,
                platform: item.platform,
                status: item.status,
                user_id: item.user_id
            }));
          setConnections(activeConnections);
        } else {
          setIsUnlinkedAccount(true);
        }

      } catch (error) {
        setIsUnlinkedAccount(true);
        console.error(error);
      } finally {
        setIsShow(true);
      }
    };

    getPlatformStatus();
  }, [user.id]);

  const handlePublishTypeChange = (type) => {
    setPublishType(type);
    if (type === 'immediate') {
      setStatus('published');
      setDate(dayjs().format('YYYY-MM-DDTHH:mm'));
    } else if (type === 'scheduled') {
      setStatus('scheduled');
    } else {
      setStatus('queue');
    }
  };

  const handleNetworkToggle = (networkId) => {
    setSocialNetworks(prev => 
      prev.includes(networkId)
        ? prev.filter(id => id !== networkId)
        : [...prev, networkId]
    );
  };

  const getDateTime = () => {
    if (publishType === 'immediate' || publishType === 'scheduled') {
      const newDateTime = date.split('T');
      return {
        date: newDateTime[0],
        time: newDateTime[1],
      };
    }
    return {
      date: null,
      time: null,
    };
  };

  const showToastSaved = () => {
    setIsSuccessful(true);
    cleanFields();
    // After 3 seconds, set setIsSaved to false
    setTimeout(() => {
      setIsSuccessful(false);
    }, 3000);
  };

  const onCloseToast = () => {
    setIsSuccessful(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (socialNetworks.length === 0) {
      setError('Debes seleccionar al menos una red social');
      return;
    }

    if (!post || post.trim() === '') {
      setError('Debes escribir el contenido de la publicación');
      return;
    }

    setIsLoading(true);

    try {
      const dateTime = getDateTime();
      const body = {
        "date": dateTime.date,
        "time": dateTime.time,
        "status": status,
        "user_id": user.id,
        "post_text": post,
        "social_network": socialNetworks.join(',')
      };

      const response = await axios.post(`${config.API_URL}/histories`, body);

      if (response.status !== 201) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      showToastSaved();
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error al crear la publicación. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const cleanFields = () => {
    setStatus('queue');
    setPublishType('queue');
    setError('');
    setPost('');
    setSocialNetworks([]);
  };

  if (!isShow) {
    return <Spinner fullScreen={true} />;
  }

  if (isUnlinkedAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 text-red-500 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cuentas conectadas</h3>
            <p className="text-gray-500 mb-6">Necesitas conectar al menos una red social para poder crear publicaciones</p>
            <a
              href="/connections"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Conectar Redes Sociales
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative flex flex-col w-full max-w-screen-xl gap-6 px-4 py-6 mx-auto lg:px-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Publicación</h1>
          <p className="text-gray-600 mt-1">Crea y programa tus publicaciones para múltiples redes sociales</p>
        </div>
      </div>

      {/* Alert de éxito */}
      {isSuccessful && (
        <Alert
          message="¡Publicación creada exitosamente!"
          type="success"
          onClose={onCloseToast}
        />
      )}

      {/* Alert de error */}
      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError('')}
        />
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        {/* Tipo de publicación */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Tipo de Publicación</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Publicación inmediata */}
            <div 
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                publishType === 'immediate' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePublishTypeChange('immediate')}
            >
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  name="publishType"
                  value="immediate"
                  checked={publishType === 'immediate'}
                  onChange={() => handlePublishTypeChange('immediate')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Publicar inmediatamente
                </span>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                Al marcar esta opción, la publicación se enviará de inmediato a las redes sociales seleccionadas
              </p>
            </div>

            {/* Agregar a cola */}
            <div 
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                publishType === 'queue' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePublishTypeChange('queue')}
            >
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  name="publishType"
                  value="queue"
                  checked={publishType === 'queue'}
                  onChange={() => handlePublishTypeChange('queue')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Agregar a cola
                </span>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                La publicación se agregará a la cola y se publicará según los horarios configurados en tu agenda semanal
              </p>
            </div>

            {/* Programar fecha específica */}
            <div 
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                publishType === 'scheduled' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePublishTypeChange('scheduled')}
            >
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  name="publishType"
                  value="scheduled"
                  checked={publishType === 'scheduled'}
                  onChange={() => handlePublishTypeChange('scheduled')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Programar fecha específica
                </span>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                Selecciona una fecha y hora específica para publicar el contenido
              </p>
            </div>
          </div>
        </div>

        {/* Selector de fecha y hora (solo visible para publicación programada) */}
        {publishType === 'scheduled' && (
          <div className="mb-8">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha y Hora de Publicación
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={dayjs().format('YYYY-MM-DDTHH:mm')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Selecciona cuándo quieres que se publique el contenido
            </p>
          </div>
        )}

        {/* Contenido de la publicación */}
        <div className="mb-8">
          <label htmlFor="post" className="block text-sm font-medium text-gray-700 mb-2">
            Contenido de la Publicación
          </label>
          <textarea
            id="post"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            rows={6}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escribe aquí el contenido de tu publicación..."
            maxLength={280}
          />
          <div className="mt-1 flex justify-between text-sm text-gray-500">
            <span>Máximo 280 caracteres</span>
            <span>{post.length}/280</span>
          </div>
        </div>

        {/* Selección de redes sociales */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Redes Sociales ({socialNetworks.length} seleccionadas)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialNetworksConfig.map((network) => {
              const isConnected = connections.some(conn => conn.platform === network.id);
              const isSelected = socialNetworks.includes(network.id);
              
              return (
                <button
                  key={network.id}
                  type="button"
                  onClick={() => handleNetworkToggle(network.id)}
                  disabled={!isConnected}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                    isConnected
                      ? isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${network.color} flex items-center justify-center text-white`}>
                      <network.icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{network.name}</div>
                      <div className="text-sm text-gray-500">
                        {isConnected ? '✅ Conectado' : '❌ No conectado'}
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {connections.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                💡 No tienes redes sociales conectadas. Ve a la sección de conexiones para conectar tus cuentas.
              </p>
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </>
            ) : (
              <>
                {publishType === 'immediate' ? (
                  <Send className="w-4 h-4 mr-2" />
                ) : publishType === 'scheduled' ? (
                  <Calendar className="w-4 h-4 mr-2" />
                ) : (
                  <Clock className="w-4 h-4 mr-2" />
                )}
                {publishType === 'immediate' ? 'Publicar Ahora' : publishType === 'scheduled' ? 'Programar Publicación' : 'Agregar a Cola'}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
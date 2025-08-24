// Configuración de variables de entorno
export const config = {
    // API
    API_URL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
    
    // OAuth URLs
    LINKEDIN: {
        AUTHORIZE_URL: import.meta.env.VITE_LINKEDIN_LINK || "http://127.0.0.1:8000/api/connections/linkedin/authorize",
        ACCESS_TOKEN_URL: import.meta.env.VITE_LINKEDIN_ACCESS_TOKEN || "http://127.0.0.1:8000/api/connections/linkedin/access-token"
    },
    
    REDDIT: {
        AUTHORIZE_URL: import.meta.env.VITE_REDDIT_LINK || "http://127.0.0.1:8000/api/connections/reddit/authorize",
        ACCESS_TOKEN_URL: import.meta.env.VITE_REDDIT_ACCESS_TOKEN || "http://127.0.0.1:8000/api/connections/reddit/access-token"
    },
    
    MASTODON: {
        AUTHORIZE_URL: import.meta.env.VITE_MASTODON_LINK || "http://127.0.0.1:8000/api/connections/mastodon/authorize",
        ACCESS_TOKEN_URL: import.meta.env.VITE_MASTODON_ACCESS_TOKEN || "http://127.0.0.1:8000/api/connections/mastodon/access-token"
    }
};

export default config;

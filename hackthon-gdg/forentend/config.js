// API Configuration for Development and Production
// Automatically detects environment and uses appropriate API URL

const API_CONFIG = (() => {
    // Check if running on localhost
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '';
    
    // Set API base URLs
    const DEVELOPMENT_URL = 'http://localhost:7777';
    const PRODUCTION_URL = 'https://gdg-hackhon-group.vercel.app';
    
    // Choose the appropriate URL based on environment
    const API_BASE_URL = isLocalhost ? DEVELOPMENT_URL : PRODUCTION_URL;
    
    console.log(`🌍 Environment: ${isLocalhost ? 'Development (Localhost)' : 'Production'}`);
    console.log(`🔗 API URL: ${API_BASE_URL}`);
    
    return {
        baseURL: API_BASE_URL,
        endpoints: {
            // User Authentication endpoints
            login: `${API_BASE_URL}/user/login`,
            signUp: `${API_BASE_URL}/user/sign-up`,
            register: `${API_BASE_URL}/user/sign-up`,
            home: `${API_BASE_URL}/user/home`,
            
            // User Profile endpoints
            updateUsername: `${API_BASE_URL}/user/updateUsername`,
            updatePassword: `${API_BASE_URL}/user/updatepassword`,
            forgotPassword: `${API_BASE_URL}/user/forgotpassword`,
            resetPassword: (id, token) => `${API_BASE_URL}/user/reset-password/${id}/${token}`,
            
            // Diet & Workout Plan endpoints
            generateDiet: `${API_BASE_URL}/dite/generate`,
            getPlan: (userId) => `${API_BASE_URL}/dite/get-plan/${userId}`,
            confirmPlan: `${API_BASE_URL}/dite/confirm-plan`,
            diteInput: `${API_BASE_URL}/dite/dite-input`,
            
            // Order & Shopping endpoints
            order: `${API_BASE_URL}/dite/order`,
            orderX: `${API_BASE_URL}/dite/orderx`,
            orderEx: (userId) => `${API_BASE_URL}/dite/orderex/${userId}`,
        },
        isProduction: !isLocalhost,
        isDevelopment: isLocalhost
    };
})();

// Export for use in other scripts
window.API_CONFIG = API_CONFIG;

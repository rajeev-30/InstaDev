import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import {Provider} from 'react-redux'
import { persistor, store } from './redux/store';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from 'redux-persist/integration/react'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
  // </StrictMode>,
)

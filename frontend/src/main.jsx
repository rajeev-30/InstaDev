import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import {Provider} from 'react-redux'
import { store } from './redux/store';
// import dotenv from "dotenv";

// dotenv.config();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId="292677513827-iv7ndceft3lq4ao1qo6mdd6514o2nh35.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
  // </StrictMode>,
)

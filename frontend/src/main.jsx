import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import { store } from "./store/store.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>);

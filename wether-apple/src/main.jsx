import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './input.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/Store.jsx'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Provider store={store}>
<BrowserRouter>
    <App />
</BrowserRouter>
    </Provider>
  </StrictMode>,
)

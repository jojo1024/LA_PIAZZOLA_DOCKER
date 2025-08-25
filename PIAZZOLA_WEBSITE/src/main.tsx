import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import App from './App'
import "./styles/index.scss";

// import "rc-slider/assets/index.css";
let persistor = persistStore(store);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <App />
      </StrictMode>
    </PersistGate>
  </Provider>
)

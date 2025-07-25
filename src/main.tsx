import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store ,persistor } from '../Redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
);

// In App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './store'; // Stelle sicher, dass der Pfad zu deinem Store korrekt ist
import MainApp from './Index'; // Importiere die Haupt-App-Komponente

function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

export default App;

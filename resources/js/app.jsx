import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './router';



const App = () => {
  return <AppRoutes />;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export default App;

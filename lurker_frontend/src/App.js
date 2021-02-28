import { BrowserRouter } from 'react-router-dom'
import './App.css';
import Authentication from './containers/authentication/Authentication'

function App() {
  return (
    <BrowserRouter>
      <Authentication />
    </BrowserRouter>
  );
}

export default App;

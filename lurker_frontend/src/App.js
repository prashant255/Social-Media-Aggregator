import { BrowserRouter } from 'react-router-dom'
import './App.css';
import Routing from './components/routing/Routing'
import React from 'react'

const App = () =>{
  console.log("App")
  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default React.memo(App);

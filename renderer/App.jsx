import React from 'react';
import { render } from 'react-dom';
import initTilebar from './titlebar.js';
import Nav from './components/Nav.jsx';
import DebugButton from './components/DebugButton.jsx';
import Footer from './components/Footer.jsx';
import axiosDebug from './axiosDebug.js';
import { isDev } from './constants.js';
import './css/main.css';

if (isDev) {
  axiosDebug();
}

initTilebar();
const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const App = () => (
  <div className="m-1">
    <DebugButton />
    <Nav />
    <Footer />
  </div>
);

render(<App />, mainElement);

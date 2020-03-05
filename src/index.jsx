import ReactDOM from 'react-dom';
import React from 'react';
import MyForm from './MyForm';
// import $ from 'jquery';

// const shell = require('electron').shell;
// //open links externally by default
// $(document).on('click', 'a[href^="http"]', function(event) {
//     event.preventDefault();
//     shell.openExternal(this.href);
// });
ReactDOM.render(
  <MyForm />,
  document.getElementById('container'),
);

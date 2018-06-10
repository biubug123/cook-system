import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import RouterMap from './routerMap'

import registerServiceWorker from './registerServiceWorker';



ReactDOM.render(<RouterMap />, document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import { render } from 'react-dom';

import Home from './Home';
import './index.css';

render(<Home />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();

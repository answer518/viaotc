import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { router } from './routes';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import '../css/main';
import Root from './Root';

import globalReducer from './reducer'
//  applyMiddleware(logger)

const store = createStore(
  globalReducer
);

render(<Provider store={store}>
		<Router history={browserHistory} routes={router}/>
</Provider>, document.getElementById('root'));
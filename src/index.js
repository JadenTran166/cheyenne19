import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { CssBaseline } from '@material-ui/core';
import App from './containers/App';
import MultiThemeProvider from './containers/MultiThemeProvider';

import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Provider as ReduxProvide } from 'react-redux';
import store from 'config/store';

ReactDOM.render(
  <Router>
    <ReduxProvide store={store}>
      <MultiThemeProvider>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          preventDuplicate>
          <App />
        </SnackbarProvider>
      </MultiThemeProvider>
    </ReduxProvide>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();

// if (process.env.NODE_ENV === "production") {
//   serviceWorker.register();
// } else {
//   serviceWorker.unregister();
// }

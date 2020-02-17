import React, { useState } from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from "react-redux";
import ReduxThunk from 'redux-thunk';
import { createLogger } from "redux-logger";

import Nav from './src/Nav';
import feedReducer from './src/store/reducers/feedReducer';
import authReducer from './src/store/reducers/authReducer';
import usersReducer from './src/store/reducers/usersReducer';


const reducers = combineReducers({
  feed: feedReducer,
  auth: authReducer,
  users: usersReducer
})

const logger = createLogger({
  diff: true
})

const store = createStore(reducers, applyMiddleware(ReduxThunk, logger))

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={ fetchFonts }
        onFinish={ () => {
          setFontLoaded(true);
        } }
      />
    );
  }
  return (
    <Provider store={ store }>
      <Nav />
    </Provider>

  );
}

import * as React from "react";
import * as ReactRouterRedux from "react-router-redux";
import { Iterable } from "immutable";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { History, createBrowserHistory, createHashHistory } from "history";
import { Route, Switch } from "react-router-dom";
import { MuiThemeProvider } from "material-ui/styles";
import HomeComponent from "./components/home";
import Navbar from "./components/navbar";
import CreatePost from "./components/posts/new";
import EnvChecker from "./helpers/envChecker";
import { rootReducer } from "./reducers";
import { initialState } from "./reducers/index";
import rootSaga from "./sagas/index";

let history: History;
if (EnvChecker.isDev()) {
  history = createHashHistory();
} else {
  history = createBrowserHistory();
}

const routerMid = ReactRouterRedux.routerMiddleware(history as any);
const sagaMiddleware = createSagaMiddleware();
const logger = createLogger({
  stateTransformer: state => {
    const newState: any = {}; // HACK: Should assign proper type later
    for (const i of Object.keys(state)) {
      if (Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    }
    return newState;
  },
});

export const store = createStore(rootReducer, initialState, applyMiddleware(routerMid, sagaMiddleware, logger));

sagaMiddleware.run(rootSaga);

const RootRoute = () => {
  return (
    <MuiThemeProvider>
      <Provider store={store}>
        <ReactRouterRedux.ConnectedRouter history={history}>
          <div>
            <Navbar />
            <Switch>
              <Route exact path="/" component={HomeComponent} />
              <Route exact path="/posts/new" component={CreatePost} />
            </Switch>
          </div>
        </ReactRouterRedux.ConnectedRouter>
      </Provider>
    </MuiThemeProvider>
  );
};

export default RootRoute;

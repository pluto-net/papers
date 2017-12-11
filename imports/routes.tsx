import * as React from "react";
import * as ReactRouterRedux from "react-router-redux";
import { Iterable } from "immutable";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { History, createBrowserHistory, createHashHistory } from "history";
import { Route, Switch, withRouter, RouteComponentProps } from "react-router-dom";
import HomeComponent from "./components/home";
import Navbar from "./components/navbar";
import CreatePost from "./components/posts/new";
import PostShow from "./components/posts/show";
import PostModal from "./components/posts/modal";
import UserProfile from "./components/users/show";
import UserProfileEdit from "./components/users/edit";
import AdminMainPage from "./components/admin";
import EnvChecker from "./helpers/envChecker";
import { initialState, rootReducer } from "./reducers";
import rootSaga from "./sagas";
import LocationListener from "./components/common/locationListener";
import "react-datepicker/dist/react-datepicker.css";

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

const middlewares = [];
middlewares.push(routerMid);
middlewares.push(sagaMiddleware);

if (!Meteor.isProduction) {
  middlewares.push(logger);
}

export const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));

sagaMiddleware.run(rootSaga);

interface IPostModalSwitch extends RouteComponentProps<{}> {}

@withRouter
class PostModalSwitch extends React.Component<IPostModalSwitch, {}> {
  private previousLocation = this.props.location;

  public componentWillUpdate(nextProps: IPostModalSwitch) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (nextProps.history.action !== "POP" && (!location.state || !location.state.modal)) {
      this.previousLocation = this.props.location;
    }
  }

  public render() {
    const { location } = this.props;
    const isModal = !!(location.state && location.state.modal && this.previousLocation !== location);

    return (
      <div>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path="/" component={HomeComponent} />
          <Route exact path="/posts/:postId" component={PostShow} />
        </Switch>
        {isModal ? <Route exact path="/posts/:postId" component={PostModal} /> : null}
      </div>
    );
  }
}

const RootRoute = () => {
  return (
    <Provider store={store}>
      <ReactRouterRedux.ConnectedRouter history={history}>
        <div>
          <Navbar />
          <LocationListener />
          <Route component={PostModalSwitch} />
          <Switch>
            <Route exact path="/posts/new" component={CreatePost} />
            <Route exact path="/admin" component={AdminMainPage} />
            {/* <Route exact path="/admin/posts/confirm" component={AdminConfirmFeedContainer} /> */}
            <Route exact path="/users/:userId/edit" component={UserProfileEdit} />
            <Route exact path="/users/:userId" component={UserProfile} />
          </Switch>
        </div>
      </ReactRouterRedux.ConnectedRouter>
    </Provider>
  );
};

export default RootRoute;

import { Meteor } from "meteor/meteor";
import { call, put, cancelled, take, fork, cancel } from "redux-saga/effects";
import { GLOBAL_DIALOGS } from "../../reducers/globalDialog";

interface ISignInParams {
  emailOrName: string;
  password: string;
}

function signIn({ emailOrName, password }: ISignInParams) {
  return new Promise((resolve, reject) => {
    Meteor.loginWithPassword(emailOrName, password, (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function logout() {
  return new Promise((resolve, reject) => {
    Meteor.logout((err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function* authorizeUser(params: ISignInParams) {
  try {
    yield call(signIn, params);
    yield put({ type: "LOGIN_SUCCESS" });
    yield put({ type: `CLOSE_${GLOBAL_DIALOGS.SIGN_IN}` });
  } catch (error) {
    yield put({ type: "LOGIN_ERROR" });
  } finally {
    if (yield cancelled()) {
      yield put({ type: "LOGIN_ERROR" });
    }
  }
}

export function* signInWatcher() {
  while (true) {
    const action = yield take("REQUEST_SIGN_IN");
    const params = {
      emailOrName: action.payload.emailOrName,
      password: action.payload.password,
    };

    const task = yield fork(authorizeUser, params);
    const outAction = yield take(["REQUEST_LOGOUT", "LOGIN_ERROR"]);

    if (outAction.type === "REQUEST_LOGOUT") {
      yield cancel(task);
    }
  }
}

export function* signOutWatcher() {
  while (true) {
    yield take("REQUEST_LOGOUT");
    yield call(logout);
    yield put({ type: "SUCCEEDED_TO_LOGOUT" });
  }
}

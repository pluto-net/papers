import { Accounts } from "meteor/accounts-base";
import { all, call, put, take } from "redux-saga/effects";
import { GLOBAL_DIALOGS } from "../reducers/globalDialog";
import { signInWatcher, signOutWatcher } from "./auth/auth";

function createUser(email: string, username: string, password: string) {
  return new Promise((resolve, reject) => {
    Accounts.createUser(
      {
        email,
        username,
        password,
        profile: {
          username,
        },
      },
      (err: Error) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

export function* requestCreateUser() {
  while (true) {
    const action = yield take("REQUEST_CREATE_USER");
    try {
      yield call(createUser, action.payload.email, action.payload.username, action.payload.password);
      yield put({ type: "SUCCEED_TO_CREATE_USER" });
      yield put({ type: `CLOSE_${GLOBAL_DIALOGS.SIGN_UP}` });
    } catch (err) {
      yield put({ type: "FAILED_TO_CREATE_USER" });
    }
  }
}

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([requestCreateUser(), signInWatcher(), signOutWatcher()]);
}

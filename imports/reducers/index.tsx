import * as Redux from "redux";
import { routerReducer } from "react-router-redux";
import { IDialogState, getDialogInitialState, GLOBAL_DIALOGS, makeDialogReducer } from "./globalDialog";

export interface IAppState {
  routing?: any;
  signUpDialog: IDialogState;
  signInDialog: IDialogState;
}

export const initialState: IAppState = {
  signUpDialog: getDialogInitialState(GLOBAL_DIALOGS.SIGN_UP),
  signInDialog: getDialogInitialState(GLOBAL_DIALOGS.SIGN_IN),
};

export const rootReducer = Redux.combineReducers({
  routing: routerReducer,
  signUpDialog: makeDialogReducer(GLOBAL_DIALOGS.SIGN_UP),
  signInDialog: makeDialogReducer(GLOBAL_DIALOGS.SIGN_IN),
});

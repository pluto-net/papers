export interface IDialogState {
  [key: string]: boolean;
}

export const GLOBAL_DIALOGS = {
  SIGN_UP: "SIGN_UP",
  SIGN_IN: "SIGN_IN",
};

export function getDialogInitialState(dialogName: string) {
  return {
    [`${dialogName}_isOpen`]: false,
  };
}

export function makeDialogReducer(dialogName: string) {
  const initialState = getDialogInitialState(dialogName);

  return function reducer(state = initialState, action: any) {
    switch (action.type) {
      case `OPEN_${dialogName}`: {
        return { ...state, ...{ [`${dialogName}_isOpen`]: true } };
      }

      case `CLOSE_${dialogName}`: {
        return { ...state, ...{ [`${dialogName}_isOpen`]: false } };
      }

      default:
        return state;
    }
  };
}

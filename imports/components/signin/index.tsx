import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { IDialogState } from "../../reducers/globalDialog";

interface ISignInDialogProps extends DispatchProp<any> {
  signInDialog: IDialogState;
  closeFunction: () => void;
}

interface ISignInDialogState {
  emailOrName: string;
  password: string;
}

function mapStateToProps(state: IAppState) {
  return {
    signInDialog: state.signInDialog,
  };
}

class SignInDialog extends React.PureComponent<ISignInDialogProps, ISignInDialogState> {
  public state = {
    emailOrName: "",
    password: "",
  };

  private handleInputChange = (field: string, e: React.FormEvent<{}>) => {
    if (field !== "password") {
      e.preventDefault();
    }
    const value = (e.currentTarget as any).value;
    this.setState({ ...this.state, ...{ [field]: value } });
  };

  private handleSignInSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { emailOrName, password } = this.state;

    dispatch({
      type: "REQUEST_SIGN_IN",
      payload: {
        emailOrName,
        password,
      },
    });
  };

  private getSignInForm() {
    const { closeFunction } = this.props;
    const { emailOrName, password } = this.state;

    return (
      <form onSubmit={this.handleSignInSubmit}>
        <div>
          <input
            onChange={e => {
              this.handleInputChange("emailOrName", e);
            }}
            type="text"
            value={emailOrName}
            placeholder="username or email"
          />
        </div>
        <div>
          <input
            onChange={e => {
              this.handleInputChange("password", e);
            }}
            type="password"
            value={password}
            placeholder="password"
          />
        </div>
        <button onClick={closeFunction}>Cancel</button>
        <button type="submit">Submit</button>
      </form>
    );
  }

  render() {
    return (
      <div>
        <div>{this.getSignInForm()}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignInDialog);

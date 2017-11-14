import * as React from "react";
import { Meteor } from "meteor/meteor";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { IDialogState } from "../../reducers/globalDialog";

interface ISignUpDialogProps extends DispatchProp<any> {
  signUpDialog: IDialogState;
  closeFunction: () => void;
}

interface ISignUpDialogState {
  email: string;
  name: string;
  password: string;
}

function mapStateToProps(state: IAppState) {
  return {
    signUpDialog: state.signUpDialog,
  };
}

class SignUpDialog extends React.PureComponent<ISignUpDialogProps, ISignUpDialogState> {
  public state = {
    email: "",
    name: "",
    password: "",
  };

  private handleInputChange = (field: string, e: React.FormEvent<{}>) => {
    if (field !== "password") {
      e.preventDefault();
    }
    const value = (e.currentTarget as any).value;
    this.setState({ ...this.state, ...{ [field]: value } });
  };

  private handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { email, name, password } = this.state;

    dispatch({
      type: "REQUEST_CREATE_USER",
      payload: {
        email,
        username: name,
        password,
      },
    });
  };

  private getSignUpForm() {
    const { closeFunction } = this.props;
    const { email, name, password } = this.state;

    return (
      <form onSubmit={this.handleSignUpSubmit}>
        <div>
          <input
            onChange={e => {
              this.handleInputChange("email", e);
            }}
            type="email"
            value={email}
            placeholder="email"
          />
        </div>
        <div>
          <input
            onChange={e => {
              this.handleInputChange("name", e);
            }}
            type="text"
            value={name}
            placeholder="username"
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

  private handleSignInWithFacebook = () => {
    Meteor.loginWithFacebook(
      {
        requestPermissions: ["user_friends", "public_profile", "email"],
      },
      (err: Error) => {
        if (err) {
          alert(err);
        } else {
          console.log("Succees to Login");
        }
      },
    );
  };

  render() {
    const { closeFunction, signUpDialog } = this.props;

    return (
      <div>
        <Dialog title="SIGN UP" modal open={signUpDialog.SIGN_UP_isOpen} onRequestClose={closeFunction}>
          {this.getSignUpForm()}
          <button onClick={this.handleSignInWithFacebook}>Login With Facebook</button>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUpDialog);

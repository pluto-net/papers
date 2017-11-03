import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { orange500, blue500 } from "material-ui/styles/colors";
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

    const styles = {
      errorStyle: {
        color: orange500,
      },
      underlineStyle: {
        borderColor: orange500,
      },
      floatingLabelStyle: {
        color: orange500,
      },
      floatingLabelFocusStyle: {
        color: blue500,
      },
    };

    return (
      <form onSubmit={this.handleSignInSubmit}>
        <div>
          <TextField
            onChange={e => {
              this.handleInputChange("emailOrName", e);
            }}
            type="text"
            value={emailOrName}
            hintText="username or email"
            hintStyle={styles.errorStyle}
            fullWidth
          />
        </div>
        <div>
          <TextField
            onChange={e => {
              this.handleInputChange("password", e);
            }}
            type="password"
            value={password}
            hintText="password"
            hintStyle={styles.errorStyle}
            fullWidth
          />
        </div>
        <FlatButton label="Cancel" primary={true} onClick={closeFunction} />
        <FlatButton type="submit" label="Submit" primary={true} />
      </form>
    );
  }

  render() {
    const { closeFunction, signInDialog } = this.props;

    return (
      <div>
        <Dialog title="SIGN IN" modal open={signInDialog.SIGN_IN_isOpen} onRequestClose={closeFunction}>
          {this.getSignInForm()}
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignInDialog);

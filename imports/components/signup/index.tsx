import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { orange500, blue500 } from "material-ui/styles/colors";
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
      <form onSubmit={this.handleSignUpSubmit}>
        <div>
          <TextField
            onChange={e => {
              this.handleInputChange("email", e);
            }}
            type="email"
            value={email}
            hintText="email"
            hintStyle={styles.errorStyle}
            fullWidth
          />
        </div>
        <div>
          <TextField
            onChange={e => {
              this.handleInputChange("name", e);
            }}
            type="text"
            value={name}
            hintText="username"
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
    const { closeFunction, signUpDialog } = this.props;

    return (
      <div>
        <Dialog title="SIGN UP" modal open={signUpDialog.SIGN_UP_isOpen} onRequestClose={closeFunction}>
          {this.getSignUpForm()}
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUpDialog);

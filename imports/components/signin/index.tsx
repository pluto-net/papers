import * as React from "react";
import { Input, Divider, Button, Modal } from "semantic-ui-react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { IDialogState } from "../../reducers/globalDialog";
import FacebookButton from "../common/facebookButton";

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

  private handleSignInSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
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
    const { emailOrName, password } = this.state;

    return (
      <div>
        <div className="sign-in-input">
          <Input
            fluid
            onChange={e => {
              this.handleInputChange("emailOrName", e);
            }}
            type="text"
            value={emailOrName}
            placeholder="username or email"
          />
        </div>
        <div className="sign-in-input">
          <Input
            fluid
            onChange={e => {
              this.handleInputChange("password", e);
            }}
            type="password"
            value={password}
            placeholder="password"
          />
        </div>
      </div>
    );
  }

  render() {
    const { closeFunction, signInDialog } = this.props;

    return (
      <div>
        <Modal size="mini" open={signInDialog.SIGN_IN_isOpen} onClose={closeFunction}>
          <Modal.Header>SIGN IN</Modal.Header>
          <Modal.Content>
            <FacebookButton />
            <Divider />
            {this.getSignInForm()}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={closeFunction} negative>
              No
            </Button>
            <Button onClick={this.handleSignInSubmit} type="submit" positive content="Submit" />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignInDialog);

import * as React from "react";
import FacebookButton from "../common/facebookButton";
import { Input, Button, Modal } from "semantic-ui-react";
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
        <div className="sign-up-input">
          <Input
            fluid
            onChange={e => {
              this.handleInputChange("email", e);
            }}
            type="email"
            value={email}
            placeholder="email"
          />
        </div>
        <div className="sign-up-input">
          <Input
            fluid
            onChange={e => {
              this.handleInputChange("name", e);
            }}
            type="text"
            value={name}
            placeholder="username"
          />
        </div>
        <div className="sign-up-input">
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
        <div className="sign-up-modal-actions-wrapper clearfix">
          <Button onClick={closeFunction} negative>
            No
          </Button>
          <Button positive content="Submit" />
        </div>
        <FacebookButton />
      </form>
    );
  }

  render() {
    const { closeFunction, signUpDialog } = this.props;

    return (
      <div>
        <Modal size="mini" open={signUpDialog.SIGN_UP_isOpen} onClose={closeFunction}>
          <Modal.Header>SIGN UP</Modal.Header>
          <Modal.Content>{this.getSignUpForm()}</Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUpDialog);

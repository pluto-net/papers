import * as React from "react";
import { Input, Button, Modal, Divider } from "semantic-ui-react";
import { connect, DispatchProp, Dispatch } from "react-redux";
import { IAppState } from "../../reducers";
import { IDialogState } from "../../reducers/globalDialog";
import FacebookButton from "../common/facebookButton";

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

  private handleSignUpSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { email, name, password } = this.state;

    (dispatch as Dispatch<any>)({
      type: "REQUEST_CREATE_USER",
      payload: {
        email,
        username: name,
        password,
      },
    });
  };

  private getSignUpForm() {
    const { email, name, password } = this.state;

    return (
      <div>
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
      </div>
    );
  }

  render() {
    const { closeFunction, signUpDialog } = this.props;

    return (
      <div>
        <Modal size="mini" open={signUpDialog.SIGN_UP_isOpen} onClose={closeFunction}>
          <Modal.Header>SIGN UP</Modal.Header>
          <Modal.Content>
            <FacebookButton />
            <Divider />
            {this.getSignUpForm()}
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={closeFunction} negative>
              No
            </Button>
            <Button onClick={this.handleSignUpSubmit} positive content="Submit" />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUpDialog);

import * as React from "react";
import { Button, Modal } from "semantic-ui-react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { IDialogState, GLOBAL_DIALOGS } from "../../reducers/globalDialog";
import FacebookButton from "../common/facebookButton";
import GoogleButton from "../common/googleButton";
import TwitterButton from "../common/twitterButton";

interface ISignUpDialogProps extends DispatchProp<any> {
  signUpDialog: IDialogState;
  closeFunction: () => void;
}

function mapStateToProps(state: IAppState) {
  return {
    signUpDialog: state.signUpDialog,
  };
}

class SignUpDialog extends React.PureComponent<ISignUpDialogProps, {}> {
  private afterSignInCallback = () => {
    const { dispatch } = this.props;
    dispatch!({ type: `CLOSE_${GLOBAL_DIALOGS.SIGN_UP}` });
  };

  public render() {
    const { closeFunction, signUpDialog } = this.props;

    return (
      <div>
        <Modal size="mini" open={signUpDialog.SIGN_UP_isOpen} onClose={closeFunction}>
          <Modal.Header>SIGN UP</Modal.Header>
          <Modal.Content>
            <div className="button-wrapper">
              <FacebookButton />
            </div>
            <div className="button-wrapper">
              <GoogleButton afterSignInCallback={this.afterSignInCallback} />
            </div>
            <div className="button-wrapper">
              <TwitterButton afterSignInCallback={this.afterSignInCallback} />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={closeFunction} negative>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUpDialog);

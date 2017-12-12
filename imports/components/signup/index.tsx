import * as React from "react";
import { Button, Modal, Divider } from "semantic-ui-react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { IDialogState, GLOBAL_DIALOGS } from "../../reducers/globalDialog";
import FacebookButton from "../common/facebookButton";
import GoogleButton from '../common/googleButton';

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
    dispatch!({ type: `CLOSE_${GLOBAL_DIALOGS.SIGN_UP}`})
  }

  public render() {
    const { closeFunction, signUpDialog } = this.props;

    return (
      <div>
        <Modal size="mini" open={signUpDialog.SIGN_UP_isOpen} onClose={closeFunction}>
          <Modal.Header>SIGN UP</Modal.Header>
          <Modal.Content>
            <FacebookButton />
            <Divider />
            <GoogleButton afterSignInCallback={this.afterSignInCallback} />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={closeFunction} negative>
              No
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUpDialog);

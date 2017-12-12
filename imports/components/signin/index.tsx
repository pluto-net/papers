import * as React from "react";
import {  Button, Modal } from "semantic-ui-react";
import { connect, DispatchProp } from "react-redux";
import { IAppState } from "../../reducers";
import { IDialogState, GLOBAL_DIALOGS } from '../../reducers/globalDialog';
import FacebookButton from "../common/facebookButton";
import GoogleButton from '../common/googleButton';
import TwitterButton from '../common/twitterButton';

interface ISignInDialogProps extends DispatchProp<any> {
  signInDialog: IDialogState;
  closeFunction: () => void;
}

function mapStateToProps(state: IAppState) {
  return {
    signInDialog: state.signInDialog,
  };
}

class SignInDialog extends React.PureComponent<ISignInDialogProps, {}> {
  private afterSignInCallback = () => {
    const { dispatch } = this.props;
    dispatch!({ type: `CLOSE_${GLOBAL_DIALOGS.SIGN_IN}`})
  }

  public render() {
    const { closeFunction, signInDialog } = this.props;

    return (
      <div>
        <Modal size="mini" open={signInDialog.SIGN_IN_isOpen} onClose={closeFunction}>
          <Modal.Header>SIGN IN</Modal.Header>
          <Modal.Content>
            <FacebookButton />
            <GoogleButton afterSignInCallback={this.afterSignInCallback} />
            <TwitterButton afterSignInCallback={this.afterSignInCallback} />
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

export default connect(mapStateToProps)(SignInDialog);

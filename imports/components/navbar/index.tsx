import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Meteor } from "meteor/meteor";
import SignUpDialog from "../signup";
import SignInDialog from "../signin";
import { openDialog, closeDialog } from "../../actions/globalDialog";
import { GLOBAL_DIALOGS } from "../../reducers/globalDialog";
const { withTracker } = require("meteor/react-meteor-data");

interface INavbarProps extends DispatchProp<any> {
  currentUser: any;
  isLoggingIn: boolean;
}

function mapStateToProps() {
  return {};
}

class Navbar extends React.PureComponent<INavbarProps, {}> {
  private handleCloseSignUpDialog = () => {
    const { dispatch } = this.props;

    dispatch(closeDialog(GLOBAL_DIALOGS.SIGN_UP));
  };

  private handleOpenSignUpDialog = () => {
    const { dispatch } = this.props;

    dispatch(openDialog(GLOBAL_DIALOGS.SIGN_UP));
  };

  private handleCloseSignInDialog = () => {
    const { dispatch } = this.props;

    dispatch(closeDialog(GLOBAL_DIALOGS.SIGN_IN));
  };

  private handleOpenSignInDialog = () => {
    const { dispatch } = this.props;

    dispatch(openDialog(GLOBAL_DIALOGS.SIGN_IN));
  };

  private handleLogoutClick = () => {
    const { dispatch } = this.props;

    dispatch({ type: "REQUEST_LOGOUT" });
  };

  private getUserIcon = () => {
    const { currentUser, isLoggingIn } = this.props;

    if (!currentUser || isLoggingIn) {
      return (
        <div className="navbar-right-item">
          <span onClick={this.handleOpenSignUpDialog}>Sign Up</span>
          <span onClick={this.handleOpenSignInDialog}>Sign In</span>
        </div>
      );
    } else {
      return (
        <div>
          <span>User Profile</span>
          <span onClick={this.handleLogoutClick}>Logout</span>
        </div>
      );
    }
  };

  public render() {
    return (
      <nav className="navbar-container">
        <div className="navbar-left-box">
          <span className="navbar-logo"> The Papers</span>
          <span className="navbar-left-item">Latest Review</span>
          <span className="navbar-left-item">Articles</span>
        </div>

        <div className="navbar-right-box">
          <span className="navbar-search-box" />
          <input className="navbar-search-input" />
          {this.getUserIcon()}
        </div>
        <SignUpDialog closeFunction={this.handleCloseSignUpDialog} />
        <SignInDialog closeFunction={this.handleCloseSignInDialog} />
      </nav>
    );
  }
}

const NavbarContainer = withTracker(() => {
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();

  return {
    currentUser,
    isLoggingIn,
  };
})(connect(mapStateToProps)(Navbar));

export default NavbarContainer;

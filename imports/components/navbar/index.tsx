import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import SignUpDialog from "../signup";
import SignInDialog from "../signin";
import { openDialog, closeDialog } from "../../actions/globalDialog";
import { GLOBAL_DIALOGS } from "../../reducers/globalDialog";
const { withTracker } = require("meteor/react-meteor-data");

declare var $: any;

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

  private getRightMenus = () => {
    const { currentUser, isLoggingIn } = this.props;

    if (!currentUser) {
      return (
        <span className="navbar-right-item">
          <span onClick={this.handleOpenSignUpDialog}>Sign Up</span>
          <span onClick={this.handleOpenSignInDialog}>Sign In</span>
        </span>
      );
    } else if (!currentUser && isLoggingIn) {
      return <span className="navbar-right-item">is logging in...</span>;
    } else {
      const profileImgUrl =
        currentUser.profile &&
        currentUser.profile.profileImagePublicId &&
        currentUser.profile.profileImagePublicId.length > 0
          ? $.cloudinary.url(currentUser.profile.profileImagePublicId, { width: 50, height: 50, crop: "fill" })
          : "https://cdn3.iconfinder.com/data/icons/pix-glyph-set/50/520913-cat-128.png";

      return (
        <span className="navbar-right-item">
          <img style={{ width: 50, height: 50 }} src={profileImgUrl} />
          <Link to={`/users/${currentUser._id}`}>{currentUser.username}</Link>
          <Link to="/posts/new">Create Post</Link>
          <Link to="/" onClick={this.handleLogoutClick}>
            Logout
          </Link>
        </span>
      );
    }
  };

  public render() {
    return (
      <nav className="navbar-container">
        <div className="navbar-box">
          <div className="navbar-left-box">
            <Link to="/" className="navbar-logo">
              The papers
            </Link>
            <span className="navbar-left-item">Latest Review</span>
            <span className="navbar-left-item">Articles</span>
          </div>

          <div className="navbar-right-box">
            <span className="navbar-search-box">
              <input className="navbar-search-input" />
            </span>
            {this.getRightMenus()}
          </div>
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

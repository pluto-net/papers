import * as React from "react";
import { connect, DispatchProp, Dispatch } from "react-redux";
import { push } from "react-router-redux";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Container, Input } from "semantic-ui-react";
import SignUpDialog from "../signup";
import { openDialog, closeDialog } from "../../actions/globalDialog";
import { GLOBAL_DIALOGS } from "../../reducers/globalDialog";
import { addOrChangeQueryParams } from "../../helpers/queryParams";
const { withTracker } = require("meteor/react-meteor-data");

interface INavbarProps extends RouteComponentProps<{}>, DispatchProp<any> {
  currentUser: any;
  isLoggingIn: boolean;
}

interface INavbarState {
  searchTerm: string;
}

@withRouter
class Navbar extends React.PureComponent<INavbarProps, INavbarState> {
  public state = {
    searchTerm: "",
  };

  private handleCloseSignUpDialog = () => {
    const { dispatch } = this.props;

    (dispatch as Dispatch<any>)(closeDialog(GLOBAL_DIALOGS.SIGN_UP));
  };

  private handleOpenSignUpDialog = () => {
    const { dispatch } = this.props;

    (dispatch as Dispatch<any>)(openDialog(GLOBAL_DIALOGS.SIGN_UP));
  };

  private handleLogoutClick = () => {
    const { dispatch } = this.props;

    (dispatch as Dispatch<any>)({ type: "REQUEST_LOGOUT" });
  };

  private handleChangeSearchTerm = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      searchTerm: e.currentTarget.value,
    });
  };

  private handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { searchTerm } = this.state;
    const { dispatch, location } = this.props;

    const keyword = searchTerm;
    const queryParams = addOrChangeQueryParams(location.search, { keyword, dateFilter: "all" });

    (dispatch as Dispatch<any>)(push(`/?${queryParams}`));

    this.setState({
      searchTerm: "",
    });
  };

  private getSearchInput = () => {
    return (
      <div className="search-input-wrapper">
        <form onSubmit={this.handleSubmitSearch}>
          <Input onChange={this.handleChangeSearchTerm} className="icon" icon="search" placeholder="Search ICO" />
        </form>
      </div>
    );
  };

  private getRightMenus = () => {
    const { currentUser, isLoggingIn } = this.props;

    let adminMenu = null;
    if (currentUser && currentUser.admin) {
      adminMenu = (
        <div className="right-menu-item">
          <Link to="/admin">ADMIN</Link>
        </div>
      );
    }

    if (!currentUser) {
      return (
        <div className="right-menus">
          {this.getSearchInput()}
          <span className="submit-ico-button" onClick={this.handleOpenSignUpDialog}>
            + Submit your ICO
          </span>
          <span className="sign-up-button-wrapper" onClick={this.handleOpenSignUpDialog}>
            Get Started
          </span>
        </div>
      );
    } else if (!currentUser && isLoggingIn) {
      return <div className="right-menus">is logging in...</div>;
    } else {
      return (
        <div className="right-menus">
          {this.getSearchInput()}
          <Link className="submit-ico-button" to="/posts/new">
            + Submit your ICO
          </Link>
          <Link className="right-menu-item" to="/" onClick={this.handleLogoutClick}>
            Sign out
          </Link>
          {adminMenu}
        </div>
      );
    }
  };

  public render() {
    return (
      <div className="navbar-container">
        <div className="navbar-content-wrapper">
          <Container>
            <div className="navbar-container">
              <Link className="logo-image-wrapper" to="/">
                <img className="logo-image" src="/paperating-logo.svg" />
              </Link>
              {this.getRightMenus()}
            </div>
          </Container>
        </div>
        <SignUpDialog closeFunction={this.handleCloseSignUpDialog} />
      </div>
    );
  }
}

const NavbarContainer = withTracker(() => {
  Meteor.subscribe("user", Meteor.userId());
  const currentUser = Meteor.users.findOne(Meteor.userId());
  const isLoggingIn = Meteor.loggingIn();

  return {
    currentUser,
    isLoggingIn,
  };
})(connect()(Navbar));

export default NavbarContainer;

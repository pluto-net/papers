import * as React from "react";
import { connect, DispatchProp, Dispatch } from "react-redux";
import { push } from "react-router-redux";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Menu, Button, Container, Header, Input } from "semantic-ui-react";
import SignUpDialog from "../signup";
import SignInDialog from "../signin";
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

  private handleCloseSignInDialog = () => {
    const { dispatch } = this.props;

    (dispatch as Dispatch<any>)(closeDialog(GLOBAL_DIALOGS.SIGN_IN));
  };

  private handleOpenSignInDialog = () => {
    const { dispatch } = this.props;

    (dispatch as Dispatch<any>)(openDialog(GLOBAL_DIALOGS.SIGN_IN));
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
      <Menu.Item>
        <form onSubmit={this.handleSubmitSearch}>
          <Input onChange={this.handleChangeSearchTerm} className="icon" icon="search" placeholder="Search ICO" />
        </form>
      </Menu.Item>
    );
  };

  private getRightMenus = () => {
    const { currentUser, isLoggingIn } = this.props;

    let adminMenu = null;
    if (currentUser && currentUser.admin) {
      adminMenu = (
        <Menu.Item>
          <Link to="/admin">ADMIN</Link>
        </Menu.Item>
      );
    }

    if (!currentUser) {
      return (
        <Menu.Menu position="right">
          {this.getSearchInput()}
          <Menu.Item onClick={this.handleOpenSignUpDialog}>
            <Button size="tiny" primary>
              Sign Up
            </Button>
          </Menu.Item>
          <Menu.Item onClick={this.handleOpenSignInDialog}>
            <Button size="tiny">Log-in</Button>
          </Menu.Item>
        </Menu.Menu>
      );
    } else if (!currentUser && isLoggingIn) {
      return <Menu.Menu position="right">is logging in...</Menu.Menu>;
    } else {
      return (
        <Menu.Menu position="right">
          {this.getSearchInput()}
          <Menu.Item>
            <div className="navbar-menu-item">{currentUser.username}</div>
          </Menu.Item>
          <Menu.Item>
            <Link to="/posts/new">New ICO</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/" onClick={this.handleLogoutClick}>
              Logout
            </Link>
          </Menu.Item>
          {adminMenu}
        </Menu.Menu>
      );
    }
  };

  public render() {
    return (
      <div className="navbar-container">
        <Menu borderless color="grey" size="small">
          <Container>
            <Menu.Item>
              <Link to="/">
                <Header>The Papers</Header>
              </Link>
            </Menu.Item>
            {this.getRightMenus()}
          </Container>
        </Menu>
        <SignUpDialog closeFunction={this.handleCloseSignUpDialog} />
        <SignInDialog closeFunction={this.handleCloseSignInDialog} />
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

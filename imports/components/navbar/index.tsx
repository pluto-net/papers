import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { push } from "react-router-redux";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Menu, Button, Container, Header, Input } from "semantic-ui-react";
import SignUpDialog from "../signup";
import SignInDialog from "../signin";
import { openDialog, closeDialog } from "../../actions/globalDialog";
import { GLOBAL_DIALOGS } from "../../reducers/globalDialog";
const { withTracker } = require("meteor/react-meteor-data");

declare var web3: any;

interface INavbarProps extends DispatchProp<any> {
  currentUser: any;
  isLoggingIn: boolean;
}

interface INavbarState {
  searchTerm: string;
}

class Navbar extends React.PureComponent<INavbarProps, INavbarState> {
  public state = {
    searchTerm: "",
  };

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

  private handleChangeSearchTerm = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      searchTerm: e.currentTarget.value,
    });
  };

  private handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch } = this.props;

    dispatch(push(`/posts?searchTerm=${this.state.searchTerm}`));
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

  private handleDonateClick = () => {
    const ether = prompt("how much Ether You want to donate? The unit is ether. ex) 0.1 ");

    web3.eth.getAccounts((err: Error, res: any) => {
      if (!err) {
        web3.eth.sendTransaction({
          value: web3.utils.toWei(ether, "ether"),
          from: res[0],
          to: "0xa18D01eB32f0649EffD427c3B9796caA8eCc7490",
        });
      }
    });
  };

  private getRightMenus = () => {
    const { currentUser, isLoggingIn } = this.props;

    let adminMenu = null;
    if (currentUser && currentUser.profile && currentUser.profile.admin) {
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
          <Menu.Item onClick={this.handleDonateClick}>
            <div className="navbar-menu-item">Donate</div>
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
          <Menu.Item onClick={this.handleDonateClick}>
            <div className="navbar-menu-item">Donate</div>
          </Menu.Item>
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
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();

  return {
    currentUser,
    isLoggingIn,
  };
})(connect()(Navbar));

export default NavbarContainer;

import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Meteor } from "meteor/meteor";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { push } from "react-router-redux";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import { User } from "../../../both/model/user";
const { withTracker } = require("meteor/react-meteor-data");

declare var Cloudinary: any;

interface IUserProfileEditProps extends RouteComponentProps<{ userId: string }>, DispatchProp<{}> {
  isMine: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  targetUser: any;
  currentUser: any;
}

interface IUserProfileEditState {
  username: string;
  email: string;
}

function mapStateToProps() {
  return {};
}

@withRouter
@(connect as any)(mapStateToProps)
class UserProfileEdit extends React.PureComponent<IUserProfileEditProps, IUserProfileEditState> {
  public state = {
    username: "",
    email: "",
  };

  private preventSubmit = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  private handleInputChange = (type: string, e: any) => {
    const content = e.currentTarget.value;

    switch (type) {
      case "email": {
        this.setState({
          email: content,
        });
        break;
      }

      case "username": {
        this.setState({
          username: content,
        });
        break;
      }

      default: {
      }
    }
  };

  private checkProperUser = (props: IUserProfileEditProps) => {
    const { isLoggingIn, isLoading, targetUser, isMine, dispatch } = props;
    if (!isLoading && !isLoggingIn && !isMine) {
      alert("You are not proper user!");
      dispatch(push(`/users/${targetUser}`));
    }
  };

  private setInitialValue = (targetUser: any) => {
    this.setState({
      username: targetUser.username,
      email: targetUser.emails[0].address,
    });
  };

  private handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { targetUser } = this.props;
    const { files } = e.currentTarget;

    if (files && files.length > 0) {
      Cloudinary.upload(files, (err: Error, result: any) => {
        if (err) {
          alert(err);
        } else {
          targetUser.callMethod("changeProfileImagePublicId", result.public_id);
        }
      });
    }
  };

  public componentDidMount() {
    this.checkProperUser(this.props);
    if (this.props.targetUser) {
      this.setInitialValue(this.props.targetUser);
    }
  }

  public componentWillReceiveProps(nextProps: IUserProfileEditProps) {
    this.checkProperUser(nextProps);
    if (!this.props.targetUser && nextProps.targetUser) {
      this.setInitialValue(nextProps.targetUser);
    }
  }

  public render() {
    const { targetUser } = this.props;
    const { email, username } = this.state;

    if (!targetUser) {
      return null;
    } else {
      return (
        <div>
          <form>
            <div>
              <input type="file" onChange={this.handleFileChange} />
            </div>
            <div>
              <TextField
                floatingLabelText="E-Mail"
                value={email}
                onKeyPress={this.preventSubmit}
                onChange={(e: any) => {
                  this.handleInputChange("email", e);
                }}
              />
            </div>
            <div>
              <TextField
                floatingLabelText="Username"
                value={username}
                onKeyPress={this.preventSubmit}
                onChange={(e: any) => {
                  this.handleInputChange("username", e);
                }}
              />
            </div>
            <RaisedButton type="submit" label="Submit" style={{ margin: 12 }} primary />
          </form>
        </div>
      );
    }
  }
}

const UserEditContainer = withTracker((props: IUserProfileEditProps) => {
  if (props.match.params.userId) {
    const userId = props.match.params.userId;
    const currentUser = Meteor.user();
    const isLoggingIn = Meteor.loggingIn();
    const userHandle = Meteor.subscribe("user", userId);
    const isLoading = !userHandle.ready();
    const targetUser = User.findOne(userId);
    const isMine = currentUser && currentUser._id === targetUser._id;
    console.log(targetUser);

    return {
      isMine,
      isLoading,
      targetUser,
      currentUser,
      isLoggingIn,
    };
  }
})(UserProfileEdit);

export default UserEditContainer;

import * as React from "react";
import { Meteor } from "meteor/meteor";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
const { withTracker } = require("meteor/react-meteor-data");

interface IUserProfileProps extends RouteComponentProps<{ userId: string }> {
  isMine: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  targetUser: any;
  currentUser: any;
}

interface IUserProfileState {}

@withRouter
class UserProfile extends React.PureComponent<IUserProfileProps, IUserProfileState> {
  private getEditButton = () => {
    const { isMine, currentUser } = this.props;
    if (isMine) {
      return <Link to={`/users/${currentUser._id}/edit`}>EDIT</Link>;
    } else {
      return null;
    }
  };

  public render() {
    const { targetUser } = this.props;

    if (!targetUser) {
      return null;
    } else {
      return (
        <div>
          {this.getEditButton()}
          <div className="user-profile-name">{targetUser.username}</div>
          <div className="user-profile-email">{targetUser.emails[0].address}</div>
        </div>
      );
    }
  }
}

const UserContainer = withTracker((props: IUserProfileProps) => {
  if (props.match.params.userId) {
    const userId = props.match.params.userId;
    const currentUser = Meteor.user();
    const isLoggingIn = Meteor.loggingIn();
    const userHandle = Meteor.subscribe("user", userId);
    const isLoading = !userHandle.ready();
    const targetUser = Meteor.users.findOne(userId);
    const isMine = currentUser && currentUser._id === targetUser._id;

    return {
      isMine,
      isLoading,
      targetUser,
      currentUser,
      isLoggingIn,
    };
  }
})(UserProfile);

export default UserContainer;

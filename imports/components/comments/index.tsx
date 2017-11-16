import * as React from "react";
import { Feed } from "semantic-ui-react";
import * as moment from "moment";
const { withTracker } = require("meteor/react-meteor-data");

interface ICommentListProps {
  comments: any[];
  post: any;
  users: any[];
  usersIsLoading: boolean;
}

class CommentList extends React.PureComponent<ICommentListProps, any> {
  private mapComments() {
    if (!this.props.comments || !this.props.users) {
      return null;
    } else {
      return this.props.comments.map(comment => {
        const user = this.props.users.find(user => user._id === comment.userId);
        if (!user) {
          return null;
        }
        return (
          <Feed key={`commentList_${comment._id}`}>
            <Feed.Event>
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>{user.username}</Feed.User>
                  <Feed.Date>{moment(comment.publishedAt).fromNow()}</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>{comment.content}</Feed.Extra>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        );
      });
    }
  }

  public render() {
    return <div>{this.mapComments()}</div>;
  }
}

const CommentListContainer = withTracker((props: ICommentListProps) => {
  const { comments } = props;
  const userIds = comments.map(comment => comment.userId);
  const userHandle = Meteor.subscribe("users", userIds);
  const users = Meteor.users.find().fetch();
  const usersIsLoading = !userHandle.ready();

  return {
    users,
    usersIsLoading,
  };
})(CommentList);

export default CommentListContainer;

import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Container , Header} from "semantic-ui-react";
import { Meteor } from "meteor/meteor";
import { Post } from "../../../../both/model/post";
import PostList from "../../posts/components/postList";
const { withTracker } = require("meteor/react-meteor-data");

interface IAdminConfirmFeedProps extends RouteComponentProps<{}>, DispatchProp<any> {
  isLoading: boolean;
  posts: any[];
  currentUser: any;
  isLoggingIn: boolean;
}

@withRouter
class AdminConfirmFeed extends React.PureComponent<IAdminConfirmFeedProps, {}> {
  public render() {
    const { posts, isLoading , currentUser} = this.props;

    if (isLoading) {
      return <div>Loading posts ...</div>;
    } else if (posts && posts.length === 0) {
      return (
        <Container>
          <Header size="huge">
            There is no new ICO post to be confirmed
          </Header>
        </Container>
      )
    } else {
      return (
        <div>
          <Container>
            <PostList posts={posts} currentUser={currentUser} />
          </Container>
        </div>
      );
    }
  }
}

const AdminConfirmFeedContainer = withTracker(() => {
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // TODO: handle below count with infinite scroll
  const  postsHandle = Meteor.subscribe("unpublishedPosts");
  const isLoading = !postsHandle.ready();
  const posts = Post.find({}, { sort: { publishedAt: -1 } }).fetch();

  return {
    isLoading,
    posts,
    currentUser,
    isLoggingIn,
  };
})(connect()(AdminConfirmFeed));

export default AdminConfirmFeedContainer;

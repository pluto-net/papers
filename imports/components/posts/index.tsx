import * as React from "react";
import { Meteor } from "meteor/meteor";
import { Post } from "../../../both/model/post";
import PostList from "./components/postList";
const { withTracker } = require("meteor/react-meteor-data");

interface IFeedProps {
  isLoading: boolean;
  posts: any;
  currentUser: any;
  isLoggingIn: boolean;
}

interface IFeedState {}

class Feed extends React.PureComponent<IFeedProps, IFeedState> {
  public render() {
    const { posts, isLoading } = this.props;

    if (isLoading) {
      return <div>Loading posts ...</div>;
    } else {
      return (
        <div>
          <PostList posts={posts} />
        </div>
      );
    }
  }
}

const FeedContainer = withTracker(() => {
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // TODO: handle below count with infinite scroll
  const postsHandle = Meteor.subscribe("posts", 50);
  const isLoading = !postsHandle.ready();
  const posts = Post.find({}, { sort: { publishedAt: -1 } }).fetch();

  return {
    isLoading,
    posts,
    currentUser,
    isLoggingIn,
  };
})(Feed);

export default FeedContainer;

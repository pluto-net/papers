import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Post } from "../../../both/model/post";
const { withTracker } = require("meteor/react-meteor-data");

interface IPostShowProps extends RouteComponentProps<{ postId: string }> {
  isLoading: boolean;
  post: any;
  currentUser: any;
  isLoggingIn: boolean;
}

interface IPostShowState {}

@withRouter
class PostShow extends React.PureComponent<IPostShowProps, IPostShowState> {
  public render() {
    const { post, isLoading } = this.props;

    if (isLoading) {
      return <div>Loading posts ...</div>;
    } else {
      console.log(post);
      return <div>{post.title}</div>;
    }
  }
}

const PostShowContainer = withTracker((props: IPostShowProps) => {
  if (props.match.params.postId) {
    const postId = props.match.params.postId;
    const currentUser = Meteor.user();
    const isLoggingIn = Meteor.loggingIn();
    // TODO: handle below count with infinite scroll
    const postsHandle = Meteor.subscribe("post", postId);
    const isLoading = !postsHandle.ready();
    const post = Post.findOne();

    return {
      isLoading,
      post,
      currentUser,
      isLoggingIn,
    };
  }
})(PostShow);

export default PostShowContainer;

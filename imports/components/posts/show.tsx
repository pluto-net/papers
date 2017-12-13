import * as React from "react";
import { connect, DispatchProp, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
const { withTracker } = require("meteor/react-meteor-data");
import { Container } from "semantic-ui-react";
import { Post, IPost } from "../../../both/model/post";
import { IUser } from "../../../both/model/user";
import PostContent from "./components/postContent";
import { openDialog } from "../../actions/globalDialog";
import { GLOBAL_DIALOGS } from "../../reducers/globalDialog";

interface IPostShowProps extends RouteComponentProps<IPostShowParams>, DispatchProp<any> {
  post: IPost | undefined;
  postIsloading: boolean;
  currentUser: IUser | undefined;
  isLoggingIn: boolean;
}

interface IPostShowParams {
  postId: string;
}

@withRouter
class PostShow extends React.PureComponent<IPostShowProps, {}> {
  private handleOpenSignUpDialog = () => {
    const { dispatch } = this.props;

    (dispatch as Dispatch<any>)(openDialog(GLOBAL_DIALOGS.SIGN_UP));
  };

  public render() {
    const { post, currentUser } = this.props;

    if (post) {
      return (
        <div className="post-show-component-wrapper">
          <Container>
            <PostContent post={post} currentUser={currentUser} handleOpenSignUpDialog={this.handleOpenSignUpDialog} />
          </Container>
        </div>
      );
    } else {
      return null;
    }
  }
}

interface IPostShowContainerProps extends RouteComponentProps<IPostShowParams> {}

const PostShowContainer = withTracker((props: IPostShowContainerProps) => {
  const postId = props.match.params.postId;
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // posts subscribe
  const PostHandle = Meteor.subscribe("post", postId);
  const postIsLoading = !PostHandle.ready();
  const post = Post.findOne(postId);

  return {
    // Concern with Meteor subscribe
    post,
    postIsLoading,
    currentUser,
    isLoggingIn,
  };
})(connect()(PostShow));

export default PostShowContainer;

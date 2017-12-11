import * as React from "react";
import { connect, DispatchProp, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Post, IPost } from "../../../both/model/post";
import { Modal, Icon } from "semantic-ui-react";
import { IUser } from "../../../both/model/user";
import PostContent from "./components/postContent";
import { openDialog } from "../../actions/globalDialog";
import { GLOBAL_DIALOGS } from "../../reducers/globalDialog";
import { goBack } from "react-router-redux";
const { withTracker } = require("meteor/react-meteor-data");

interface IPostModalProps extends RouteComponentProps<IPostShowParams>, DispatchProp<any> {
  post: IPost | undefined;
  currentUser: IUser | undefined;
  isLoggingIn: boolean;
}

interface IPostShowParams {
  postId: string;
}

@withRouter
class PostModal extends React.PureComponent<IPostModalProps, {}> {
  private handleOpenSignUpDialog = () => {
    const { dispatch } = this.props;

    (dispatch as Dispatch<any>)(openDialog(GLOBAL_DIALOGS.SIGN_UP));
  };

  private handleCloseModal = () => {
    const { dispatch } = this.props;

    dispatch!(goBack());
  };

  public render() {
    const { post, currentUser } = this.props;

    if (post) {
      return (
        <Modal
          closeIcon={<Icon inverted style={{ cursor: "pointer", right: "-90px", position: "absolute", zIndex: 1001 }} size="huge" name="remove" />}
          className="post-modal-wrapper"
          size="large"
          onClose={this.handleCloseModal}
          open
        >
          <PostContent post={post} currentUser={currentUser} handleOpenSignUpDialog={this.handleOpenSignUpDialog} />
        </Modal>
      );
    } else {
      return null;
    }
  }
}

interface IPostModalContainerProps extends RouteComponentProps<IPostShowParams> {}

const PostModalContainer = withTracker((props: IPostModalContainerProps) => {
  // No need to subscribe anything because HomeComponent will do posts subscribe for this component.
  const postId = props.match.params.postId;
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  const post = Post.findOne(postId);

  return {
    // Concern with Meteor subscribe
    post,
    currentUser,
    isLoggingIn,
  };
})(connect()(PostModal));

export default PostModalContainer;

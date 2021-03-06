import * as React from "react";
import { Form, Button, Loader } from "semantic-ui-react";
import { Comment } from "../../../both/model/comment";
import { IUser } from "../../../both/model/user";

interface ICommentInputProps {
  currentUser: IUser | null;
  postId: string;
  handleOpenSignUpDialog: () => void;
}

interface ICommentInputState {
  isLoading: boolean;
  comment: string;
}

class CommentInput extends React.PureComponent<ICommentInputProps, ICommentInputState> {
  public state = {
    isLoading: false,
    comment: "",
  };

  private handleSubmit = (e?: any) => {
    if (e) {
      e.preventDefault();
    }
    const { currentUser, postId } = this.props;
    const { isLoading, comment } = this.state;

    if (!currentUser) {
      return this.authCheck();
    }

    if (!isLoading && currentUser) {
      this.setState({
        isLoading: true,
      });

      const newComment = new Comment();
      newComment.callMethod(
        "postComment",
        {
          content: comment,
          postId,
        },
        (err: Error) => {
          if (err) {
            alert(err);
          } else {
            this.setState({
              isLoading: false,
              comment: "",
            });
          }
        },
      );
    }
  };

  private handleInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const content = e.currentTarget.value;

    this.setState({
      comment: content,
    });
  };

  private handleKeypress = (e: React.KeyboardEvent<any>) => {
    if (e.charCode === 13 && !e.shiftKey) {
      this.handleSubmit();
      this.setState({
        comment: "",
      });
    }
  };

  private getButtonContent = () => {
    const { isLoading } = this.state;
    if (isLoading) {
      return <Loader active />;
    } else {
      return <span>Submit</span>;
    }
  };

  private authCheck = () => {
    const { handleOpenSignUpDialog, currentUser } = this.props;

    if (!currentUser) {
      return handleOpenSignUpDialog();
    }
  };

  public render() {
    const { comment } = this.state;

    return (
      <div className="comment-input-wrapper clearfix">
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Form.TextArea
              onFocus={this.authCheck}
              placeholder="Share your insight about this Publica ICO project 👋"
              value={comment}
              onKeyPress={this.handleKeypress}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Button size="tiny" floated="right" type="submit">
            {this.getButtonContent()}
          </Button>
        </Form>
      </div>
    );
  }
}

export default CommentInput;

import * as React from "react";
import { Header, Form, Button, Dimmer, Loader } from "semantic-ui-react";
import { Comment } from "../../../both/model/comment";

interface ICommentInputProps {
  currentUser: any;
  postId: string;
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

  private handleSubmit = (e: React.FormEvent<HTMLFontElement>) => {
    e.preventDefault();
    const { currentUser, postId } = this.props;
    const { isLoading, comment } = this.state;

    if (!isLoading && currentUser) {
      this.setState({
        isLoading: true,
      });

      const newComment = new Comment();
      newComment.callMethod(
        "postComment",
        {
          content: comment,
          userId: currentUser._id,
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

  private getButtonContent = () => {
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    } else {
      return <span>Submit</span>;
    }
  };

  public render() {
    const { comment } = this.state;

    return (
      <div>
        <Header size="tiny">Leave real-time feedback</Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Form.TextArea placeholder="Please leave user message" value={comment} onChange={this.handleInputChange} />
          </Form.Field>
          <Button size="tiny" floated="right" type="submit" primary>
            {this.getButtonContent()}
          </Button>
        </Form>
      </div>
    );
  }
}

export default CommentInput;

import * as React from "react";
import { Header, Form, Button } from "semantic-ui-react";

interface ICommentInputState {
  comment: string;
}

class CommentInput extends React.PureComponent<{}, ICommentInputState> {
  public state = {
    comment: "",
  };

  private handleSubmit = (e: React.FormEvent<HTMLFontElement>) => {
    e.preventDefault();
    const { comment } = this.state;

    console.log(comment);
  };

  private handleInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const content = e.currentTarget.value;

    this.setState({
      comment: content,
    });
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
          <Button size="tiny" floated="right" type="submit" content="Submit" primary />
        </Form>
      </div>
    );
  }
}

export default CommentInput;

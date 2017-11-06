import * as React from "react";
import { Meteor } from "meteor/meteor";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import { Post } from "../../../both/model/post";
import { IPostParamsInterface } from "../../../server/methods/post";
const { withTracker } = require("meteor/react-meteor-data");

interface ICreatePostParams {
  currentUser: any;
  isLoggingIn: boolean;
}

interface ICreatePostState {
  title: string;
  content: string;
}

class CreatePost extends React.PureComponent<ICreatePostParams, ICreatePostState> {
  public state = {
    title: "",
    content: "",
  };

  private preventSubmit = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  private handleInputChange = (type: string, e: any) => {
    const content = e.currentTarget.value;

    switch (type) {
      case "title": {
        this.setState({
          title: content,
        });
        break;
      }

      case "content": {
        this.setState({
          content,
        });
        break;
      }

      default: {
      }
    }
  };

  private handleSubmitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { currentUser } = this.props;
    const { title, content } = this.state;

    if (!currentUser) {
      // TODO: Open Sign up dialog
      return;
    }

    const post = new Post();
    const postParams: IPostParamsInterface = {
      title,
      content,
      userId: currentUser._id,
    };

    post.callMethod("savePost", postParams, (err: Error, postId: string) => {
      if (err) {
        alert(err);
      } else {
        // TODO: Make user go to target post page
        console.log(postId);
        this.setState({
          title: "",
          content: "",
        });
      }
    });
  };

  public render() {
    const { title, content } = this.state;

    return (
      <form onSubmit={this.handleSubmitPost}>
        <div>
          <TextField
            floatingLabelText="Title"
            value={title}
            onKeyPress={this.preventSubmit}
            onChange={(e: any) => {
              this.handleInputChange("title", e);
            }}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="Content"
            value={content}
            onChange={(e: any) => {
              this.handleInputChange("content", e);
            }}
            multiLine
          />
        </div>
        <RaisedButton type="submit" label="Submit" style={{ margin: 12 }} primary />
      </form>
    );
  }
}

const CreatePostContainer = withTracker(() => {
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();

  return {
    currentUser,
    isLoggingIn,
  };
})(CreatePost);

export default CreatePostContainer;

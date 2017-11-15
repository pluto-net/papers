import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { push } from "react-router-redux";
import { Meteor } from "meteor/meteor";
import { Post } from "../../../both/model/post";
import { IPostParamsInterface } from "../../../server/methods/post";
const { withTracker } = require("meteor/react-meteor-data");

interface ICreatePostParams extends DispatchProp<any> {
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
    const { currentUser, dispatch } = this.props;
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
        this.setState({
          title: "",
          content: "",
        });
        dispatch(push(`/posts/${postId}`));
      }
    });
  };

  public render() {
    const { title, content } = this.state;

    return (
      <form onSubmit={this.handleSubmitPost}>
        <div>
          <input
            placeholder="Title"
            value={title}
            onKeyPress={this.preventSubmit}
            onChange={(e: any) => {
              this.handleInputChange("title", e);
            }}
          />
        </div>
        <div>
          <input
            placeholder="Content"
            value={content}
            onChange={(e: any) => {
              this.handleInputChange("content", e);
            }}
          />
        </div>
        <button type="submit" style={{ margin: 12 }}>
          Submit
        </button>
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
})(connect()(CreatePost));

export default CreatePostContainer;

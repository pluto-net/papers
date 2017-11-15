import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Post } from "../../../both/model/post";
import { Table, Icon, Loader, Container } from "semantic-ui-react";
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
      return (
        <div>
          <Loader active />
        </div>
      );
    } else {
      return (
        <div>
          <Container>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="3">{post.title}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell collapsing>
                    <Icon name="folder" /> node_modules
                  </Table.Cell>
                  <Table.Cell>Initial commit</Table.Cell>
                  <Table.Cell collapsing textAlign="right">
                    10 hours ago
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Icon name="folder" /> test
                  </Table.Cell>
                  <Table.Cell>Initial commit</Table.Cell>
                  <Table.Cell textAlign="right">10 hours ago</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Icon name="folder" /> build
                  </Table.Cell>
                  <Table.Cell>Initial commit</Table.Cell>
                  <Table.Cell textAlign="right">10 hours ago</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Icon name="file outline" /> package.json
                  </Table.Cell>
                  <Table.Cell>Initial commit</Table.Cell>
                  <Table.Cell textAlign="right">10 hours ago</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Icon name="file outline" /> Gruntfile.js
                  </Table.Cell>
                  <Table.Cell>Initial commit</Table.Cell>
                  <Table.Cell textAlign="right">10 hours ago</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Container>
        </div>
      );
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

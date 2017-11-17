import * as React from "react";
import { Feed } from "semantic-ui-react";
import * as moment from "moment";
import throttle = require("lodash.throttle");
import InfiniteScroll = require("react-infinite-scroller");
import { Comment, IComment } from "../../../both/model/comment";
const { withTracker } = require("meteor/react-meteor-data");

interface ICommentListProps {
  // From parent components
  post: any;
  commentCount: number;
  loadMoreFunction: () => void;
  // From Meteor
  comments: IComment[];
  users: any[];
  usersIsLoading: boolean;
  commentsIsLoading: boolean;
}

interface ICommentListState {
  hasMore: boolean;
}

class CommentList extends React.PureComponent<ICommentListProps, ICommentListState> {
  public state = {
    hasMore: true,
  };

  private commentListNode: HTMLDivElement;

  private handleLoadMore = throttle(this.props.loadMoreFunction, 2000);

  private mapComments() {
    if (!this.props.comments || !this.props.users) {
      return null;
    } else {
      return this.props.comments.map(comment => {
        const user = this.props.users.find(user => user._id === comment.userId);
        if (!user) {
          return null;
        }
        return (
          <Feed key={`commentList_${comment._id}`}>
            <Feed.Event>
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>{user.username}</Feed.User>
                  <Feed.Date>{moment(comment.publishedAt).fromNow()}</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>{comment.content}</Feed.Extra>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        );
      });
    }
  }

  public componentDidUpdate(prevProps: ICommentListProps) {
    if (this.commentListNode && prevProps.comments.length !== this.props.comments.length) {
      this.commentListNode.scrollTop = this.commentListNode.offsetHeight;
    }

    if (this.commentListNode && prevProps.commentCount > this.props.comments.length + 15) {
      this.setState({
        hasMore: false,
      });
    }
  }

  public render() {
    if (!this.props.comments || this.props.comments.length === 0) {
      return <div>There isn't any comment yet.</div>;
    }
    return (
      <div>
        <div ref={el => (this.commentListNode = el)} className="comments-list-wrapper">
          <InfiniteScroll
            pageStart={0}
            loadMore={this.handleLoadMore}
            hasMore={this.state.hasMore}
            threshold={10}
            loader={<div>loading...</div>}
            useWindow={false}
            initialLoad={false}
            isReverse
          >
            {this.mapComments()}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

const CommentListContainer = withTracker((props: ICommentListProps) => {
  const postId = props.post._id;

  const commentsHandle = Meteor.subscribe("comments", props.post._id, props.commentCount);
  const comments: IComment[] = Comment.find({ postId }, { sort: { publishedAt: 1 } }).fetch();
  const commentsIsLoading = !commentsHandle.ready();

  const userIds = comments.map(comment => comment.userId);
  const userHandle = Meteor.subscribe("users", userIds);
  const users = Meteor.users.find().fetch();
  const usersIsLoading = !userHandle.ready();

  return {
    users,
    usersIsLoading,
    comments,
    commentsIsLoading,
  };
})(CommentList);

export default CommentListContainer;

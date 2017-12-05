import * as React from "react";
import { Rating } from "semantic-ui-react";
import { IPost } from "../../../../both/model/post";
import { Rating as RatingModel } from "../../../../both/model/rating";
import * as moment from "moment";
import { Comment, IComment } from "../../../../both/model/comment";
import { IUser, User } from "../../../../both/model/user";
import { IRating } from "../../../../both/model/rating";
const { withTracker } = require("meteor/react-meteor-data");

interface IPostContentProps {
  post: IPost;
  commentsIsLoading: boolean;
  comments: IComment[];
  users: IUser[];
  usersIsLoading: boolean;
  ratingIsLoading: boolean;
  ratings: IRating[];
}

interface IPostContentStates {
  isCommentsOpen: boolean;
}

class PostContent extends React.Component<IPostContentProps, IPostContentStates> {
  public state: IPostContentStates = {
    isCommentsOpen: false,
  };

  private getFields = (fields: string[]) => {
    if (fields && fields.length > 0) {
      return fields.join(" · ");
    } else {
      return null;
    }
  };

  private getRatingShow = () => {
    const { post } = this.props;
    const rating = Math.round(post.averageRating);

    return (
      <div>
        <Rating icon="star" maxRating={5} rating={rating} />
        <span>{`${post.ratingCount} participants`}</span>
      </div>
    );
  };

  private getICODateStatus = () => {
    const { post } = this.props;

    const date = new Date();

    if (date < post.startICODate) {
      return <span style={{ color: "red" }}>(END)</span>;
    } else if (post.startICODate <= date && date <= post.endICODate) {
      return <span style={{ color: "#48d2a0" }}>(Ongoing)</span>;
    } else if (post.endICODate > date) {
      return <span style={{ color: "blue" }}>(Coming soon)</span>;
    } else {
      return null;
    }
  };

  private getICOPeriod = () => {
    const { post } = this.props;

    if (post.startICODate && post.endICODate) {
      const startDate = moment(post.startICODate).format("MM.DD.YYYY");
      const endDate = moment(post.endICODate).format("MM.DD.YYYY");

      return (
        <div className="ico-period-wrapper">
          {`ICO Period | ${startDate} - ${endDate}`}
          {this.getICODateStatus()}
        </div>
      );
    } else {
      return <div className="ico-period-wrapper">Unknown ICO Period</div>;
    }
  };

  private getRatingInformation = (targetUserId: string) => {
    const { ratings } = this.props;

    if (ratings && ratings.length > 0) {
      const rating = ratings.find(rating => rating.userId === targetUserId);

      return (
        <span className="rating-information">
          <Rating icon="star" maxRating={5} rating={rating.rating} />
          {` ${rating.rating}`}
        </span>
      );
    } else {
      return null;
    }
  };

  private getCommentItem = (comment: IComment) => {
    const { users } = this.props;

    if (users && users.length > 0) {
      const targetUser = users.find(user => user._id === comment.userId);

      return (
        <div key={`post_content_comment_item_${comment._id}`} className="post-content-comment-item-wrapper">
          <div className="meta-information-box">
            <span className="username">{targetUser.username}</span>
            <span className="from-now">{moment(comment.publishedAt).fromNow()}</span>
            {this.getRatingInformation(targetUser._id)}
          </div>
          {comment.content}
        </div>
      );
    } else {
      return null;
    }
  };

  private handleClickLoadMoreComments = () => {
    this.setState({
      isCommentsOpen: true,
    });
  };

  private getComments = () => {
    const { isCommentsOpen } = this.state;
    const { comments, commentsIsLoading, usersIsLoading } = this.props;

    if (!usersIsLoading && !commentsIsLoading && comments && comments.length > 0) {
      const targetComments = isCommentsOpen ? comments : comments.slice(0, 3);
      const loadMoreNode = isCommentsOpen ? null : (
        <div onClick={this.handleClickLoadMoreComments} className="load-more-comments">
          Load more comments
        </div>
      );

      const commentItems = targetComments.map(comment => {
        return this.getCommentItem(comment);
      });

      return (
        <div>
          {commentItems}
          {loadMoreNode}
        </div>
      );
    } else {
      return null;
    }
  };

  public render() {
    const { post } = this.props;

    return (
      <div className="ico-post-content-wrapper">
        <div className="header">
          <h1 className="header-title">{post.title}</h1>
          <div className="header-fields">{this.getFields(post.fields)}</div>
          <div className="header-right-box">{this.getRatingShow()}</div>
        </div>

        <div className="content-wrapper">
          {this.getICOPeriod()}
          <div className="content-description">{post.content}</div>
          {this.getComments()}
        </div>
      </div>
    );
  }
}

const PostContentContainer = withTracker((props: IPostContentProps) => {
  // comments subscribe
  const CommentsHandle = Meteor.subscribe("comments", props.post._id);
  const commentsIsLoading = !CommentsHandle.ready();
  const comments: IComment[] = Comment.find({}, { publishedAt: -1 }).fetch();

  // users subscribe
  const userIds = comments.map(comment => comment.userId);
  const UsersHandle = Meteor.subscribe("users", userIds);
  const usersIsLoading = !UsersHandle.ready();
  const users: IUser[] = User.find({ _id: { $in: userIds } }).fetch();

  // rating subscribe
  const RatingHandle = Meteor.subscribe("ratingsFromPostIdAndUserIds", props.post._id, userIds);
  const ratingIsLoading = !RatingHandle.ready();
  const ratings: IRating[] = RatingModel.find({ postId: props.post._id, userId: { $in: userIds } }).fetch();

  return {
    commentsIsLoading,
    comments,
    users,
    usersIsLoading,
    ratingIsLoading,
    ratings,
  };
})(PostContent);

export default PostContentContainer;

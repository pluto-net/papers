import * as React from "react";
import { Rating, Icon } from "semantic-ui-react";
import { IPost } from "../../../../both/model/post";
import NewRating from "../../rating/new";
import { Rating as RatingModel } from "../../../../both/model/rating";
import * as moment from "moment";
import { Comment, IComment } from "../../../../both/model/comment";
import { IUser, User } from "../../../../both/model/user";
import { IRating } from "../../../../both/model/rating";
import CommentInput from "../../commentInput/index";
const { withTracker } = require("meteor/react-meteor-data");

interface IPostContentProps {
  // From parent component
  post: IPost;
  currentUser: IUser | null;
  handleOpenSignUpDialog: () => void;
  // From Meteor
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

class PostContent extends React.PureComponent<IPostContentProps, IPostContentStates> {
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
    const averageRating = post.averageRating.toFixed(1);
    const rating = Math.round(post.averageRating);

    return (
      <div>
        <div className="rating-wrapper">
          <Rating icon="star" maxRating={5} rating={rating} />
          <span className="average-rating-value">{averageRating}</span>
        </div>
        <div className="average-rating-count">{`${post.ratingCount} participants`}</div>
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
          {`ICO Period | `}
          <span className="ico-period-date-range">{`${startDate} - ${endDate}`}</span>
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
      const rating: IRating | undefined = ratings.find(rating => rating.userId === targetUserId);

      if (rating) {
        return (
          <span className="rating-information">
            <Rating icon="star" maxRating={5} rating={rating.rating} />
            {` ${rating.rating}`}
          </span>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  private getCommentItem = (comment: IComment) => {
    const { users } = this.props;

    if (users && users.length > 0) {
      const targetUser = users.find(user => user._id === comment.userId);
      if (targetUser) {
        return (
          <div key={`post_content_comment_item_${comment._id}`} className="post-content-comment-item-wrapper">
            <div className="meta-information-box">
              <span className="username">{targetUser.username}</span>
              <span className="from-now">{moment(comment.publishedAt).fromNow()}</span>
              {this.getRatingInformation(targetUser._id)}
            </div>
            <div className="content-wrapper">{comment.content}</div>
          </div>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  private handleClickLoadMoreComments = () => {
    this.setState({
      isCommentsOpen: true,
    });
  };

  private getCommentsInformation = () => {
    const { post } = this.props;

    return (
      <div className="comments-information-wrapper">
        <div className="comment-count">
          {`Comments `}
          <span className="comment-count-number">{post.commentCount}</span>
        </div>
      </div>
    );
  };

  private getComments = () => {
    const { isCommentsOpen } = this.state;
    const { comments } = this.props;

    if (comments && comments.length > 0) {
      const targetComments = isCommentsOpen ? comments : comments.slice(0, 3);
      const loadMoreNode =
        isCommentsOpen || comments.length < 3 ? null : (
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
    }
  };

  private handleRatingClick = (rating: number) => {
    const { currentUser, post } = this.props;
    if (currentUser && post) {
      const ratingObj = new RatingModel();
      return new Promise((resolve, reject) => {
        const params = {
          rating,
          userId: currentUser._id,
          postId: post._id,
        };
        ratingObj.callMethod("postRating", params, (err: Error) => {
          if (err) {
            reject();
            alert(err);
          } else {
            resolve();
          }
        });
      });
    }
  };

  private getRatingInputBox() {
    const { currentUser, ratings } = this.props;

    let myRating;
    if (currentUser) {
      const rating = ratings.find(rating => rating.userId === currentUser._id);
      if (rating) {
        myRating = rating;
      }
    }

    return (
      <div className="rating-input-box-wrapper">
        <div className="rating-input-box-title">What is your score on this ICO?</div>
        <NewRating
          handleOpenSignUpDialog={this.props.handleOpenSignUpDialog}
          currentUser={currentUser}
          myRating={myRating}
          handleRating={this.handleRatingClick}
        />
      </div>
    );
  }

  private getPrimaryLinkButtons = () => {
    const { post } = this.props;

    return (
      <div className="primary-link-buttons-wrapper">
        <a target="_blank" href={post.whitePaperUrl} className="primary-link-button">
          White paper
        </a>
        <a target="_blank" href={post.homepageUrl} className="primary-link-button">
          Website
        </a>
      </div>
    );
  };

  private getSocialLinks = () => {
    const { post } = this.props;

    let socialLinks = null;
    if (post.links) {
      socialLinks = post.links.map(link => {
        if (link.includes("facebook")) {
          return (
            <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="facebook f" />
          );
        } else if (link.includes("twitter")) {
          return <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="twitter" />;
        } else if (link.includes("reddit")) {
          return <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="reddit" />;
        } else if (link.includes("github")) {
          return <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="github" />;
        } else if (link.includes("medium")) {
          return <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="medium" />;
        } else if (link.includes("slack")) {
          return <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="slack" />;
        } else if (link.includes("t.me")) {
          return <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="telegram" />;
        } else if (link.includes("linkedin")) {
          return <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="linkedin" />;
        } else if (link.includes("bitcointalk")) {
          return <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="bitcoin" />;
        } else {
          return <Icon as="a" size="mini" key={`social_link_${link}`} href={link} target="_blank" circular name="linkify" />;
        }
      });
    }

    return (
      <div className="socials-wrapper">
        <div className="social-title">Socials</div>
        {socialLinks}
      </div>
    );
  };

  public render() {
    const { post, currentUser, handleOpenSignUpDialog } = this.props;

    return (
      <div className="ico-post-content-wrapper">
        <div className="left-box">
          <div className="header">
            <div className="header-left-box">
              <span className="logo-image-wrapper">
                <img src={post.logoUrl} alt={post.title} className="logo-image" />
              </span>
              <span className="header-left-box-information">
                <h1 className="header-title">{post.title}</h1>
                <div className="header-fields">{this.getFields(post.fields ? post.fields : [])}</div>
              </span>
            </div>
            <div className="header-right-box">{this.getRatingShow()}</div>
          </div>

          <div className="header-divider" />

          <div className="content-wrapper">
            {this.getICOPeriod()}
            <div className="content-description">{post.content}</div>
            {this.getCommentsInformation()}
            <div className="comment-input-wrapper">
              <CommentInput
                currentUser={currentUser}
                postId={post._id}
                handleOpenSignUpDialog={handleOpenSignUpDialog}
              />
            </div>
            {this.getComments()}
          </div>
        </div>
        <div className="right-box">
          {this.getRatingInputBox()}
          {this.getPrimaryLinkButtons()}
          {this.getSocialLinks()}
        </div>
      </div>
    );
  }
}

const PostContentContainer = withTracker((props: IPostContentProps) => {
  // comments subscribe
  const CommentsHandle = Meteor.subscribe("comments", props.post._id);
  const commentsIsLoading = !CommentsHandle.ready();
  const comments: IComment[] = Comment.find({ postId: props.post._id }, { sort: { publishedAt: -1 } }).fetch();

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

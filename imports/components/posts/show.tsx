import { Meteor } from "meteor/meteor";
import * as React from "react";
import * as moment from "moment";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, Loader, Container, Header, Rating, Grid } from "semantic-ui-react";
import { connect, DispatchProp } from "react-redux";
const { withTracker } = require("meteor/react-meteor-data");
import { Post } from "../../../both/model/post";
import { Rating as RatingModel } from "../../../both/model/rating";
import NewRating from "../rating/new";
import CommentInput from "../commentInput";
import CommentList from "../comments";
import { openDialog } from "../../actions/globalDialog";
import { GLOBAL_DIALOGS } from "../../reducers/globalDialog";

interface IPostShowProps extends RouteComponentProps<{ postId: string }>, DispatchProp<{}> {
  isLoading: boolean;
  post: any;
  currentUser: any;
  isLoggingIn: boolean;
  myRating: any | undefined;
  ratingIsLoading: boolean;
}

interface IPostShowState {
  commentCount: number;
}

const COMMENTS_COUNT_PER_LOAD = 15;

@withRouter
class PostShow extends React.PureComponent<IPostShowProps, IPostShowState> {
  public state = {
    commentCount: COMMENTS_COUNT_PER_LOAD,
  };

  private loadMoreComments = () => {
    this.setState({
      commentCount: this.state.commentCount + COMMENTS_COUNT_PER_LOAD,
    });
  };

  private handleOpenSignUpDialog = () => {
    const { dispatch } = this.props;

    dispatch(openDialog(GLOBAL_DIALOGS.SIGN_UP));
  };

  private getHeader = () => {
    const { post } = this.props;
    const startDateFromNow = moment(post.startICODate).fromNow();
    const rating = Math.round(post.averageRating);
    const logo = post.logoUrl ? <img className="logo-image" src={post.logoUrl} /> : null;

    if (post.startICODate) {
      return (
        <div>
          <Header size="huge">
            {logo}
            {post.title}
            <span className="subtitle">{` from start time of the ICO, `}</span>
            <span className="subtitle2">{startDateFromNow}</span>
          </Header>
          <Rating icon="star" maxRating={5} rating={rating} />
          <div>{`Rating count ${post.ratingCount}`}</div>
        </div>
      );
    } else {
      return (
        <div>
          <Header size="huge">
            {logo}
            {post.title}
          </Header>
          <Rating icon="star" maxRating={5} rating={rating} />
          <div>{`Rating count - ${post.ratingCount}`}</div>
        </div>
      );
    }
  };

  private mapMultiItem = (items: string[], type: string) => {
    const { post } = this.props;

    if (!items || !post) {
      return null;
    }

    return items.map((item, index) => {
      return (
        <span className="post-show-item-item" key={`${post._id}_${type}_${index}`}>
          {item}
        </span>
      );
    });
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

  private getNewRating = () => {
    const { currentUser, myRating, ratingIsLoading } = this.props;
    if (ratingIsLoading) {
      return <Loader active />;
    } else if (!ratingIsLoading && myRating) {
      return (
        <div>
          <NewRating
            handleOpenSignUpDialog={this.handleOpenSignUpDialog}
            currentUser={currentUser}
            myRating={myRating}
            handleRating={this.handleRatingClick}
          />
          <div>You already gave point {myRating.rating}</div>
        </div>
      );
    } else {
      return (
        <div>
          <Header size="small">Please leave rating!</Header>
          <div className="rating-description">
            <small>Rating has relation with quality of the whitepaper and company itself.</small>
          </div>
          <NewRating
            handleOpenSignUpDialog={this.handleOpenSignUpDialog}
            currentUser={currentUser}
            myRating={myRating}
            handleRating={this.handleRatingClick}
          />
        </div>
      );
    }
  };

  private getCommentForm = () => {
    const { currentUser, post } = this.props;

    return (
      <div style={{ marginTop: 30 }}>
        <CommentInput
          handleOpenSignUpDialog={this.handleOpenSignUpDialog}
          currentUser={currentUser}
          postId={post._id}
        />
      </div>
    );
  };

  private updateViewCount = (post: any) => {
    post.callMethod("updateViewCount");
  };

  public componentWillReceiveProps(nextProps: IPostShowProps) {
    if (
      (!this.props.post && nextProps.post) ||
      (this.props.post && nextProps.post && this.props.post._id !== nextProps.post._id)
    ) {
      this.updateViewCount(nextProps.post);
    }
  }

  public render() {
    const { post, isLoading } = this.props;

    if (isLoading) {
      return (
        <div>
          <Loader active />
        </div>
      );
    } else if (!post) {
      return null;
    } else {
      const startDate = moment(post.startICODate).format("YYYY-MM-DD HH:mm Z");
      const endDate = moment(post.endICODate).format("YYYY-MM-DD HH:mm Z");

      return (
        <div className="post-show-container">
          <Grid container>
            <Grid.Column width={12}>
              <Container style={{ marginBottom: 30 }}>{this.getHeader()}</Container>
              <Table size="large">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="table-row-title" collapsing>
                      Fields (Category)
                    </Table.Cell>
                    <Table.Cell className="table-cell-content">{this.mapMultiItem(post.fields, "fields")}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="table-row-title" collapsing>
                      WhitePaper
                    </Table.Cell>
                    <Table.Cell className="table-cell-content">
                      <a href={post.whitePaperUrl} target="_blank">
                        WhitePaper
                      </a>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="table-row-title" collapsing>
                      ICO period
                    </Table.Cell>
                    <Table.Cell className="table-cell-content">{`${startDate} ~ ${endDate}`}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="table-row-title" collapsing>
                      Accept Currency
                    </Table.Cell>
                    <Table.Cell className="table-cell-content">
                      {this.mapMultiItem(post.acceptCurrency, "currency")}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="table-row-title" collapsing>
                      ICO Price
                    </Table.Cell>
                    <Table.Cell className="table-cell-content">{post.icoPrice}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="table-row-title" collapsing>
                      Bonus
                    </Table.Cell>
                    <Table.Cell className="table-cell-content">{post.bonus}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="table-row-title" collapsing>
                      Homepage
                    </Table.Cell>
                    <Table.Cell className="table-cell-content">
                      <a href={post.homepageUrl} target="_blank">
                        Homepage
                      </a>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="table-row-title" collapsing>
                      Token Distribution
                    </Table.Cell>
                    <Table.Cell className="table-cell-content">{post.tokenDistribution}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="table-row-title" collapsing>
                      Additional Information
                    </Table.Cell>
                    <Table.Cell className="table-cell-content">{post.content}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column width={4}>
              <div className="show-right-section-wrapper">
                <div style={{ marginBottom: 20 }}>{this.getNewRating()}</div>
                <CommentList
                  post={post}
                  commentCount={this.state.commentCount}
                  loadMoreFunction={this.loadMoreComments}
                />
                {this.getCommentForm()}
              </div>
            </Grid.Column>
          </Grid>
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

    const myRatingHandle = Meteor.subscribe("myRating", postId, Meteor.userId());
    const myRating = RatingModel.findOne({ userId: Meteor.userId() });
    const ratingIsLoading = !myRatingHandle.ready();
    // TODO: handle below count with infinite scroll
    const postsHandle = Meteor.subscribe("post", postId);
    const isLoading = !postsHandle.ready();
    const post = Post.findOne();

    return {
      isLoading,
      post,
      myRating,
      currentUser,
      isLoggingIn,
      ratingIsLoading,
    };
  }
})(connect()(PostShow));

export default PostShowContainer;

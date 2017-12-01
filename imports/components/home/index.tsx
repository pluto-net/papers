import * as React from "react";
import * as queryString from "query-string";
import { Link } from "react-router-dom";
import { Container, Button, Divider, Loader, Grid } from "semantic-ui-react";
const { withTracker } = require("meteor/react-meteor-data");
import { Post, IPost } from "../../../both/model/post";
import IcoCard from "./components/icoCard";
import { IFeedState } from "../posts";

interface IHomeComponentProps {
  // From Meteor
  bestPostsIsLoading: boolean;
  bestPosts: IPost[];
  closeToEndPostsIsLoading: boolean;
  closeToEndPosts: IPost[];
  manyViewCountPostsIsLoading: boolean;
  manyViewCountPosts: IPost[];
  manyCommentsPostsIsLoading: boolean;
  manyCommentsPosts: IPost[];
  currentUser: any;
  isLoggingIn: boolean;
}

class HomeComponent extends React.PureComponent<IHomeComponentProps, {}> {
  private mapPostItem = (targetPosts: any[], type: string) => {
    return targetPosts.map(post => <IcoCard key={`${type}_${post._id}`} type={type} post={post} />);
  };

  private getPostListLink = (option: IFeedState) => {
    const search = queryString.stringify(option);
    return `/posts?${search}`;
  };

  private getIcoList = () => {
    const { manyViewCountPostsIsLoading, manyViewCountPosts } = this.props;

    if (manyViewCountPostsIsLoading) {
      return <Loader active />;
    } else if (manyViewCountPosts && manyViewCountPosts.length > 0) {
      return (
        <div style={{ marginTop: 30 }}>
          <Link to={this.getPostListLink({ viewCount: true })}>Most view count</Link>
          <Link to={this.getPostListLink({ viewCount: true })}>
            <Button size="tiny" color="black" floated="right">
              See More
            </Button>
          </Link>
          <Divider clearing />
          <Grid columns={3} padded className="ico-list-wrapper">
            {this.mapPostItem(manyViewCountPosts, "manyViewCountPosts")}
          </Grid>
        </div>
      );
    } else {
      return <span>No information yet</span>;
    }
  };

  public render() {
    return (
      <div>
        <div className="pluto-banner">
          <h1>Recommend ICO</h1>
          <div>Pluto is sharing and reviewing Cryptocurrency and blockchain.</div>
        </div>
        <Container style={{ marginTop: 30 }}>{this.getIcoList()}</Container>
      </div>
    );
  }
}

const HomeContainer = withTracker(() => {
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  const bestPostsHandle = Meteor.subscribe("bestPosts", 4);
  const bestPostsIsLoading = !bestPostsHandle.ready();
  const bestPosts = Post.find({}, { sort: { ratingCount: -1, averageRating: -1 }, limit: 4 }).fetch();
  const closeToEndPostsHandle = Meteor.subscribe("closeToEndPosts", 4);
  const closeToEndPostsIsLoading = !closeToEndPostsHandle.ready();
  const closeToEndPosts = Post.find({}, { sort: { endICODate: 1 }, limit: 4 }).fetch();

  const manyViewCountPostsHandle = Meteor.subscribe("manyViewCountPosts", 4);
  const manyViewCountPostsIsLoading = !manyViewCountPostsHandle.ready();
  const manyViewCountPosts = Post.find({}, { sort: { viewCount: -1 }, limit: 4 }).fetch();

  const manyCommentsPostsHandle = Meteor.subscribe("manyCommentsPosts", 4);
  const manyCommentsPostsIsLoading = !manyCommentsPostsHandle.ready();
  const manyCommentsPosts = Post.find({}, { sort: { commentCount: -1 }, limit: 4 }).fetch();

  return {
    bestPostsIsLoading,
    bestPosts,
    closeToEndPostsIsLoading,
    closeToEndPosts,
    manyViewCountPosts,
    manyViewCountPostsIsLoading,
    manyCommentsPostsIsLoading,
    manyCommentsPosts,
    currentUser,
    isLoggingIn,
  };
})(HomeComponent);
export default HomeContainer;

import * as React from "react";
import * as queryString from "query-string";
import { Link } from "react-router-dom";
import { Container, Button, Divider, Loader, Card } from "semantic-ui-react";
const { withTracker } = require("meteor/react-meteor-data");
import { Post } from "../../../both/model/post";
import IcoCard from "./components/icoCard";
import { IFeedState } from "../posts";

interface IHomeComponentProps {
  // From Meteor
  bestPostsIsLoading: boolean;
  bestPosts: any[];
  closeToEndPostsIsLoading: boolean;
  closeToEndPosts: any[];
  manyViewCountPostsIsLoading: boolean;
  manyViewCountPosts: any[];
  manyCommentsPostsIsLoading: boolean;
  manyCommentsPosts: any[];
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

  private getBestPosts = () => {
    const { bestPostsIsLoading, bestPosts } = this.props;

    if (bestPostsIsLoading) {
      return <Loader active />;
    } else if (bestPosts && bestPosts.length > 0) {
      return (
        <div>
          <Link to={this.getPostListLink({ ratingCount: true, rating: true })}>Best Ratings</Link>
          <Link to={this.getPostListLink({ ratingCount: true, rating: true })}>
            <Button size="tiny" color="black" floated="right">
              See More
            </Button>
          </Link>
          <Divider clearing />
          <Card.Group itemsPerRow={4}>{this.mapPostItem(bestPosts, "bestPosts")}</Card.Group>
        </div>
      );
    } else {
      return <span>No information yet</span>;
    }
  };

  private getCloseToEndPosts = () => {
    const { closeToEndPostsIsLoading, closeToEndPosts } = this.props;

    if (closeToEndPostsIsLoading) {
      return <Loader active />;
    } else if (closeToEndPosts && closeToEndPosts.length > 0) {
      return (
        <div style={{ marginTop: 30 }}>
          <Link to={this.getPostListLink({ closeToICOEnd: true })}>Close to the End of ICO date</Link>
          <Link to={this.getPostListLink({ closeToICOEnd: true })}>
            <Button size="tiny" color="black" floated="right">
              See More
            </Button>
          </Link>
          <Divider clearing />
          <Card.Group itemsPerRow={4}>{this.mapPostItem(closeToEndPosts, "closeToEndPosts")}</Card.Group>
        </div>
      );
    } else {
      return <span>No information yet</span>;
    }
  };

  private getManyCommentsPosts = () => {
    const { manyCommentsPostsIsLoading, manyCommentsPosts } = this.props;

    if (manyCommentsPostsIsLoading) {
      return <Loader active />;
    } else if (manyCommentsPosts && manyCommentsPosts.length > 0) {
      return (
        <div style={{ marginTop: 30 }}>
          <Link to={this.getPostListLink({ commentCount: true })}>Most Comments</Link>
          <Link to={this.getPostListLink({ commentCount: true })}>
            <Button size="tiny" color="black" floated="right">
              See More
            </Button>
          </Link>
          <Divider clearing />
          <Card.Group itemsPerRow={4}>{this.mapPostItem(manyCommentsPosts, "manyCommentsPosts")}</Card.Group>
        </div>
      );
    } else {
      return <span>No information yet</span>;
    }
  };

  private getManyViewCountPosts = () => {
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
          <Card.Group itemsPerRow={4}>{this.mapPostItem(manyViewCountPosts, "manyViewCountPosts")}</Card.Group>
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
        <Container style={{ marginTop: 30 }}>
          {this.getBestPosts()}
          {this.getCloseToEndPosts()}
          {this.getManyCommentsPosts()}
          {this.getManyViewCountPosts()}
        </Container>
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

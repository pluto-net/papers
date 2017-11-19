import * as React from "react";
import { Link } from "react-router-dom";
import { Container, Button, Divider, Loader, Card } from "semantic-ui-react";
const { withTracker } = require("meteor/react-meteor-data");
import { Post } from "../../../both/model/post";
import IcoCard from "./components/icoCard";

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

  private getBestPosts = () => {
    const { bestPostsIsLoading, bestPosts } = this.props;

    if (bestPostsIsLoading) {
      return <Loader active />;
    } else if (bestPosts && bestPosts.length > 0) {
      return (
        <div>
          <Button floated="left">Best Ratings</Button>
          <Link to="/posts">
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
          <Button floated="left">Close to the End of ICO date</Button>
          <Link to="/posts">
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
          <Button floated="left">Has many comments</Button>
          <Link to="/posts">
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
          <Button floated="left">Has many view count</Button>
          <Link to="/posts">
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
        <div
          style={{
            padding: "30px 50px",
            backgroundColor: "#EFEFEF",
          }}
        >
          <div
            style={{
              lineHeight: "1.5",
              fontSize: "3rem",
              color: "rgba(0,0,0,.6)",
              fontWeight: 700,
              margin: "0.5rem",
            }}
          >
            Assess WhitePapers and ICO NOW
          </div>
          <div style={{ lineHeight: "1.5", fontSize: "2rem", color: "rgba(0,0,0,.6)", marginTop: "0.3rem" }}>
            We believe that we will have much rational choice when we sharing our intelligence and information.
          </div>
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
  // best
  const bestPostsHandle = Meteor.subscribe("bestPosts", 4);
  const bestPostsIsLoading = !bestPostsHandle.ready();
  const bestPosts = Post.find({}, { sort: { ratingCount: -1, averageRating: -1 }, limit: 4 }).fetch();
  // close to end
  const closeToEndPostsHandle = Meteor.subscribe("closeToEndPosts", 4);
  const closeToEndPostsIsLoading = !closeToEndPostsHandle.ready();
  const closeToEndPosts = Post.find({}, { sort: { endICODate: 1 }, limit: 4 }).fetch();

  // manyCommentsPosts
  const manyViewCountPostsHandle = Meteor.subscribe("manyViewCountPosts", 4);
  const manyViewCountPostsIsLoading = !manyViewCountPostsHandle.ready();
  const manyViewCountPosts = Post.find({}, { sort: { viewCount: -1 }, limit: 4 }).fetch();

  // manyCommentsPosts
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

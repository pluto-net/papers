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
        <Container style={{ marginTop: 30 }}>{this.getBestPosts()}</Container>
      </div>
    );
  }
}

const HomeContainer = withTracker(() => {
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // TODO: handle below count with infinite scroll
  const bestPostsHandle = Meteor.subscribe("bestPosts", 4);
  const bestPostsIsLoading = !bestPostsHandle.ready();
  const bestPosts = Post.find({}, { sort: { averageRating: -1 } }).fetch();

  return {
    bestPostsIsLoading,
    bestPosts,
    currentUser,
    isLoggingIn,
  };
})(HomeComponent);
export default HomeContainer;

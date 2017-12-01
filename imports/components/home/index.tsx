import * as React from "react";
// import * as queryString from "query-string";
import { Container, Tab, Loader, Grid } from "semantic-ui-react";
const { withTracker } = require("meteor/react-meteor-data");
import { Post, IPost } from "../../../both/model/post";
import IcoCard from "./components/icoCard";

interface IHomeComponentProps {
  // From Meteor
  postsIsLoading: boolean;
  posts: IPost[];
  currentUser: any;
  isLoggingIn: boolean;
}

class HomeComponent extends React.PureComponent<IHomeComponentProps, {}> {
  private mapPostItem = (targetPosts: any[], type: string) => {
    return targetPosts.map(post => <IcoCard key={`${type}_${post._id}`} type={type} post={post} />);
  };

  private getHeader = () => {
    const panes = [
      { menuItem: "CURRENT", render: () => <Tab.Pane className="ico-list-wrapper">{this.getIcoList()}</Tab.Pane> },
      { menuItem: "UPCOMING", render: () => <Tab.Pane className="ico-list-wrapper">{this.getIcoList()}</Tab.Pane> },
      { menuItem: "PAST", render: () => <Tab.Pane className="ico-list-wrapper">{this.getIcoList()}</Tab.Pane> },
    ];

    return <Tab activeIndex={1} panes={panes} />;
  };

  private getIcoList = () => {
    const { postsIsLoading, posts } = this.props;

    if (postsIsLoading) {
      return <Loader active />;
    } else if (posts && posts.length > 0) {
      return (
        <div style={{ marginTop: 30 }}>
          <Grid columns={3} padded className="ico-list-wrapper">
            {this.mapPostItem(posts, "manyViewCountPosts")}
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
        <Container style={{ marginTop: 30 }}>{this.getHeader()}</Container>
      </div>
    );
  }
}

const HomeContainer = withTracker(() => {
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // posts subscribe
  const PostsHandle = Meteor.subscribe("manyViewCountPosts", 4);
  const postsIsLoading = !PostsHandle.ready();
  const posts = Post.find({}, { sort: { viewCount: -1 }, limit: 4 }).fetch();

  return {
    posts,
    postsIsLoading,
    currentUser,
    isLoggingIn,
  };
})(HomeComponent);
export default HomeContainer;

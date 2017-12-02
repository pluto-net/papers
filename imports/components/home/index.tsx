import * as React from "react";
import * as queryString from "query-string";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Container, Tab, Loader, Grid } from "semantic-ui-react";
const { withTracker } = require("meteor/react-meteor-data");
import { Post, IPost } from "../../../both/model/post";
import IcoCard from "./components/icoCard";
import { getCurrentDate } from "../../helpers/getCurrentDate";

interface IHomeComponentProps extends RouteComponentProps<{}> {
  // From Meteor
  postsIsLoading: boolean;
  posts: IPost[];
  currentUser: any;
  isLoggingIn: boolean;
}

@withRouter
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

const HomeContainer = withTracker((props: IHomeComponentProps) => {
  const rawLocationSearch = props.location.search;
  const queryParamsObject = queryString.parse(rawLocationSearch);
  console.log(queryParamsObject);
  // Basic subscribe options
  const date = getCurrentDate();
  const subscribeFilter: any = { startICODate: { $lte: date }, endICODate: { $gte: date } };
  if (queryParamsObject.dateSort) {
    switch (queryParamsObject.dateSort) {
      case "upcoming":
        subscribeFilter.startICODate = { $gte: date };
        break;

      case "past":
        subscribeFilter.endICODate = { $lte: date };
        break;

      default:
        break;
    }
  }

  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // posts subscribe
  const PostsHandle = Meteor.subscribe("posts", subscribeFilter);
  const postsIsLoading = !PostsHandle.ready();
  const posts = Post.find().fetch();

  return {
    posts,
    postsIsLoading,
    currentUser,
    isLoggingIn,
  };
})(HomeComponent);
export default HomeContainer;

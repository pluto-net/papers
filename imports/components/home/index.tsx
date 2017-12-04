import * as React from "react";
import { Meteor } from "meteor/meteor";
import * as queryString from "query-string";
import { connect, DispatchProp } from "react-redux";
import { push } from "react-router-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Container, Tab, Grid } from "semantic-ui-react";
const { withTracker } = require("meteor/react-meteor-data");
import InfiniteScroll = require("react-infinite-scroller");
import throttle = require("lodash.throttle");
import { Post, IPost } from "../../../both/model/post";
import IcoCard from "./components/icoCard";
import { getCurrentDate } from "../../helpers/getCurrentDate";
import { addOrChangeQueryParams } from "../../helpers/queryParams";

interface IHomeComponentProps extends RouteComponentProps<{}>, DispatchProp<any> {
  // From Meteor
  postsIsLoading: boolean;
  posts: IPost[];
  currentUser: any;
  isLoggingIn: boolean;
  dateFilter: DateFilter;
  // From Meta
  limit: number;
  hasMore: boolean;
  incrementSubscriptionLimit: () => void;
}

type DateFilter = "current" | "upcoming" | "past";

interface IHomeQueryParams {
  dateFilter?: DateFilter;
}

@withRouter
class HomeComponent extends React.PureComponent<IHomeComponentProps, {}> {
  private handleLoadMore = throttle(this.props.incrementSubscriptionLimit, 400);

  private mapPostItem = (targetPosts: any[], type: string) => {
    return targetPosts.map(post => <IcoCard key={`${type}_${post._id}`} type={type} post={post} />);
  };

  private handleTabChange = (_e: any, data: any) => {
    const { dispatch, location } = this.props;
    const dateFilter = data.panes[data.activeIndex].menuItem.toLowerCase();
    const queryParams = addOrChangeQueryParams(location.search, { dateFilter });

    dispatch(push(`/?${queryParams}`));
  };

  private getHeader = () => {
    const { dateFilter } = this.props;

    const panes = [
      { menuItem: "CURRENT", render: () => <Tab.Pane className="ico-list-wrapper">{this.getIcoList()}</Tab.Pane> },
      { menuItem: "UPCOMING", render: () => <Tab.Pane className="ico-list-wrapper">{this.getIcoList()}</Tab.Pane> },
      { menuItem: "PAST", render: () => <Tab.Pane className="ico-list-wrapper">{this.getIcoList()}</Tab.Pane> },
    ];

    const activeIndex = panes.findIndex(pane => pane.menuItem.toLowerCase() === dateFilter);

    return <Tab onTabChange={this.handleTabChange} activeIndex={activeIndex} panes={panes} />;
  };

  private getIcoList = () => {
    const { posts } = this.props;

    if (posts && posts.length > 0) {
      return (
        <div style={{ marginTop: 30 }}>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.handleLoadMore}
            hasMore={this.props.hasMore}
            threshold={600}
            loader={null}
            initialLoad={false}
            useWindow
          >
            <Grid columns={3} padded className="ico-list-wrapper">
              {this.mapPostItem(posts, "manyViewCountPosts")}
            </Grid>
          </InfiniteScroll>
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
  const queryParamsObject: IHomeQueryParams = queryString.parse(rawLocationSearch);
  console.log(queryParamsObject);
  const limit = props.limit;
  // Basic subscribe options
  const date = getCurrentDate();
  const subscribeFilter: any = { startICODate: { $lte: date }, endICODate: { $gte: date } };
  if (queryParamsObject.dateFilter) {
    switch (queryParamsObject.dateFilter) {
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

  const subscribeOptions: any = {
    limit,
  };

  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // posts subscribe
  const PostsHandle = Meteor.subscribe("posts", subscribeFilter, subscribeOptions);
  const postsIsLoading = !PostsHandle.ready();
  const posts = Post.find().fetch();

  let hasMore: boolean = true;
  Meteor.call("getIcoPostCountWithOptions", subscribeFilter, subscribeOptions, (err: Error, count: number) => {
    if (err) {
      console.error(err);
    } else {
      if (limit > count) {
        hasMore = false;
      }
    }
  });

  return {
    // Concern with Meteor subscribe
    posts,
    postsIsLoading,
    currentUser,
    isLoggingIn,
    // Meta
    dateFilter: queryParamsObject.dateFilter ? queryParamsObject.dateFilter : "current",
    limit,
    hasMore,
  };
})(connect()(HomeComponent));

interface IHigherHomeContainerStates {
  limit: number;
}

class HigherHomeContainer extends React.Component<IHomeComponentProps, IHigherHomeContainerStates> {
  public state = {
    limit: 20,
  };

  private incrementSubscriptionLimit = () => {
    this.setState({
      limit: this.state.limit + 20,
    });
  };

  private initializeSubscriptionLimit = () => {
    this.setState({
      limit: 20,
    });
  };

  public componentWillReceiveProps(nextProps: IHomeComponentProps) {
    const currentLocation = this.props.location;
    const nextLocation = nextProps.location;
    const currentSearch = queryString.parse(currentLocation.search);
    const nextSearch = queryString.parse(nextLocation.search);

    if (currentSearch && nextSearch && currentSearch.dateFilter !== nextSearch.dateFilter) {
      this.initializeSubscriptionLimit();
    }
  }

  public render() {
    return (
      <HomeContainer
        {...this.props}
        limit={this.state.limit}
        incrementSubscriptionLimit={this.incrementSubscriptionLimit}
      />
    );
  }
}

export default HigherHomeContainer;

import * as React from "react";
import { Meteor } from "meteor/meteor";
import * as queryString from "query-string";
import { connect, DispatchProp, Dispatch } from "react-redux";
import { push } from "react-router-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Container, Tab, Grid, Dropdown, Input, Icon } from "semantic-ui-react";
const { withTracker } = require("meteor/react-meteor-data");
import InfiniteScroll = require("react-infinite-scroller");
import throttle = require("lodash.throttle");
import { Post, IPost } from "../../../both/model/post";
import IcoCard from "./components/icoCard";
import { getCurrentDate } from "../../helpers/getCurrentDate";
import { addOrChangeQueryParams } from "../../helpers/queryParams";
import { IUser } from "../../../both/model/user";

interface IHomeComponentProps extends RouteComponentProps<{}>, DispatchProp<any> {
  // From Meteor
  postsIsLoading: boolean;
  posts: IPost[];
  currentUser: IUser | null;
  isLoggingIn: boolean;
  dateFilter: DateFilter;
  // From Meta
  limit: number;
  hasMore: boolean;
  sortOption: SortOption;
  incrementSubscriptionLimit: () => void;
}

interface IHomeComponentStates {
  searchTerm?: string;
}

type DateFilter = "current" | "upcoming" | "past" | "all";
type SortOption = "hot" | "score" | "date";

interface IHomeQueryParams {
  dateFilter?: DateFilter;
  sortOption?: SortOption;
  keyword?: string;
}

interface ISortOptionDropdownItem {
  key: number;
  text: string;
  value: SortOption;
}

@withRouter
class HomeComponent extends React.PureComponent<IHomeComponentProps, IHomeComponentStates> {
  public state: IHomeComponentStates = {
    searchTerm: "",
  };

  private handleLoadMore = throttle(this.props.incrementSubscriptionLimit, 400);

  private mapPostItem = (targetPosts: any[], type: string) => {
    return targetPosts.map(post => <IcoCard key={`${type}_${post._id}`} type={type} post={post} />);
  };

  private handleTabChange = (_e: any, data: any) => {
    const { dispatch, location } = this.props;
    const dateFilter = data.panes[data.activeIndex].menuItem.toLowerCase();

    const removeKeys = dateFilter === "all" ? undefined : ["keyword"];
    const queryParams = addOrChangeQueryParams(location.search, { dateFilter }, removeKeys);

    (dispatch as Dispatch<any>)(push(`/?${queryParams}`));
  };

  private handleSortChange = (_e: any, data: any) => {
    const { dispatch, location } = this.props;

    const sortOption = data.value;
    const queryParams = addOrChangeQueryParams(location.search, { sortOption });

    (dispatch as Dispatch<any>)(push(`/?${queryParams}`));
  };

  private getSortDropdown = () => {
    const options: ISortOptionDropdownItem[] = [
      { key: 1, text: "Hot", value: "hot" },
      { key: 2, text: "Score", value: "score" },
      { key: 3, text: "Date", value: "date" },
    ];

    return (
      <Dropdown
        onChange={this.handleSortChange}
        options={options}
        placeholder="Choose an option"
        value={this.props.sortOption}
        selection
      />
    );
  };

  private getContent = () => {
    const { dateFilter } = this.props;

    const panes = [
      { menuItem: "CURRENT", render: () => <Tab.Pane className="ico-list-wrapper">{this.getIcoList()}</Tab.Pane> },
      { menuItem: "UPCOMING", render: () => <Tab.Pane className="ico-list-wrapper">{this.getIcoList()}</Tab.Pane> },
      { menuItem: "PAST", render: () => <Tab.Pane className="ico-list-wrapper">{this.getIcoList()}</Tab.Pane> },
      { menuItem: "ALL", render: () => <Tab.Pane className="ico-list-wrapper ">{this.getIcoList()}</Tab.Pane> },
    ];

    const activeIndex = panes.findIndex(pane => pane.menuItem.toLowerCase() === dateFilter);

    return (
      <div className="home-tab-wrapper">
        <Tab className="home-tab-menu" onTabChange={this.handleTabChange} activeIndex={activeIndex} panes={panes} />
      </div>
    );
  };

  private getIcoList = () => {
    const { posts } = this.props;

    if (posts && posts.length > 0) {
      return (
        <div style={{ marginTop: 30 }}>
          <div className="home-header-filter-wrapper">
            <h1 className="home-header-title">{this.getTitle()}</h1>
            <div className="home-header-sort-dropdown-wrapper">{this.getSortDropdown()}</div>
          </div>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.handleLoadMore}
            hasMore={this.props.hasMore}
            threshold={600}
            loader={<span />}
            initialLoad={false}
            useWindow
          >
            <Grid columns={3} padded className="ico-list-wrapper">
              {this.mapPostItem(posts, "manyViewCountPosts")}
            </Grid>
          </InfiniteScroll>
        </div>
      );
    }
  };

  private getTitle = () => {
    const { dateFilter } = this.props;
    switch (dateFilter) {
      case "current":
        return "Ongoing ICO Project";

      case "upcoming":
        return "Upcoming ICO Project";

      case "past":
        return "Past ICO Project";

      case "all":
        return "All ICO Project";

      default:
        return "Ongoing ICO Project";
    }
  };

  private handleSearchInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const searchTerm = e.currentTarget.value;

    this.setState({
      searchTerm,
    });
  };

  private handleSubmitSearchInput = (e: any) => {
    e.preventDefault();
    const { searchTerm } = this.state;
    const { dispatch, location } = this.props;

    const keyword = searchTerm;
    const queryParams = addOrChangeQueryParams(location.search, { keyword, dateFilter: "all" });

    (dispatch as Dispatch<any>)(push(`/?${queryParams}`));
  };

  private getHeaderJumboTron = () => {
    return (
      <div className="navbar-jumbotron-wrapper">
        <h1 className="jumbotron-title">{`When you invest in decentralized coins, \n why rely on the risk assessed by the central?`}</h1>
        <h2 className="jumbotron-description">{`The most accurate way to check your investment potential is \n to discuss directly with people who invest in value.`}</h2>
      </div>
    );
  };

  private getSearchInput = () => {
    return (
      <form onSubmit={this.handleSubmitSearchInput} className="search-input-wrapper">
        <Input icon fluid placeholder="Search for ICO">
          <input onChange={this.handleSearchInputChange} className="home-search-input" />
          <Icon link onClick={this.handleSubmitSearchInput} className="home-search-input-icon" name="search" />
        </Input>
      </form>
    );
  };

  public render() {
    return (
      <div className="pluto-home-page">
        {this.getHeaderJumboTron()}
        <Container style={{ marginTop: 30 }}>
          {this.getSearchInput()}
          {this.getContent()}
        </Container>
      </div>
    );
  }
}

const HomeContainer = withTracker((props: IHomeComponentProps) => {
  const rawLocationSearch = props.location.search;
  const queryParamsObject: IHomeQueryParams = queryString.parse(rawLocationSearch);
  const limit = props.limit;
  // Build subscribe options
  const currentDate = getCurrentDate();
  const subscribeFilter: any = {};
  if (queryParamsObject.dateFilter) {
    switch (queryParamsObject.dateFilter) {
      case "upcoming":
        subscribeFilter.startICODate = { $gte: currentDate };
        break;

      case "past":
        subscribeFilter.endICODate = { $lte: currentDate };
        break;

      case "all":
        break;

      default:
        subscribeFilter.startICODate = { $lte: currentDate };
        subscribeFilter.endICODate = { $gte: currentDate };
        break;
    }
  }

  if (queryParamsObject.keyword) {
    subscribeFilter.title = { $regex: queryParamsObject.keyword, $options: "i" };
  }

  // build subscription option
  const targetSortOption: any = {};
  switch (queryParamsObject.sortOption) {
    case "score":
      targetSortOption.averageRating = -1;
      targetSortOption.startICODate = -1;
      break;

    case "hot":
      targetSortOption.commentCount = -1;
      targetSortOption.startICODate = -1;
      break;

    case "date":
      targetSortOption.endICODate = 1;
      break;

    default:
      targetSortOption.commentCount = -1;
      targetSortOption.startICODate = -1;
      break;
  }

  const subscribeOptions: any = {
    limit,
    sort: targetSortOption,
  };

  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // posts subscribe
  const PostsHandle = Meteor.subscribe("posts", subscribeFilter, subscribeOptions);
  const postsIsLoading = !PostsHandle.ready();
  const posts = Post.find(subscribeFilter, subscribeOptions).fetch();

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
    sortOption: queryParamsObject.sortOption ? queryParamsObject.sortOption : "hot",
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

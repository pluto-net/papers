import * as React from "react";
import { Meteor } from "meteor/meteor";
import * as qs from "qs";
import { connect, DispatchProp, Dispatch } from "react-redux";
import { push } from "react-router-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Container, Grid, Dropdown, Input, Icon } from "semantic-ui-react";
const { withTracker } = require("meteor/react-meteor-data");
import InfiniteScroll = require("react-infinite-scroller");
import throttle = require("lodash.throttle");
import { Post, IPost } from "../../../both/model/post";
import IcoCard from "./components/icoCard";
import { getCurrentDate } from "../../helpers/getCurrentDate";
import { addOrChangeQueryParams } from "../../helpers/queryParams";
import { IUser } from "../../../both/model/user";
import IcoList from "./components/icoList";

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

export type DateFilter = "current" | "upcoming" | "past" | "all";
type SortOption = "view" | "score" | "date";

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
class HomeComponent extends React.Component<IHomeComponentProps, IHomeComponentStates> {
  public state: IHomeComponentStates = {
    searchTerm: "",
  };

  private handleLoadMore = throttle(this.props.incrementSubscriptionLimit, 400);

  private mapPostItem = (targetPosts: any[], type: string) => {
    const { dateFilter } = this.props;
    return targetPosts.map(post => (
      <IcoCard key={`${type}_${post._id}`} dateFilter={dateFilter} type={type} post={post} />
    ));
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
      { key: 1, text: "View", value: "view" },
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
            <Grid columns={3} stackable className="ico-list-wrapper">
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
        <h1 className="jumbotron-title">{`Decentralized Reviews on Best Decentralizations`}</h1>
        <h2 className="jumbotron-description">{`Rate your favorite crypto projects based on\ntheir value propositions in whitepapers.`}</h2>
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
    const { posts, dateFilter } = this.props;

    return (
      <div className="pluto-home-page">
        {this.getHeaderJumboTron()}
        <Container style={{ marginTop: 30 }}>
          {this.getSearchInput()}
          <IcoList
            posts={posts}
            dateFilter={dateFilter}
            getIcoList={this.getIcoList}
            handleTabChange={this.handleTabChange}
          />
        </Container>
      </div>
    );
  }
}

const HomeContainer = withTracker((props: IHomeComponentProps) => {
  const rawLocationSearch = props.location.search.slice(1);
  const queryParamsObject: IHomeQueryParams = qs.parse(rawLocationSearch);
  const limit = props.limit;
  // Build subscribe options
  const currentDate = getCurrentDate();
  const subscribeFilter: any = {};

  switch (queryParamsObject.dateFilter) {
    case "past":
      subscribeFilter.endICODate = { $lte: currentDate };
      break;

    case "all":
      break;

    case "upcoming":
      subscribeFilter.startICODate = { $lte: currentDate };
      break;

    default:
      subscribeFilter.endICODate = { $gte: currentDate };
      subscribeFilter.startICODate = { $lte: currentDate };
      break;
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

    case "date":
      targetSortOption.endICODate = 1;
      break;

    case "view":
    default:
      targetSortOption.commentCount = -1;
      targetSortOption.startICODate = -1;
      break;
  }

  const subscribeOptions: any = {
    sort: targetSortOption,
  };

  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // posts subscribe
  const PostsHandle = Meteor.subscribe("posts", subscribeFilter, subscribeOptions);
  const postsIsLoading = !PostsHandle.ready();
  const posts = Post.find(subscribeFilter, { ...subscribeOptions, ...{ limit } }).fetch();

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
    sortOption: queryParamsObject.sortOption ? queryParamsObject.sortOption : "view",
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
    const currentSearch = qs.parse(currentLocation.search);
    const nextSearch = qs.parse(nextLocation.search);

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

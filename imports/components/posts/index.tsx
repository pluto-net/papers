import * as React from "react";
import * as queryString from "query-string";
import { connect, DispatchProp } from "react-redux";
import { push } from "react-router-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Container, Grid, Checkbox, Form, Button } from "semantic-ui-react";
import isEmpty = require("lodash.isempty");
import pickBy = require("lodash.pickby");
import transform = require("lodash.transform");
import { Meteor } from "meteor/meteor";
import { Post } from "../../../both/model/post";
import PostList from "./components/postList";
const { withTracker } = require("meteor/react-meteor-data");

interface IFeedProps extends RouteComponentProps<{}>, DispatchProp<any> {
  isLoading: boolean;
  posts: any;
  currentUser: any;
  isLoggingIn: boolean;
  users: any[];
  usersIsLoading: boolean;
}

export interface IFeedState {
  newest?: boolean;
  ratingCount?: boolean;
  rating?: boolean;
  commentCount?: boolean;
  closeToICOEnd?: boolean;
  viewCount?: boolean;
  searchTerm?: string;
}

@withRouter
class Feed extends React.PureComponent<IFeedProps, IFeedState> {
  public state = {
    newest: true,
    ratingCount: false,
    rating: false,
    commentCount: false,
    closeToICOEnd: false,
    viewCount: false,
    searchTerm: "",
  };

  private changeSortOption = (_e: any, data: any) => {
    const { dispatch, location } = this.props;

    const newState = {
      ...this.state,
      ...{ [data.value]: data.checked },
    };

    this.setState(newState);

    const search = queryString.stringify(newState);
    const pathWithSearch = `${location.pathname}?${search}`;
    dispatch(push(pathWithSearch));
  };

  private checkTrue = (value: string | boolean) => {
    if (typeof value === "string") {
      return value === "true";
    } else {
      return value;
    }
  };

  private handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { searchTerm } = this.state;

    this.changeSortOption("", { searchTerm });
  };

  private handleChangeSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    this.setState({
      searchTerm: value,
    });
  };

  public componentDidMount() {
    const { location } = this.props;

    const rawSearch = location.search;
    const search = queryString.parse(rawSearch);
    const initialState = { ...this.state, ...{ newest: false } };
    const newState = {
      ...initialState,
      ...search,
    };

    this.setState(newState);
  }

  public render() {
    const { posts, isLoading, currentUser, users, usersIsLoading } = this.props;
    const { searchTerm } = this.state;

    if (isLoading) {
      return <div>Loading posts ...</div>;
    } else {
      const { newest, ratingCount, rating, commentCount, closeToICOEnd, viewCount } = this.state;

      return (
        <div>
          <Container>
            <Form onSubmit={this.handleSearchSubmit}>
              <Form.Field>
                <Form.Input
                  placeholder="Search ICO or Whitepaper"
                  value={searchTerm}
                  onChange={this.handleChangeSearchInput}
                />
              </Form.Field>
              <Button size="tiny" floated="right" type="submit" primary>
                Search
              </Button>
            </Form>

            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column width={4}>
                  <h2 className="sort-option-header">Show results for</h2>
                  <div className="sort-option-item">
                    <Checkbox
                      value="newest"
                      onChange={this.changeSortOption}
                      checked={this.checkTrue(newest)}
                      label={<label>Newest ICO</label>}
                    />
                  </div>
                  <div className="sort-option-item">
                    <Checkbox
                      value="rating"
                      onChange={this.changeSortOption}
                      checked={this.checkTrue(rating)}
                      label={<label>Best Rating ICO</label>}
                    />
                  </div>
                  <div className="sort-option-item">
                    <Checkbox
                      value="ratingCount"
                      onChange={this.changeSortOption}
                      checked={this.checkTrue(ratingCount)}
                      label={<label>Many Rating ICO</label>}
                    />
                  </div>
                  <div className="sort-option-item">
                    <Checkbox
                      value="closeToICOEnd"
                      onChange={this.changeSortOption}
                      checked={this.checkTrue(closeToICOEnd)}
                      label={<label>Close to end period ICO</label>}
                    />
                  </div>

                  <div className="sort-option-item">
                    <Checkbox
                      value="commentCount"
                      onChange={this.changeSortOption}
                      checked={this.checkTrue(commentCount)}
                      label={<label>Many Comments ICO</label>}
                    />
                  </div>

                  <div className="sort-option-item">
                    <Checkbox
                      value="viewCount"
                      onChange={this.changeSortOption}
                      checked={this.checkTrue(viewCount)}
                      label={<label>Many View Count</label>}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column width={12}>
                  <PostList posts={posts} currentUser={currentUser} users={users} usersIsLoading={usersIsLoading} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      );
    }
  }
}

const FeedContainer = withTracker((params: IFeedProps) => {
  const rawSearch = params.location.search;
  const search = queryString.parse(rawSearch);

  let subscribeOptions: any = {};
  if (isEmpty(search)) {
    subscribeOptions = {
      publishedAt: -1,
    };
  } else {
    const rawOption = pickBy(search, (val: any) => {
      return val === "true";
    });

    subscribeOptions = (transform as any)(rawOption, (option: any, _value: any, key: string) => {
      switch (key) {
        case "newest": {
          option.publishedAt = -1;
          break;
        }
        case "viewCount": {
          option.viewCount = -1;
          break;
        }
        case "ratingCount": {
          option.ratingCount = -1;
          break;
        }
        case "rating": {
          option.averageRating = -1;
          break;
        }
        case "commentCount": {
          option.commentCount = -1;
          break;
        }
        case "closeToICOEnd": {
          option.endICODate = 1;
          break;
        }
      }
    });
  }

  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // TODO: handle below count with infinite scroll
  let postsHandle;
  if (search.searchTerm) {
    postsHandle = Meteor.subscribe("posts", subscribeOptions, search.searchTerm);
  } else {
    postsHandle = Meteor.subscribe("posts", subscribeOptions);
  }
  const isLoading = !postsHandle.ready();
  const posts = Post.find({}, { sort: subscribeOptions, limit: 50 }).fetch();

  const userIds = posts.map((post: any) => post.userId);
  const userHandle = Meteor.subscribe("users", userIds);
  const users = Meteor.users.find().fetch();
  const usersIsLoading = !userHandle.ready();

  return {
    isLoading,
    posts,
    users,
    usersIsLoading,
    currentUser,
    isLoggingIn,
  };
})(connect()(Feed));

export default FeedContainer;

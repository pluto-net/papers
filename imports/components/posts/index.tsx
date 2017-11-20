import * as React from "react";
import * as queryString from "query-string";
import { connect, DispatchProp } from "react-redux";
import { push } from "react-router-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Container, Grid, Checkbox } from "semantic-ui-react";
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
}

export interface IFeedState {
  newest?: boolean;
  ratingCount?: boolean;
  rating?: boolean;
  commentCount?: boolean;
  closeToICOEnd?: boolean;
  viewCount?: boolean;
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
  };

  private handleClickSortOption = (_e: React.FormEvent<HTMLInputElement>, data: any) => {
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
    const { posts, isLoading } = this.props;

    if (isLoading) {
      return <div>Loading posts ...</div>;
    } else {
      const { newest, ratingCount, rating, commentCount, closeToICOEnd, viewCount } = this.state;

      return (
        <div>
          <Container>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column width={4}>
                  <h2 className="sort-option-header">Show results for</h2>
                  <div className="sort-option-item">
                    <Checkbox
                      value="newest"
                      onChange={this.handleClickSortOption}
                      checked={this.checkTrue(newest)}
                      label={<label>Newest ICO</label>}
                    />
                  </div>
                  <div className="sort-option-item">
                    <Checkbox
                      value="rating"
                      onChange={this.handleClickSortOption}
                      checked={this.checkTrue(rating)}
                      label={<label>Best Rating ICO</label>}
                    />
                  </div>
                  <div className="sort-option-item">
                    <Checkbox
                      value="ratingCount"
                      onChange={this.handleClickSortOption}
                      checked={this.checkTrue(ratingCount)}
                      label={<label>Many Rating ICO</label>}
                    />
                  </div>
                  <div className="sort-option-item">
                    <Checkbox
                      value="closeToICOEnd"
                      onChange={this.handleClickSortOption}
                      checked={this.checkTrue(closeToICOEnd)}
                      label={<label>Close to end period ICO</label>}
                    />
                  </div>

                  <div className="sort-option-item">
                    <Checkbox
                      value="commentCount"
                      onChange={this.handleClickSortOption}
                      checked={this.checkTrue(commentCount)}
                      label={<label>Many Comments ICO</label>}
                    />
                  </div>

                  <div className="sort-option-item">
                    <Checkbox
                      value="viewCount"
                      onChange={this.handleClickSortOption}
                      checked={this.checkTrue(viewCount)}
                      label={<label>Many View Count</label>}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column width={12}>
                  <PostList posts={posts} />
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

  let sortOption: any = {};
  if (isEmpty(search)) {
    sortOption = {
      publishedAt: -1,
    };
  } else {
    const rawOption = pickBy(search, (val: any) => {
      return val === "true";
    });

    sortOption = (transform as any)(rawOption, (result: any, _value: any, key: string) => {
      switch (key) {
        case "newest": {
          result.publishedAt = -1;
          break;
        }
        case "viewCount": {
          result.viewCount = -1;
          break;
        }
        case "ratingCount": {
          result.ratingCount = -1;
          break;
        }
        case "rating": {
          result.averageRating = -1;
          break;
        }
        case "commentCount": {
          result.commentCount = -1;
          break;
        }
        case "closeToICOEnd": {
          result.endICODate = -1;
          break;
        }
      }
    });
  }

  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // TODO: handle below count with infinite scroll
  const postsHandle = Meteor.subscribe("posts", 50);
  const isLoading = !postsHandle.ready();
  const posts = Post.find({}, { sort: sortOption }).fetch();

  return {
    isLoading,
    posts,
    currentUser,
    isLoggingIn,
  };
})(connect()(Feed));

export default FeedContainer;

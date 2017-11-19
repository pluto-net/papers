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

interface IFeedState {
  newest: boolean;
  ratingCount: boolean;
  rating: boolean;
  commentCount: boolean;
  closeToICOEnd: boolean;
}

@withRouter
class Feed extends React.PureComponent<IFeedProps, IFeedState> {
  public state = {
    newest: true,
    ratingCount: false,
    rating: false,
    commentCount: false,
    closeToICOEnd: false,
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

  public render() {
    const { posts, isLoading } = this.props;

    if (isLoading) {
      return <div>Loading posts ...</div>;
    } else {
      const { newest, ratingCount, rating, commentCount, closeToICOEnd } = this.state;

      return (
        <div>
          <Container>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column width={4}>
                  <h2>Show results for</h2>
                  <Checkbox
                    value="newest"
                    onChange={this.handleClickSortOption}
                    checked={newest}
                    label={<label>Newest ICO</label>}
                  />
                  <Checkbox
                    value="rating"
                    onChange={this.handleClickSortOption}
                    checked={rating}
                    label={<label>Best Rating ICO</label>}
                  />
                  <Checkbox
                    value="ratingCount"
                    onChange={this.handleClickSortOption}
                    checked={ratingCount}
                    label={<label>Many Rating ICO</label>}
                  />
                  <Checkbox
                    value="closeToICOEnd"
                    onChange={this.handleClickSortOption}
                    checked={closeToICOEnd}
                    label={<label>Close to end period ICO</label>}
                  />

                  <Checkbox
                    value="commentCount"
                    onChange={this.handleClickSortOption}
                    checked={commentCount}
                    label={<label>Many Comments ICO</label>}
                  />
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

    sortOption = transform(rawOption, (result, _value, key) => {
      switch (key) {
        case "newest": {
          result.publishedAt = -1;
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

  console.log(sortOption, "sortOption");

  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();
  // TODO: handle below count with infinite scroll
  const postsHandle = Meteor.subscribe("posts", 50);
  const isLoading = !postsHandle.ready();
  const posts = Post.find({}, { sort: { publishedAt: -1 } }).fetch();

  return {
    isLoading,
    posts,
    currentUser,
    isLoggingIn,
  };
})(connect()(Feed));

export default FeedContainer;

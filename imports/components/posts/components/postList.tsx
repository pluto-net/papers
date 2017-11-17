import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { Item, Grid, Rating } from "semantic-ui-react";

interface IPostListParams {
  posts: any[];
}

const mapMultiItem = (items: string[], postId: string, type: string) => {
  if (!items) {
    return null;
  }

  return items.map((item, index) => {
    return (
      <span className="post-list-item-item" key={`${postId}_${type}_${index}`}>
        {item}
      </span>
    );
  });
};

const mapPostNodes = (posts: any[]) => {
  return posts.map(post => {
    const startDate = moment(post.startICODate).format("MMM Do YY");
    const endDate = moment(post.endICODate).format("MMM Do YY");
    const rating = Math.round(post.averageRating);

    return (
      <Item key={`post_list_item_${post._id}`}>
        <Item.Content>
          <Item.Header>
            <Link to={`/posts/${post._id}`}>
              <span>{post.title}</span>
            </Link>
          </Item.Header>
          <div className="post-list-item-ico-date">{`${startDate} ~ ${endDate}`}</div>
          <Grid className="post-list-item-content" columns={3}>
            <Grid.Row>
              <Grid.Column>
                <div className="post-list-item-item">
                  <div className="post-list-item-label">Average Rating</div>
                  <div>{`Rating count - ${post.ratingCount}`}</div>
                  <Rating icon="star" rating={rating} maxRating={5} disabled />
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="post-list-item-item">
                  <div className="post-list-item-label">View Count</div>
                  {post.viewCount || 0}
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="post-list-item-item">
                  <div className="post-list-item-label">Comment Count</div>
                  {post.commentCount}
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="post-list-item-item">
                  <div className="post-list-item-label">Fields</div>
                  {mapMultiItem(post.fields, post._id, "currency")}
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="post-list-item-item">
                  <div className="post-list-item-label">ICO Price</div>
                  {post.icoPrice}
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="post-list-item-item">
                  <div className="post-list-item-label">Bonus Token</div>
                  {post.bonus}
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="post-list-item-item">
                  <div className="post-list-item-label">Accept Currency</div>
                  {mapMultiItem(post.acceptCurrency, post._id, "currency")}
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="post-list-item-item">
                  <div className="post-list-item-label">Links</div>
                  <a target="_blank" href={post.homepageUrl} className="post-list-item-link">
                    Homepage
                  </a>
                  <a target="_blank" href={post.whitePaperUrl} className="post-list-item-link">
                    WhitePaper
                  </a>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {/* <div className="post-list-item-item">
            <div className="post-list-item-label">Token Distribution</div>
            {post.tokenDistribution}
          </div>
          <div className="post-list-item-item">
            <div className="post-list-item-label">Additional Information</div>
            {post.content}
          </div> */}
        </Item.Content>
      </Item>
    );
  });
};

const PostList = (params: IPostListParams) => {
  if (!params.posts) {
    return null;
  } else {
    return (
      <div style={{ marginTop: 30 }}>
        <Item.Group divided>{mapPostNodes(params.posts)}</Item.Group>
      </div>
    );
  }
};

export default PostList;

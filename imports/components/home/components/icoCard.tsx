import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { Rating, Grid } from "semantic-ui-react";
import { IPost } from "../../../../both/model/post";
import { getWhitePaperAddress } from "../../../helpers/getWhitepaperAddress";

interface IICOCardProps {
  post: IPost;
  type: string;
}

const ICOCard = (props: IICOCardProps) => {
  const { post } = props;
  const rating = Math.round(post.averageRating);
  const avgRating = post.averageRating.toFixed(1);
  const fromNow = moment(post.endICODate).fromNow();
  const content = post.content.slice(0, 50);

  if (!post) {
    return null;
  }

  return (
    <Grid.Column>
      <div className="ico-card-item-wrapper">
        <div className="ico-card-item-title-box">
          <div className="ico-card-item-title-left-box">
            <div className="ico-card-item-img-wrapper">
              <img src={post.logoUrl} alt={post.title} />
            </div>
          </div>
          <div className="ico-card-item-title-right-box">
            <div className="ico-card-item-title">
              <Link to={`/posts/${post._id}`}>{post.title}</Link>
            </div>
            <div className="ico-card-item-rating-box">
              <Rating style={{ marginRight: 3 }} icon="star" maxRating={5} rating={rating} disabled />
              <span className="average-rating">{avgRating}</span>
              <span className="average-count">{` (${post.ratingCount} participants)`}</span>
            </div>
            <div className="field-wrapper">{post.fields.join(" · ")}</div>
          </div>
        </div>
        <div className="content-wrapper">
          <Link style={{ color: "inherit" }} to={`/posts/${post._id}`}>{`${content} ...`}</Link>
        </div>

        <div className="link-buttons-wrapper">
          <a target="_blank" href={getWhitePaperAddress(post)} className="link-button">
            White Paper
          </a>
          <a target="_blank" href={post.links ? post.links[0] : getWhitePaperAddress(post)} className="link-button">
            Homepage
          </a>
        </div>

        <div className="meta-information-wrapper">
          <Link className="fromNow" to={`/posts/${post._id}`}>
            {fromNow}
          </Link>
          <div className="comment-info">
            Comments
            <span className="comment-count">{` ${post.commentCount}`}</span>
          </div>
        </div>
      </div>
    </Grid.Column>
  );
};

export default ICOCard;

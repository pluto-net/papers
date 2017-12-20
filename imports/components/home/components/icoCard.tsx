import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { Rating, Grid, Icon } from "semantic-ui-react";
import { IPost } from "../../../../both/model/post";
import { getWhitePaperAddress } from "../../../helpers/getWhitepaperAddress";
import { DateFilter } from "..";
const shave = require("shave");

interface IICOCardProps {
  post: IPost;
  type: string;
  dateFilter: DateFilter;
}

class ICOCard extends React.Component<IICOCardProps, {}> {
  private contentNode: HTMLDivElement | null;

  public componentDidMount() {
    shave(this.contentNode, 91);
  }

  public render() {
    const { post, dateFilter } = this.props;
    const rating = Math.round(post.averageRating);
    const avgRating = post.averageRating.toFixed(1);

    let fromNow;
    if (dateFilter === "upcoming") {
      fromNow = moment(post.startICODate).fromNow();
    } else {
      fromNow = moment(post.endICODate).fromNow();
    }

    let content: string;
    if (post.content && post.content.length > 50) {
      content = post.content.slice(0, 50) + "...";
    } else if (!post.content) {
      content = "There is no description yet";
    } else {
      content = post.content;
    }

    if (!post) return null;

    return (
      <Grid.Column>
        <div className="ico-card-item-wrapper">
          <Link
            className="ico-card-item-title-box"
            to={{
              pathname: `/posts/${post._id}`,
              state: { modal: true },
            }}
          >
            <div className="ico-card-item-title-left-box">
              <div className="ico-card-item-img-wrapper">
                <img src={post.logoUrl} alt={post.title} />
              </div>
            </div>
            <div className="ico-card-item-title-right-box">
              <div className="ico-card-item-title">
                <div className="ico-card-item-modal-link">{post.title}</div>
              </div>
              <div className="ico-card-item-rating-box">
                <Rating style={{ marginRight: 3 }} icon="star" maxRating={5} rating={rating} disabled />
                <span className="average-rating">{avgRating}</span>
                <span className="average-count">{` (${post.ratingCount} participants)`}</span>
              </div>
              <div className="field-wrapper">{post.fields ? post.fields.join(" · ") : null}</div>
            </div>
          </Link>
          <div className="content-wrapper">
            <Link
              to={{
                pathname: `/posts/${post._id}`,
                state: { modal: true },
              }}
              style={{ color: "inherit" }}
              className="ico-card-item-modal-link"
            >
              <div
                style={{ lineHeight: "22.5px" }}
                ref={el => {
                  this.contentNode = el;
                }}
              >
                {content}
              </div>
            </Link>
          </div>

          <div className="link-buttons-wrapper">
            <a target="_blank" href={getWhitePaperAddress(post)} className="link-button">
              <Icon className="ico-card-icon" size="large" name="sticky note outline" />
              White Paper
            </a>
            <a target="_blank" href={post.links ? post.links[0] : getWhitePaperAddress(post)} className="link-button">
              <Icon className="ico-card-icon" size="large" name="linkify" />
              Homepage
            </a>
          </div>

          <Link
            to={{
              pathname: `/posts/${post._id}`,
              state: { modal: true },
            }}
            className="meta-information-wrapper"
          >
            <div className="ico-card-item-modal-link fromNow">{fromNow}</div>
            <div className="comment-info">
              Comments
              <span className="comment-count">{` ${post.commentCount}`}</span>
            </div>
          </Link>
        </div>
      </Grid.Column>
    );
  }
}

export default ICOCard;

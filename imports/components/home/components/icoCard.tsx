import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { Rating, Grid } from "semantic-ui-react";
const shave = require("shave");
import { IPost } from "../../../../both/model/post";
import { getWhitePaperAddress } from "../../../helpers/getWhitepaperAddress";

interface IICOCardProps {
  post: IPost;
  type: string;
}

class ICOCard extends React.Component<IICOCardProps, {}> {
  private contentNode: HTMLDivElement | null;

  public componentDidMount() {
    shave(this.contentNode, 91);
  }

  public render() {
    const { post } = this.props;
    const rating = Math.round(post.averageRating);
    const avgRating = post.averageRating.toFixed(1);
    const fromNow = moment(post.endICODate).fromNow();
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
          <div className="ico-card-item-title-box">
            <div className="ico-card-item-title-left-box">
              <div className="ico-card-item-img-wrapper">
                <img src={post.logoUrl} alt={post.title} />
              </div>
            </div>
            <div className="ico-card-item-title-right-box">
              <div className="ico-card-item-title">
                <Link
                  to={{
                    pathname: `/posts/${post._id}`,
                    state: { modal: true },
                  }}
                  className="ico-card-item-modal-link"
                >
                  {post.title}
                </Link>
              </div>
              <div className="ico-card-item-rating-box">
                <Rating style={{ marginRight: 3 }} icon="star" maxRating={5} rating={rating} disabled />
                <span className="average-rating">{avgRating}</span>
                <span className="average-count">{` (${post.ratingCount} participants)`}</span>
              </div>
              <div className="field-wrapper">{post.fields ? post.fields.join(" · ") : null}</div>
            </div>
          </div>
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
              White Paper
            </a>
            <a target="_blank" href={post.links ? post.links[0] : getWhitePaperAddress(post)} className="link-button">
              Homepage
            </a>
          </div>

          <div className="meta-information-wrapper">
            <Link
              to={{
                pathname: `/posts/${post._id}`,
                state: { modal: true },
              }}
              className="ico-card-item-modal-link fromNow"
            >
              {fromNow}
            </Link>
            <Link
              to={{
                pathname: `/posts/${post._id}`,
                state: { modal: true },
              }}
              className="comment-info"
            >
              Comments
              <span className="comment-count">{` ${post.commentCount}`}</span>
            </Link>
          </div>
        </div>
      </Grid.Column>
    );
  }
}

export default ICOCard;

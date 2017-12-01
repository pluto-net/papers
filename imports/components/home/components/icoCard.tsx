import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { Card, Image, Rating } from "semantic-ui-react";
import { IPost } from "../../../../both/model/post";

interface IICOCardProps {
  post: IPost;
  type: string;
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

const ICOCard = (props: IICOCardProps) => {
  const { post, type } = props;
  const rating = Math.round(post.averageRating);
  const startDate = moment(post.startICODate).format("MMM Do YY");
  const endDate = moment(post.endICODate).format("MMM Do YY");
  const tokenDistribution = post.tokenDistribution.slice(0, 100);

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          <Link to={`/posts/${post._id}`}>
            <Image floated="right" size="mini" src={post.logoUrl} />
            <span style={{ color: "#333" }}>{post.title}</span>
          </Link>
        </Card.Header>
        <Card.Meta>
          <Link to={`/posts/${post._id}`}>{`${startDate} ~ ${endDate}`}</Link>
        </Card.Meta>
        <Card.Meta>{mapMultiItem(post.fields, post._id, `currency_${type}`)}</Card.Meta>
        <Card.Description>
          <Link style={{ color: "#333" }} to={`/posts/${post._id}`}>{`${tokenDistribution} ...`}</Link>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Rating icon="star" maxRating={5} rating={rating} disabled />
        <span style={{ fontSize: 10 }}>{`(${post.ratingCount})`}</span>
      </Card.Content>
    </Card>
  );
};

export default ICOCard;

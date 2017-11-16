import * as React from "react";
import * as moment from "moment";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Post } from "../../../both/model/post";
import { Table, Loader, Container, Header, Rating } from "semantic-ui-react";
const { withTracker } = require("meteor/react-meteor-data");

interface IPostShowProps extends RouteComponentProps<{ postId: string }> {
  isLoading: boolean;
  post: any;
  currentUser: any;
  isLoggingIn: boolean;
}

interface IPostShowState {}

@withRouter
class PostShow extends React.PureComponent<IPostShowProps, IPostShowState> {
  private getHeader = () => {
    const { post } = this.props;
    const startDateFromNow = moment(post.startICODate).fromNow();
    const rating = Math.round(post.averageRating);
    const logo = post.logoUrl ? <img className="logo-image" src={post.logoUrl} /> : null;

    if (post.startICODate) {
      return (
        <div>
          <Header size="huge">
            {logo}
            {post.title}
            <span className="subtitle">{` from start time of the ICO, `}</span>
            <span className="subtitle2">{startDateFromNow}</span>
          </Header>
          <Rating maxRating={5} rating={rating} />
          <div>{`Rating count - ${post.ratingCount}`}</div>
        </div>
      );
    } else {
      return (
        <div>
          <Header size="huge">
            {logo}
            {post.title}
          </Header>
          <Rating maxRating={5} rating={rating} />
          <div>{`Rating count - ${post.ratingCount}`}</div>
        </div>
      );
    }
  };

  private mapMultiItem = (items: string[], type: string) => {
    const { post } = this.props;

    if (!items || !post) {
      return null;
    }

    return items.map((item, index) => {
      return (
        <span className="post-show-item-item" key={`${post._id}_${type}_${index}`}>
          {item}
        </span>
      );
    });
  };

  public render() {
    const { post, isLoading } = this.props;

    if (isLoading) {
      return (
        <div>
          <Loader active />
        </div>
      );
    } else {
      const startDate = moment(post.startICODate).format("YYYY-MM-DD HH:mm Z");
      const endDate = moment(post.endICODate).format("YYYY-MM-DD HH:mm Z");

      return (
        <div className="post-show-container">
          <Container>
            {this.getHeader()}

            <Table size="large">
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="table-row-title" collapsing>
                    Fields (Category)
                  </Table.Cell>
                  <Table.Cell className="table-cell-content">{this.mapMultiItem(post.fields, "fields")}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="table-row-title" collapsing>
                    WhitePaper
                  </Table.Cell>
                  <Table.Cell className="table-cell-content">
                    <a href={post.whitePaperUrl} target="_blank">
                      WhitePaper
                    </a>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="table-row-title" collapsing>
                    ICO period
                  </Table.Cell>
                  <Table.Cell className="table-cell-content">{`${startDate} ~ ${endDate}`}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="table-row-title" collapsing>
                    Accept Currency
                  </Table.Cell>
                  <Table.Cell className="table-cell-content">
                    {this.mapMultiItem(post.acceptCurrency, "currency")}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="table-row-title" collapsing>
                    ICO Price
                  </Table.Cell>
                  <Table.Cell className="table-cell-content">{post.icoPrice}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="table-row-title" collapsing>
                    Bonus
                  </Table.Cell>
                  <Table.Cell className="table-cell-content">{post.bonus}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="table-row-title" collapsing>
                    Homepage
                  </Table.Cell>
                  <Table.Cell className="table-cell-content">
                    <a href={post.homepageUrl} target="_blank">
                      Homepage
                    </a>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="table-row-title" collapsing>
                    Token Distribution
                  </Table.Cell>
                  <Table.Cell className="table-cell-content">{post.tokenDistribution}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="table-row-title" collapsing>
                    Additional Information
                  </Table.Cell>
                  <Table.Cell className="table-cell-content">{post.content}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Container>
        </div>
      );
    }
  }
}

const PostShowContainer = withTracker((props: IPostShowProps) => {
  if (props.match.params.postId) {
    const postId = props.match.params.postId;
    const currentUser = Meteor.user();
    const isLoggingIn = Meteor.loggingIn();
    // TODO: handle below count with infinite scroll
    const postsHandle = Meteor.subscribe("post", postId);
    const isLoading = !postsHandle.ready();
    const post = Post.findOne();

    return {
      isLoading,
      post,
      currentUser,
      isLoggingIn,
    };
  }
})(PostShow);

export default PostShowContainer;

import * as React from "react";
import * as moment from "moment";
import { Container, Header, Form } from "semantic-ui-react";
import { connect, DispatchProp } from "react-redux";
import * as DatePicker from "react-datepicker";
import { push } from "react-router-redux";
import { Meteor } from "meteor/meteor";
import { Post } from "../../../both/model/post";
import { IPostParamsInterface } from "../../../server/methods/post";
const { withTracker } = require("meteor/react-meteor-data");

interface ICreatePostParams extends DispatchProp<any> {
  currentUser: any;
  isLoggingIn: boolean;
}

interface ICreatePostState {
  title: string;
  content: string;
  currency: string;
  price: string;
  bonus: string;
  homepageAddress: string;
  whitepaperAddress: string;
  tokenDistribution: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
}

class CreatePost extends React.PureComponent<ICreatePostParams, ICreatePostState> {
  public state = {
    title: "",
    content: "",
    currency: "",
    price: "",
    bonus: "",
    homepageAddress: "",
    whitepaperAddress: "",
    tokenDistribution: "",
    startDate: moment(),
    endDate: moment(),
  };

  private preventSubmit = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  private handleDateChange(field: string, date: moment.Moment) {
    switch (field) {
      case "startDate": {
        this.setState({
          startDate: date,
        });
        break;
      }

      case "endDate": {
        this.setState({
          endDate: date,
        });
        break;
      }
    }
  }

  private handleInputChange = (type: string, e: any) => {
    const content = e.currentTarget.value;

    switch (type) {
      case "currency": {
        this.setState({
          currency: content,
        });
        break;
      }

      case "homepageAddress": {
        this.setState({
          homepageAddress: content,
        });
        break;
      }

      case "tokenDistribution": {
        this.setState({
          tokenDistribution: content,
        });
        break;
      }

      case "price": {
        this.setState({
          price: content,
        });
        break;
      }

      case "title": {
        this.setState({
          title: content,
        });
        break;
      }

      case "whitepaperAddress": {
        this.setState({
          whitepaperAddress: content,
        });
        break;
      }

      case "bonus": {
        this.setState({
          bonus: content,
        });
        break;
      }

      case "content": {
        this.setState({
          content,
        });
        break;
      }

      default: {
      }
    }
  };

  private handleSubmitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { currentUser, dispatch } = this.props;
    const {
      title,
      content,
      currency,
      price,
      bonus,
      homepageAddress,
      whitepaperAddress,
      tokenDistribution,
      startDate,
      endDate,
    } = this.state;

    if (!currentUser) {
      // TODO: Open Sign up dialog
      return;
    }

    const post = new Post();
    const postParams: IPostParamsInterface = {
      title,
      content,
      acceptCurrency: currency.replace(/\s+/g, "").split(","),
      icoPrice: price,
      bonus,
      homepageUrl: homepageAddress,
      whitePaperUrl: whitepaperAddress,
      tokenDistribution: tokenDistribution,
      startICODate: startDate.toDate(),
      endICODate: endDate.toDate(),
      userId: currentUser._id,
    };

    post.callMethod("savePost", postParams, (err: Error, postId: string) => {
      if (err) {
        alert(err);
      } else {
        this.setState({
          title: "",
          content: "",
        });
        dispatch(push(`/posts/${postId}`));
      }
    });
  };

  public render() {
    const {
      title,
      content,
      homepageAddress,
      currency,
      price,
      tokenDistribution,
      whitepaperAddress,
      bonus,
    } = this.state;

    return (
      <Container text>
        <Header as="h1">New ICO / WhitePaper</Header>
        <Form onSubmit={this.handleSubmitPost}>
          <Form.Field>
            <label>Title</label>
            <Form.Input
              placeholder="Title"
              value={title}
              onKeyPress={this.preventSubmit}
              onChange={(e: any) => {
                this.handleInputChange("title", e);
              }}
            />
          </Form.Field>
          <Form.Field className="new-post-date-selector">
            <label>ICO period</label>
            <div className="new-post-date-box">
              <label>Start Date</label>
              <DatePicker
                placeholderText="Start Date"
                selected={this.state.startDate}
                onChange={(date: moment.Moment) => {
                  this.handleDateChange("startDate", date);
                }}
              />
            </div>
            <div className="new-post-date-box">
              <label>End Date</label>
              <DatePicker
                placeholderText="End Date"
                selected={this.state.endDate}
                onChange={(date: moment.Moment) => {
                  this.handleDateChange("endDate", date);
                }}
              />
            </div>
          </Form.Field>
          <Form.Field>
            <label>Homepage Address</label>
            <Form.Input
              placeholder="Please insert Homepage address(ex: https://www.papers.com)"
              value={homepageAddress}
              onKeyPress={this.preventSubmit}
              onChange={(e: any) => {
                this.handleInputChange("homepageAddress", e);
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Accept Currency</label>
            <Form.Input
              placeholder="Please insert currency separate by comma(ex: BTC, ETH, BCH)"
              value={currency}
              onKeyPress={this.preventSubmit}
              onChange={(e: any) => {
                this.handleInputChange("currency", e);
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>ICO Price</label>
            <Form.Input
              placeholder="Please insert ICO price"
              value={price}
              onKeyPress={this.preventSubmit}
              onChange={(e: any) => {
                this.handleInputChange("price", e);
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.TextArea
              label="Token Distribution"
              placeholder="Please insert Token Distribution information"
              value={tokenDistribution}
              onChange={(e: any) => {
                this.handleInputChange("tokenDistribution", e);
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>WhitePaper Address(Optional)</label>
            <Form.Input
              placeholder="Please insert WhitePaper address(ex: https://papers.whitepaper.pdf)"
              value={whitepaperAddress}
              onKeyPress={this.preventSubmit}
              onChange={(e: any) => {
                this.handleInputChange("whitepaperAddress", e);
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Bonus Token(Optional)</label>
            <Form.Input
              placeholder="Please insert bonus token information"
              value={bonus}
              onKeyPress={this.preventSubmit}
              onChange={(e: any) => {
                this.handleInputChange("bonus", e);
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.TextArea
              label="Additional Information (optional)"
              placeholder="Please insert additional information"
              value={content}
              onChange={(e: any) => {
                this.handleInputChange("content", e);
              }}
            />
          </Form.Field>
          <button type="submit" style={{ margin: 12 }}>
            Submit
          </button>
        </Form>
      </Container>
    );
  }
}

const CreatePostContainer = withTracker(() => {
  const currentUser = Meteor.user();
  const isLoggingIn = Meteor.loggingIn();

  return {
    currentUser,
    isLoggingIn,
  };
})(connect()(CreatePost));

export default CreatePostContainer;

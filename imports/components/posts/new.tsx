import * as React from "react";
import * as moment from "moment";
import { Container, Header, Form, Button } from "semantic-ui-react";
import { connect, DispatchProp, Dispatch } from "react-redux";
import { Meteor } from "meteor/meteor";
import { Post } from "../../../both/model/post";
import { IPostParamsInterface } from "../../../server/methods/post";
import { GLOBAL_DIALOGS } from "../../reducers/globalDialog";
import { openDialog } from "../../actions/globalDialog";
import AfterCreatePost from "./components/afterCreatePost";
const { withTracker } = require("meteor/react-meteor-data");
const DatePicker = require("react-datepicker");

interface ICreatePostParams extends DispatchProp<any> {
  currentUser: any;
  isLoggingIn: boolean;
}

interface ICreatePostState {
  title: string; // Company name
  content: string; // Description
  logoUrl: string; // Logo url
  homepageAddress: string; // home page link
  whitepaperAddress: string; // Whitepaper link
  fields: string; // Business fields
  links: string; // links
  startDate: moment.Moment;
  endDate: moment.Moment;
  succeededToCreate: boolean;
}

class CreatePost extends React.PureComponent<ICreatePostParams, ICreatePostState> {
  public state = {
    title: "",
    content: "",
    logoUrl: "",
    homepageAddress: "",
    whitepaperAddress: "",
    fields: "",
    links: "",
    startDate: moment(),
    endDate: moment(),
    succeededToCreate: false,
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
      case "homepageAddress": {
        this.setState({
          homepageAddress: content,
        });
        break;
      }

      case "logoUrl": {
        this.setState({
          logoUrl: content,
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

      case "links": {
        this.setState({
          links: content,
        });
        break;
      }

      case "fields": {
        this.setState({
          fields: content,
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
    const { dispatch, currentUser } = this.props;
    const {
      title,
      content,
      logoUrl,
      homepageAddress,
      whitepaperAddress,
      fields,
      links,
      startDate,
      endDate,
    } = this.state;

    if (!currentUser) {
      return (dispatch as Dispatch<any>)(openDialog(GLOBAL_DIALOGS.SIGN_UP));
    }

    const post = new Post();
    const postParams: IPostParamsInterface = {
      title,
      content,
      logoUrl,
      links: links.replace(/\s+/g, "").split(","),
      fields: fields.replace(/\s+/g, "").split(","),
      homepageUrl: homepageAddress,
      whitePaperUrl: whitepaperAddress,
      startICODate: startDate.toDate(),
      endICODate: endDate.toDate(),
    };

    post.callMethod("savePost", postParams, (err: Error, _postId: string) => {
      if (err) {
        alert(err);
      } else {
        this.setState({
          succeededToCreate: true,
        });
      }
    });
  };

  public render() {
    const {
      title,
      content,
      homepageAddress,
      whitepaperAddress,
      links,
      fields,
      logoUrl,
      succeededToCreate,
    } = this.state;
    const { currentUser } = this.props;

    if (!succeededToCreate && currentUser) {
      return <AfterCreatePost currentUser={currentUser} />;
    }

    return (
      <div className="post-new-component-container">
        <Container>
          <Header as="h1">New WhitePaper</Header>
          <Form onSubmit={this.handleSubmitPost}>
            <Form.Field>
              <label>Company</label>
              <Form.Input
                placeholder="Company"
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
              <label>Logo URL</label>
              <Form.Input
                placeholder="Please insert LogoURL"
                value={logoUrl}
                onKeyPress={this.preventSubmit}
                onChange={(e: any) => {
                  this.handleInputChange("logoUrl", e);
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Homepage Address</label>
              <Form.Input
                placeholder="Please insert Homepage address(ex: https://paperating.pluto.network)"
                value={homepageAddress}
                onKeyPress={this.preventSubmit}
                onChange={(e: any) => {
                  this.handleInputChange("homepageAddress", e);
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Fields(Optional)</label>
              <Form.Input
                placeholder="Please insert business fields separate by comma(ex: science, bio, medicine)"
                value={fields}
                onKeyPress={this.preventSubmit}
                onChange={(e: any) => {
                  this.handleInputChange("fields", e);
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>Links(Optional)</label>
              <Form.Input
                placeholder="Please insert social links separate by comma(ex: https://www.facebook.com/PlutoNetwork, https://https://pluto.network)"
                value={links}
                onKeyPress={this.preventSubmit}
                onChange={(e: any) => {
                  this.handleInputChange("links", e);
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>WhitePaper Address</label>
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
              <Form.TextArea
                label="Description"
                placeholder="Please insert description"
                value={content}
                onChange={(e: any) => {
                  this.handleInputChange("content", e);
                }}
              />
            </Form.Field>
            <Button type="submit" style={{ margin: 12 }} content="Submit" />
          </Form>
        </Container>
      </div>
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

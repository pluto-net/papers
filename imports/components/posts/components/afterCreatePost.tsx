import * as React from "react";
import { Container, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";

interface IAfterCreatePost {
  currentUser: any;
}

const AfterCreatePost = (props: IAfterCreatePost) => {
  return (
    <div className="after-create-post-wrapper">
      <Container textAlign="center">
        <Header as="h1" size="huge" style={{ marginBottom: 20 }}>
          You almost done!
          <Header.Subheader>Please wait until we confirming your ICO & WhitePaper details.</Header.Subheader>
        </Header>
        <div>We will send you email({props.currentUser.emails[0].address}) after we confirming your ICO.</div>
        <div style={{ marginBottom: 10 }}>
          {"If you have something to change or need help, just "}
          <a href="mailto:help@pluto.network">contact</a> us.
        </div>
        <Link style={{ fontSize: "18px" }} to="/">
          Go back to the recent ICO list
        </Link>
      </Container>
    </div>
  );
};

export default AfterCreatePost;

import * as React from "react";
import { Meteor } from "meteor/meteor";
import { Button, Icon } from 'semantic-ui-react';

interface ITwitterButtonProps {
  afterSignInCallback: () => void;
}

const handleSignInWithTwitter = (props: ITwitterButtonProps) => {
  Meteor.loginWithTwitter({
    redirectUrl: window.location.href,
  },
    (err: Error) => {
      if (err) {
        alert(err);
      } else {
        props.afterSignInCallback();
      }
    },
  );
};

const TwitterButton = (props: ITwitterButtonProps) => {
  return (
    <Button color="twitter" onClick={() => { handleSignInWithTwitter(props) }} fluid>
      <Icon name='twitter' /> Login with Twitter
    </Button>
  );
};

export default TwitterButton;

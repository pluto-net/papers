import * as React from "react";
import { Meteor } from "meteor/meteor";
import { Button, Icon } from 'semantic-ui-react';

interface IGoogleButtonProps {
  afterSignInCallback: () => void;
}

const handleSignInWithGoogle = (props: IGoogleButtonProps) => {
  Meteor.loginWithGoogle({
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

const GoogleButton = (props: IGoogleButtonProps) => {
  return (
    <Button color="google plus" onClick={() => { handleSignInWithGoogle(props) }} fluid>
      <Icon name='google' /> Login with Google
    </Button>
  );
};

export default GoogleButton;

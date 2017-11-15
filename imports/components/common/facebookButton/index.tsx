import * as React from "react";
import { Meteor } from "meteor/meteor";
import { Button } from "semantic-ui-react";

const handleSignInWithFacebook = () => {
  Meteor.loginWithFacebook(
    {
      requestPermissions: ["user_friends", "public_profile", "email"],
    },
    (err: Error) => {
      if (err) {
        alert(err);
      } else {
        console.log("Succeed to Login");
      }
    },
  );
};

const FacebookButton = () => {
  return (
    <Button onClick={handleSignInWithFacebook} color="facebook" fluid>
      Login With Facebook
    </Button>
  );
};

export default FacebookButton;

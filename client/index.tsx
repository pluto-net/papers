import { Meteor } from "meteor/meteor";
import * as React from "react";
import { render } from "react-dom";
import RootRoute from "../imports/routes";

// TODO: Remove below after making sign up / in process
Meteor.subscribe("users");

Meteor.startup(() => {
  render(<RootRoute />, document.getElementById("react-app"));
});

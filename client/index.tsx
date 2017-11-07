import { Meteor } from "meteor/meteor";
import * as React from "react";
import { render } from "react-dom";
import RootRoute from "../imports/routes";

Meteor.startup(() => {
  render(<RootRoute />, document.getElementById("react-app"));
});

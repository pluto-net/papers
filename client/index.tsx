import { Meteor } from "meteor/meteor";
import * as ReactGA from "react-ga";
import * as React from "react";
import { render } from "react-dom";
import RootRoute from "../imports/routes";
import EnvChecker from "../imports/helpers/envChecker";

Meteor.startup(() => {
  render(<RootRoute />, document.getElementById("react-app"));

  if (!EnvChecker.isDev()) {
    ReactGA.initialize("UA-109758926-1");
    ReactGA.pageview(window.location.pathname + window.location.search);

    Accounts.onLogin(() => {
      ReactGA.set({ userId: Meteor.userId() });
    });
  }
});

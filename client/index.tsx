import { Meteor } from "meteor/meteor";
import * as ReactGA from "react-ga";
import * as React from "react";
import { render } from "react-dom";
import RootRoute from "../imports/routes";
import EnvChecker from "../imports/helpers/envChecker";
const Web3 = require("web3");
declare var web3: any;

Meteor.startup(() => {
  render(<RootRoute />, document.getElementById("react-app"));
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== "undefined") {
    // Use Mist/MetaMask's provider
    (window as any).web3 = new Web3(web3.currentProvider);
  } else {
    (window as any).web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  if (!EnvChecker.isDev()) {
    ReactGA.initialize("UA-109758926-1");
    ReactGA.pageview(window.location.pathname + window.location.search);

    Accounts.onLogin(() => {
      ReactGA.set({ userId: Meteor.userId() });
    });
  }
});

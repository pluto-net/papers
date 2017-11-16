import ReactGA from "react-ga";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import EnvChecker from "../imports/helpers/envChecker";

if (!EnvChecker.isDev()) {
  ReactGA.initialize("UA-109758926-1");
  ReactGA.pageview(window.location.pathname + window.location.search);

  Accounts.onLogin(params => {
    ReactGA.set({ userId: Meteor.userId() });
  });
}

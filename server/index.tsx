import { Meteor } from "meteor/meteor";
// TODO: Remove below after making sign up / in process
Meteor.publish("users", () => {
  return Meteor.users.find();
});

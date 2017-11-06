import { Meteor } from "meteor/meteor";
import { Post } from "../both/model/post";

// TODO: Remove below after making sign up / in process
Meteor.publish("users", () => {
  return Meteor.users.find();
});

Meteor.publish("posts", function(limit: number) {
  const options = {
    sort: { publishedAt: -1 },
    limit,
  };

  return Post.find({}, options);
});

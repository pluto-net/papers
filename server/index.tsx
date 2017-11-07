import { Meteor } from "meteor/meteor";
import { Post } from "../both/model/post";

Meteor.publish("posts", function(limit: number) {
  const options = {
    sort: { publishedAt: -1 },
    limit,
  };

  return Post.find({}, options);
});

Meteor.publish("post", function(id: string) {
  return Post.find(id);
});

Meteor.publish("user", function(id: string) {
  return Meteor.users.find(id, {
    fields: { services: 0 },
    transform: null,
  });
});

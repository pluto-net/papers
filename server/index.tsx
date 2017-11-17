import { Meteor } from "meteor/meteor";
import { Post } from "../both/model/post";
import { Rating } from "../both/model/rating";
import { Comment } from "../both/model/comment";

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

Meteor.publish("bestPosts", function(limit: number) {
  return Post.find({}, { sort: { averageRating: -1 }, limit });
});

Meteor.publish("user", function(id: string) {
  return Meteor.users.find(id, {
    fields: { services: 0 },
    transform: null,
  });
});

Meteor.publish("users", function(ids: string[]) {
  return Meteor.users.find({ _id: { $in: ids } });
});

Meteor.publish("myRating", function(postId: string, userId: string) {
  return Rating.find({ postId, userId });
});

Meteor.publish("comments", function(postId: string, limit: number) {
  const options = {
    sort: { publishedAt: -1 },
    limit,
  };

  return Comment.find({ postId }, options);
});

import { Meteor } from "meteor/meteor";
import { Post } from "../both/model/post";
import { Rating } from "../both/model/rating";
import { Comment } from "../both/model/comment";

Meteor.publish("posts", function(options?: object, findString?: string) {
  const basicOptions = {
    sort: { publishedAt: -1 },
    limit: 50,
  };

  let finalOptions;
  if (options) {
    finalOptions = options;
  } else {
    finalOptions = basicOptions;
  }
  if (findString) {
    const searchTerm = new RegExp(findString, "ig");
    return Post.find({ title: { $regex: searchTerm }, published: true }, finalOptions);
  } else {
    return Post.find({published: true}, finalOptions);
  }
});

Meteor.publish("unpublishedPosts", function() {
    return Post.find({published: false});
});

Meteor.publish("post", function(id: string) {
  return Post.find(id);
});

Meteor.publish("bestPosts", function(limit: number) {
  const date = new Date();
  return Post.find({ endICODate: { $gte: date } }, { sort: { ratingCount: -1, averageRating: -1 }, limit });
});

Meteor.publish("closeToEndPosts", function(limit: number) {
  const date = new Date();
  return Post.find({ endICODate: { $gte: date } }, { sort: { endICODate: 1 }, limit });
});

Meteor.publish("manyViewCountPosts", function(limit: number) {
  const date = new Date();
  return Post.find({ endICODate: { $gte: date } }, { sort: { viewCount: -1 }, limit });
});

Meteor.publish("manyCommentsPosts", function(limit: number) {
  const date = new Date();
  return Post.find({ endICODate: { $gte: date } }, { sort: { commentCount: -1 }, limit });
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

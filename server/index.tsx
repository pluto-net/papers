import { Meteor } from "meteor/meteor";
import { Post } from "../both/model/post";
import { Rating } from "../both/model/rating";
import { Comment } from "../both/model/comment";

declare var Counter: any;

Meteor.publish("posts", function(options?: object, findString?: string) {
  const basicOptions = {
    sort: { publishedAt: -1 },
    disableOplog: true,
    limit: 5,
  };

  let finalOptions;
  if (options) {
    finalOptions = { ...basicOptions, ...options };
  } else {
    finalOptions = basicOptions;
  }

  if (findString) {
    const searchTerm = new RegExp(findString, "ig");
    return Post.find({ title: { $regex: searchTerm }, published: true }, finalOptions);
  } else {
    return Post.find({ published: true }, finalOptions);
  }
});

Meteor.publish("unpublishedPosts", function() {
  return Post.find({ published: false });
});

Meteor.publish("post", function(id: string) {
  return Post.find({ _id: id }, { disableOplog: true });
});

Meteor.publish("fullPostCount", function() {
  return new Counter(
    "fullPostCount",
    Post.find(
      {
        published: true,
      },
      { disableOplog: true },
    ),
  );
});

Meteor.publish("bestPosts", function(limit: number) {
  const date = new Date();
  return Post.find(
    { published: true, endICODate: { $gte: date } },
    { sort: { ratingCount: -1, averageRating: -1 }, limit, disableOplog: true },
  );
});

Meteor.publish("closeToEndPosts", function(limit: number) {
  const date = new Date();
  return Post.find(
    { published: true, endICODate: { $gte: date } },
    { sort: { endICODate: 1 }, limit, disableOplog: true },
  );
});

Meteor.publish("manyViewCountPosts", function(limit: number) {
  const date = new Date();
  return Post.find(
    { published: true, endICODate: { $gte: date } },
    { sort: { viewCount: -1 }, limit, disableOplog: true },
  );
});

Meteor.publish("manyCommentsPosts", function(limit: number) {
  const date = new Date();
  return Post.find(
    { published: true, endICODate: { $gte: date } },
    { sort: { commentCount: -1 }, limit, disableOplog: true },
  );
});

Meteor.publish("user", function(id: string) {
  return Meteor.users.find(id, {
    fields: { services: 0 },
  });
});

Meteor.publish("users", function(ids: string[]) {
  return Meteor.users.find({ _id: { $in: ids } });
});

Meteor.publish("myRating", function(postId: string) {
  return Rating.find({ postId, userId: Meteor.userId() });
});

Meteor.publish("comments", function(postId: string, limit: number) {
  const options = {
    sort: { publishedAt: -1 },
    limit,
  };

  return Comment.find({ postId }, options);
});

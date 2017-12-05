import { Meteor } from "meteor/meteor";
import { Post } from "../both/model/post";
import { Rating } from "../both/model/rating";
import { Comment } from "../both/model/comment";

declare var Counter: any;

Meteor.publish("posts", function(filterOptions: object, subscribeOptions: object) {
  const defaultFilterOption = {
    published: true,
  };
  const finalFilterOption = { ...defaultFilterOption, ...filterOptions };

  const defaultSubscribeOptions = {
    disableOplog: true,
  };

  const finalSubscribeOptions = {
    ...defaultSubscribeOptions,
    ...subscribeOptions,
  };

  return Post.find(finalFilterOption, finalSubscribeOptions);
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

Meteor.publish("ratingsFromPostIdAndUserIds", function(postId: string, userIds: string[]) {
  return Rating.find({ postId, userId: { $in: userIds } });
});

Meteor.publish("comments", function(postId: string) {
  const options = {
    sort: { publishedAt: -1 },
    disableOplog: true,
  };

  return Comment.find({ postId }, options);
});

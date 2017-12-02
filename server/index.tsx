import { Meteor } from "meteor/meteor";
import { Post } from "../both/model/post";
import { Rating } from "../both/model/rating";
import { Comment } from "../both/model/comment";

declare var Counter: any;

Meteor.publish("posts", function(filterOptions: any) {
  const defaultFilterOption = {
    published: true,
  };
  const finalFilterOption = { ...defaultFilterOption, ...filterOptions };
  return Post.find(finalFilterOption, { limit: 20, disableOplog: true });
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

Meteor.publish("comments", function(postId: string, limit: number) {
  const options = {
    sort: { publishedAt: -1 },
    limit,
  };

  return Comment.find({ postId }, options);
});

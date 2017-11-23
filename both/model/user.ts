const { Class } = require("meteor/jagi:astronomy");
// var user = new User();
// user.save({
//   simulation: false // Insert only on the server.
// });

// server.js
// Meteor.publish('posts', function() {
//   Post.find({}, {fields: {title: 1}});
// });

// bad_client.js
// Meteor.subscribe('posts');
// const post = Post.findOne();
// post.name = 'New name';
// post.getModifier(); // {$set: {name: 'New name', tags: []}} - it will override tags
// post.save();

// good_client.js
// Meteor.subscribe('posts');
// const post = Post.findOne({}, {defaults: false});
// post.name = 'New name';
// post.getModifier(); // {$set: {name: 'New name'}} - it will not override tags
// post.save();

const UserProfile = Class.create({
  name: "UserProfile",
  fields: {
    username: String,
    profileImagePublicId: {
      type: String,
      optional: true,
    },
    /* Any other fields you want to be published to the client */
  },
});

export const User = Class.create({
  name: "User",
  collection: Meteor.users,
  fields: {
    createdAt: Date,
    username: String,
    emails: {
      type: [Object],
      default: (): string[] => {
        return [];
      },
    },
    admin: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    profile: {
      type: UserProfile,
      default: () => {
        return {
          username: "",
          profileImagePublicId: "",
        };
      },
    },
  },
  events: {
    beforeSave(e: any) {
      if (e.currentTarget && e.currentTarget.profile) {
        e.currentTarget.profile.username = e.currentTarget.username;
      }
    },
  },
});

if (Meteor.isServer) {
  User.extend({
    fields: {
      services: Object,
    },
  });
}

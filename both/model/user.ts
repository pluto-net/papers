const { Class } = require("meteor/jagi:astronomy");

// {
//   "_id" : "gfK6bd5rDBpW68GRC",
//   "createdAt" : ISODate("2017-11-05T08:08:24.411Z"),
//   "services" : {
//       "password" : {
//           "bcrypt" : "$2a$10$tJBQPkKr.g7WzwIfj4c5I.1ffO0BB26RmgMRZJzpdZ5HFVpCKdo5C"
//       },

//       "resume" : {
//           "loginTokens" : [
//               {
//                   "when" : ISODate("2017-11-05T08:08:24.441Z"),
//                   "hashedToken" : "f8Z7tRDRqcqW0EbuW1dpY/IotVNYqfVg7tDn8TgitRI="
//               },
//               {
//                   "when" : ISODate("2017-11-06T01:33:14.329Z"),
//                   "hashedToken" : "V0AWfzmqMU9/WV2jwG56zNEoEpsuyppN1djtozNGBE0="
//               }
//           ]
//       }
//   },
//   "username" : "Tylor Shin",
//   "emails" : [
//       {
//           "address" : "sshinmir@naver.com",
//           "verified" : false
//       }
//   ]
// }

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
    /* Any other fields you want to be published to the client */
  },
});

const User = Class.create({
  name: "User",
  collection: Meteor.users,
  fields: {
    createdAt: Date,
    emails: {
      type: [Object],
      default: (): string[] => {
        return [];
      },
    },
    profile: {
      type: UserProfile,
      default: () => {
        return {};
      },
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

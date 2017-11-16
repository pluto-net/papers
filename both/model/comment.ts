import { Mongo } from "meteor/mongo";
const { Class } = require("meteor/jagi:astronomy");

const Comments = new Mongo.Collection("comments");

export const Comment = Class.create({
  name: "Comment",
  collection: Comments,
  fields: {
    content: {
      type: String,
      validators: [
        {
          type: "minLength",
          param: 1,
        },
        {
          type: "maxLength",
          param: 3000,
        },
      ],
    },
    postId: {
      type: String,
      index: 1,
    },
    userId: {
      type: String,
      index: 1,
    },
    publishedAt: {
      type: Date,
      default: function() {
        return new Date();
      },
    },
    updatedAt: {
      type: Date,
      default: function() {
        return new Date();
      },
    },
  },
});

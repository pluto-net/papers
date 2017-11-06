import { Mongo } from "meteor/mongo";
const { Class } = require("meteor/jagi:astronomy");

const Posts = new Mongo.Collection("posts");

export const Post = Class.create({
  name: "Post",
  collection: Posts,
  fields: {
    title: {
      type: String,
      validators: [
        {
          type: "minLength",
          param: 3,
        },
        {
          type: "maxLength",
          param: 50,
        },
      ],
    },
    content: {
      type: String,
      validators: [
        {
          type: "minLength",
          param: 3,
        },
        {
          type: "maxLength",
          param: 50,
        },
      ],
    },
    userId: String,
    publishedAt: {
      type: Date,
      default: function() {
        return new Date();
      },
    },
  },
});

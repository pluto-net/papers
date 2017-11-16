import { Mongo } from "meteor/mongo";
const { Class } = require("meteor/jagi:astronomy");

const Ratings = new Mongo.Collection("ratings");

export const Comment = Class.create({
  name: "Rating",
  collection: Ratings,
  fields: {
    rating: {
      type: Number,
      validators: [
        {
          type: "gte",
          param: 0,
        },
        {
          type: "lte",
          param: 5,
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

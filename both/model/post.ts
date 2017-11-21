import { Mongo } from "meteor/mongo";
const { Class } = require("meteor/jagi:astronomy");

const Posts = new Mongo.Collection("posts");

export const Post = Class.create({
  name: "Post",
  collection: Posts,
  fields: {
    title: {
      type: String,
      index: "text",
      validators: [
        {
          type: "minLength",
          param: 1,
        },
        {
          type: "maxLength",
          param: 50,
        },
      ],
    },
    homepageUrl: {
      type: String,
      validators: [
        {
          type: "minLength",
          param: 3,
        },
        {
          type: "maxLength",
          param: 300,
        },
      ],
    },
    startICODate: {
      type: Date,
    },
    endICODate: {
      type: Date,
    },
    acceptCurrency: {
      type: [String],
    },
    icoPrice: {
      type: String,
    },
    tokenDistribution: {
      type: String,
    },
    // optional fields
    logoUrl: {
      type: String,
      optional: true,
    },
    whitePaperUrl: {
      type: String,
      optional: true,
    },
    content: {
      type: String,
      optional: true,
    },
    bonus: {
      type: String,
      optional: true,
    },
    fields: {
      type: [String],
      optional: true,
    },
    // auto-completed fields
    commentCount: {
      type: Number,
      default: function() {
        return 0;
      },
    },
    viewCount: {
      type: Number,
      default: function() {
        return 0;
      },
    },
    ratingCount: {
      type: Number,
      default: function() {
        return 0;
      },
    },
    averageRating: {
      type: Number,
      default: function() {
        return 0;
      },
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

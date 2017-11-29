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
          param: 150,
        },
      ],
    },
    homepageUrl: {
      type: String,
      validators: [
        {
          type: "minLength",
          param: 0,
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
    links: {
      type: [String],
      optional: true,
    },
    bountyCampaign: {
      type: String,
      optional: true,
    },
    escrow: {
      type: String,
      optional: true,
    },
    // auto-completed fields
    published: {
      type: Boolean,
      default: function() {
        return false;
      },
    },
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
      index: 1,
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

import { Mongo } from "meteor/mongo";
import { IModelClassInstance } from "./astronomy";
const { Class } = require("meteor/jagi:astronomy");

export const Posts = new Mongo.Collection("posts");

export interface IPost extends IModelClassInstance {
  _id: string;
  title: string;
  homepageUrl: string;
  startICODate: Date;
  endICODate: Date;
  logoUrl: string;
  content: string;
  whitePaperUrl: string;
  // optional fields
  fields?: string[];
  links?: string[];
  // deprecated fields
  bonus?: string;
  bountyCampaign?: string;
  escrow?: string;
  acceptCurrency: string[];
  icoPrice: string;
  tokenDistribution: string;
  facebookUrl?: string;
  twitterUrl?: string;
  redditUrl?: string;
  githubUrl?: string;
  slackUrl?: string;
  telegramUrl?: string;
  mediumUrl?: string;
  linkedinUrl?: string;
  founded?: string;
  technicalDetails?: string;
  // auto-completed fields
  published: boolean;
  commentCount: number;
  viewCount: number;
  ratingCount: number;
  averageRating: number;
  userId: string;
  publishedAt: Date;
  updatedAt: Date;
}

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

    logoUrl: {
      type: String,
      default: "",
    },
    whitePaperUrl: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    startICODate: {
      type: Date,
    },
    endICODate: {
      type: Date,
    },

    fields: {
      type: [String],
      optional: true,
    },
    links: {
      type: [String],
      optional: true,
    },
    bonus: {
      type: String,
      optional: true,
    },
    bountyCampaign: {
      type: String,
      optional: true,
    },
    facebookUrl: {
      type: String,
      optional: true,
    },
    twitterUrl: {
      type: String,
      optional: true,
    },
    redditUrl: {
      type: String,
      optional: true,
    },
    githubUrl: {
      type: String,
      optional: true,
    },
    slackUrl: {
      type: String,
      optional: true,
    },
    telegramUrl: {
      type: String,
      optional: true,
    },
    mediumUrl: {
      type: String,
      optional: true,
    },
    linkedinUrl: {
      type: String,
      optional: true,
    },
    acceptCurrency: {
      type: [String],
      optional: true,
    },
    icoPrice: {
      type: String,
      optional: true,
    },
    tokenDistribution: {
      type: String,
      optional: true,
    },
    escrow: {
      type: String,
      optional: true,
    },
    founded: {
      type: String,
      optional: true,
    },
    technicalDetails: {
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
  // events: {
  //   beforeSave(e) {
  //     const doc = e.currentTarget;
  //   }
  // }
});

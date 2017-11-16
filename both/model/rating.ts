import { Mongo } from "meteor/mongo";
import { Post } from "./post";
const { Class } = require("meteor/jagi:astronomy");

const Ratings = new Mongo.Collection("ratings");

export const Rating = Class.create({
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
    },
    userId: {
      type: String,
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
  indexes: {
    userIdAndPost: {
      // Index name.
      fields: {
        // List of fields.
        userId: 1,
        postId: 1,
      },
      options: {
        unique: true,
      }, // Mongo index options.
    },
  },
  events: {
    afterInsert(e: any) {
      if (e.currentTarget) {
        const { postId, rating } = e.currentTarget;
        const post = Post.findOne(postId);
        const { ratingCount, averageRating } = post;
        const ratings = Rating.find({ postId });
        const newRatingCount = ratings.count();
        const newRatingAverage = (averageRating * ratingCount + rating) / newRatingCount;

        post.callMethod(
          "updateRating",
          {
            ratingCount: newRatingCount,
            newRatingAverage: newRatingAverage,
          },
          (err: Error) => {
            if (err) {
              // TODO: Add server side error tracking tool
              console.error(err);
            }
          },
        );
      }
    },
  },
});

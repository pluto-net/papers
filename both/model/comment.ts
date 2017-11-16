import { Mongo } from "meteor/mongo";
import { Post } from "./post";
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
  indexes: {
    userIdAndPost: {
      // Index name.
      fields: {
        // List of fields.
        userId: 1,
        postId: 1,
      },
    },
  },
  events: {
    afterSave(e: any) {
      if (e.currentTarget) {
        const { postId } = e.currentTarget;
        const commentCount = Comment.find({ postId }).count();
        const post = Post.findOne(postId);

        post.callMethod("updateCommentCount", commentCount, (err: Error) => {
          if (err) {
            // TODO: Add server side error tracking tool
            console.error(err);
          }
        });
      }
    },
  },
  afterRemove(e: any) {
    if (e.currentTarget) {
      const { postId } = e.currentTarget;
      const commentCount = Comment.find({ postId }).count();
      const post = Post.findOne(postId);

      post.callMethod("updateCommentCount", commentCount, (err: Error) => {
        if (err) {
          // TODO: Add server side error tracking tool
          console.error(err);
        }
      });
    }
  },
});

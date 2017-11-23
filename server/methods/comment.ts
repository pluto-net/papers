import { Comment } from "../../both/model/comment";

export interface IPostCommentParams {
  content: string;
  postId: string;
}

Comment.extend({
  meteorMethods: {
    postComment({ content, postId }: IPostCommentParams) {
      this.content = content;
      this.userId = Meteor.userId();
      this.postId = postId;

      return this.save();
    },
  },
});

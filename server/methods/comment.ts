import { Comment } from "../../both/model/comment";

export interface IPostCommentParams {
  content: string;
  userId: string;
  postId: string;
}

Comment.extend({
  meteorMethods: {
    postComment({ content, userId, postId }: IPostCommentParams) {
      this.content = content;
      this.userId = userId;
      this.postId = postId;

      return this.save();
    },
  },
});

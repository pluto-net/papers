import { Post } from "../../both/model/post";

export interface IPostParamsInterface {
  title: string;
  content: string;
  userId: string;
}

Post.extend({
  meteorMethods: {
    savePost({ title, content, userId }: IPostParamsInterface) {
      this.title = title;
      this.content = content;
      this.userId = userId;

      return this.save();
    },
  },
});

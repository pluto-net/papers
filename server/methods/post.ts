import { Post } from "../../both/model/post";

Post.extend({
  meteorMethods: {
    savePost(title: string, content: string) {
      this.title = title;
      this.content = content;
      return this.save();
    },
  },
});

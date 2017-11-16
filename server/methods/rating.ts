import { Rating } from "../../both/model/rating";

export interface IPostRatingParams {
  rating: number;
  userId: string;
  postId: string;
}

Rating.extend({
  meteorMethods: {
    postRating({ rating, userId, postId }: IPostRatingParams) {
      this.rating = rating;
      this.userId = userId;
      this.postId = postId;

      return this.save();
    },
  },
});

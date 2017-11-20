import { Rating } from "../../both/model/rating";

export interface IPostRatingParams {
  rating: number;
  userId: string;
  postId: string;
}

Rating.extend({
  meteorMethods: {
    postRating({ rating, userId, postId }: IPostRatingParams) {
      const previousRating = Rating.findOne({ userId, postId });

      if (previousRating) {
        previousRating.rating = rating;
        return previousRating.save();
      } else {
        this.rating = rating;
        this.userId = userId;
        this.postId = postId;

        return this.save();
      }
    },
  },
});

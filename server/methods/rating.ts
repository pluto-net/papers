import { Rating } from "../../both/model/rating";

export interface IPostRatingParams {
  rating: number;
  postId: string;
}

Rating.extend({
  meteorMethods: {
    postRating({ rating, postId }: IPostRatingParams) {
      const userId = Meteor.userId();

      if (!userId) {
        throw new Error("Wrong user authentication");
      }

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

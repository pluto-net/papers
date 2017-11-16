import { Post } from "../../both/model/post";

export interface IPostParamsInterface {
  title: string;
  content: string;
  acceptCurrency: string[];
  fields: string[];
  icoPrice: string;
  bonus: string;
  homepageUrl: string;
  whitePaperUrl: string;
  tokenDistribution: string;
  startICODate: Date;
  endICODate: Date;
  userId: string;
}

interface IUpdateRatingProps {
  ratingCount: number;
  newRatingAverage: number;
}

Post.extend({
  meteorMethods: {
    updateViewCount() {
      if (!this.viewCount) {
        this.viewCount = 0;
      }
      this.viewCount += 1;
      return this.save();
    },
    updateCommentCount(count: number) {
      this.commentCount = count;

      return this.save();
    },
    updateRating({ ratingCount, newRatingAverage }: IUpdateRatingProps) {
      this.ratingCount = ratingCount;
      this.averageRating = newRatingAverage;

      return this.save();
    },
    savePost({
      title,
      content,
      acceptCurrency,
      icoPrice,
      bonus,
      fields,
      homepageUrl,
      whitePaperUrl,
      tokenDistribution,
      startICODate,
      endICODate,
      userId,
    }: IPostParamsInterface) {
      this.title = title;
      this.content = content;
      this.acceptCurrency = acceptCurrency;
      this.icoPrice = icoPrice;
      this.bonus = bonus;
      this.fields = fields;
      this.homepageUrl = homepageUrl;
      this.whitePaperUrl = whitePaperUrl;
      this.tokenDistribution = tokenDistribution;
      this.startICODate = startICODate;
      this.endICODate = endICODate;
      this.userId = userId;

      return this.save();
    },
  },
});

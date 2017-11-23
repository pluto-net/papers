// import { Email } from 'meteor/email'
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
}

interface IUpdateRatingProps {
  ratingCount: number;
  newRatingAverage: number;
}

Post.extend({
  meteorMethods: {
    changePublishState(post: any, email: string) {
      this.published = !this.published;
      if (this.published) {
        Email.send({
          to: email,
          from: "no-reply@pluto.network",
          subject: `Your ${post.title} ICO is now being alive!`,
          html: "<h1>congratulation!</h1> Your ICO article is on live now. Anyone can see your ICO article.",
        });
      }
      return this.save();
    },
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
      this.userId = Meteor.userId();

      return this.save();
    },
  },
});

import * as AWS from "aws-sdk";
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
        const ses = new AWS.SES({ apiVersion: "2010-12-01", region: "us-east-1" });
        const params = {
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: "<h1>congratulation!</h1> Your ICO article is on live now. Anyone can see your ICO article.",
              },
            },
            Subject: {
              Charset: "UTF-8",
              Data: `Your ${post.title} ICO is now being alive!`,
            },
          },
          Source: "no-reply@pluto.network",
        };

        ses.sendEmail(params, (err, _data) => {
          if (err) {
            console.error(err, err.stack);
          }
        });
        return this.save();
      }
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

import { Post } from "../../both/model/post";

export interface IPostParamsInterface {
  title: string;
  content: string;
  acceptCurrency: string[];
  icoPrice: string;
  bonus: string;
  homepageUrl: string;
  whitePaperUrl: string;
  tokenDistribution: string;
  startICODate: Date;
  endICODate: Date;
  userId: string;
}

Post.extend({
  meteorMethods: {
    savePost({
      title,
      content,
      acceptCurrency,
      icoPrice,
      bonus,
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

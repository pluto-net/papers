// import transform = require("lodash.transform");

interface ISortConditions {
  newest?: string;
  viewCount?: string;
  ratingCount?: string;
  rating?: string;
  commentCount?: string;
  closeToICOEnd?: string;
}

export interface ISortOptions {
  publishedAt?: 1 | -1;
  viewCount?: 1 | -1;
  ratingCount?: 1 | -1;
  averageRating?: 1 | -1;
  commentCount?: 1 | -1;
  endICODate?: 1 | -1;
}

export function mapSortOptionFromConditionObject(sortConditions: ISortConditions): ISortOptions {
  const sortOption: ISortOptions = {};

  if (sortConditions.newest) {
    sortOption.publishedAt = -1;
  }
  if (sortConditions.viewCount) {
    sortOption.viewCount = -1;
  }
  if (sortConditions.ratingCount) {
    sortOption.ratingCount = -1;
  }
  if (sortConditions.rating) {
    sortOption.averageRating = -1;
  }
  if (sortConditions.commentCount) {
    sortOption.commentCount = -1;
  }
  if (sortConditions.closeToICOEnd) {
    sortOption.endICODate = 1;
  }

  return sortOption;
}

import { IPost } from "../../both/model/post";

export function getWhitePaperAddress(post: IPost) {
  if (post.whitePaperUrl && post.whitePaperUrl.length > 0) {
    return post.whitePaperUrl;
  } else {
    const pdfRegex = /.*\.pdf/;

    const pdfLink = post.links.find(link => !!link.match(pdfRegex));

    if (pdfLink) {
      return pdfLink;
    } else {
      return post.links[0];
    }
  }
}

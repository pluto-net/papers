import { IPost } from "../../both/model/post";

export function getWhitePaperAddress(post: IPost) {
  if (post.whitePaperUrl && post.whitePaperUrl.length > 0) {
    return post.whitePaperUrl;
  } else {
    const pdfRegex = /.*\.pdf/;
    if (post && post.links && typeof post === "object") {
      const links = post.links as string[];
      const pdfLink = links.find(link => !!link.match(pdfRegex));

      if (pdfLink) {
        return pdfLink;
      } else {
        return links[0];
      }
    } else {
      return post.whitePaperUrl;
    }
  }
}

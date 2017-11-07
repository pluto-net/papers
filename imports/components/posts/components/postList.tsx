import * as React from "react";
import { Link } from "react-router-dom";

interface IPostListParams {
  posts: any[];
}

const mapPostNodes = (posts: any[]) => {
  return posts.map(post => {
    return (
      <Link to={`/posts/${post._id}`} key={`post_list_item_${post._id}`} className="post-list-item">
        <div className="title">{post.title}</div>
        <div className="content">{post.content}</div>
      </Link>
    );
  });
};

const PostList = (params: IPostListParams) => {
  if (!params.posts) {
    return null;
  } else {
    return <div className="post-list-container">{mapPostNodes(params.posts)}</div>;
  }
};

export default PostList;

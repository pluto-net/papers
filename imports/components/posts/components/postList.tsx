import * as React from "react";

interface IPostListParams {
  posts: any[];
}

const mapPostNodes = (posts: any[]) => {
  return posts.map(post => {
    return (
      <div key={`post_list_item_${post._id}`} className="post-list-item">
        <div className="title">{post.title}</div>
        <div className="content">{post.content}</div>
      </div>
    );
  });
};

const PostList = (params: IPostListParams) => {
  if (!params.posts) {
    return null;
  } else {
    return <div>{mapPostNodes(params.posts)}</div>;
  }
};

export default PostList;

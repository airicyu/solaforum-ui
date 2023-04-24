import { Card, List, Tag } from "antd";
import { PostDto } from "../models/PostDto";
import { NavLink } from "react-router-dom";

export const EarthPostItem = ({ post }: { post: PostDto }) => {
  return (
    <Card className="earth-post-card">
      {
        <>
          <NavLink to={`/post/${post.id}`}>
            [P#{post.id.toNumber()}] {post.title}{" "}
          </NavLink>
          <div style={{ float: "right" }}>
            Author: <Tag>{post.author.toString()}</Tag>
          </div>
          <div style={{ float: "right" }}>
            <Tag>Replies: {post.replies}</Tag>
          </div>
        </>
      }
    </Card>
  );
};

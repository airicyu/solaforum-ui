import { Card, Divider, List, Space, Tag } from "antd";
import { PostDto } from "../core/models/postDto.js";
import { NavLink } from "react-router-dom";
import { DateTime } from "luxon";
import { formatAgoDate } from "../utils/utils";

export const EarthPostItem = ({ post }: { post: PostDto }) => {
  const time =
    (post.createdTime &&
      DateTime.fromMillis(
        Math.max(post.createdTime, post.lastReplyTime)
      ).toLocal()) ||
    null;

  const timeActual = time?.toFormat("dd MMM, yyyy, HH:mm:ss") ?? "";

  const timeDisplay = (time && formatAgoDate(time)) ?? "";

  return (
    <Card className="earth-post-card">
      {
        <>
          <div style={{ float: "left", width: 150 }}>
            By{" "}
            <Tag title={post.creator.toString()}>
              {post.creatorName.toString()}
            </Tag>
          </div>
          <div style={{ float: "right", width: 140 }}>
            <Tag title={timeActual}>{timeDisplay}</Tag>
          </div>
          <div style={{ float: "right", width: 100 }}>
            {post.replyNextId - 1} Replies
          </div>

          <div className="gap-space"></div>
          <Divider />

          {/* <span title={post.creator.toString() + "-" + post.id}>
            [P# {post.creator.toString().substring(0, 6)}-{post.id}]{" "}
          </span> */}
          <NavLink to={`/post/${post.creator.toString() + "-" + post.id}`}>
            {post.title}{" "}
          </NavLink>
        </>
      }
    </Card>
  );
};

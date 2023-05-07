import { Card, Divider, Tag } from "antd";
import { PostDto } from "../core/models/postDto.js";
import { NavLink } from "react-router-dom";
import { DateTime } from "luxon";
import { formatAgoDate } from "../utils/utils";

export const EarthPostItem = ({ post }: { post: PostDto }) => {
  const createdTime =
    (post.createdTime && DateTime.fromMillis(post.createdTime).toLocal()) ||
    null;

  const createdTimeActual =
    createdTime?.toFormat("dd MMM, yyyy, HH:mm:ss") ?? "";

  const createdTimeDisplay = (createdTime && formatAgoDate(createdTime)) ?? "";

  const repliedTime =
    (post.lastReplyTime && DateTime.fromMillis(post.lastReplyTime).toLocal()) ||
    null;

  const repliedTimeActual =
    repliedTime?.toFormat("dd MMM, yyyy, HH:mm:ss") ?? "";

  const repliedTimeDisplay = (repliedTime && formatAgoDate(repliedTime)) ?? "";

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

          <div style={{ float: "right", width: 180 }}>
            Replied <Tag title={repliedTimeActual}>{repliedTimeDisplay}</Tag>
          </div>
          <div style={{ float: "right", width: 180 }}>
            Created <Tag title={createdTimeActual}>{createdTimeDisplay}</Tag>
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

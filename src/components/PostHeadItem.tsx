import { Card, Tag } from "antd";
import { PostDto } from "../core/models/postDto.js";
import { DateTime } from "luxon";
import { formatAgoDate } from "../utils/utils";

export const PostHeadItem = ({ post }: { post: PostDto }) => {
  const time =
    (post.createdTime && DateTime.fromMillis(post.createdTime).toLocal()) ||
    null;

  const timeActual = time?.toFormat("dd MMM, yyyy, HH:mm:ss") ?? "";

  const timeDisplay = (time && formatAgoDate(time)) ?? "";

  return (
    <Card
      className="post-head-card"
      title={
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
          <div style={{ clear: "both" }}></div>
          <div className="gap-space"></div>
          {/* <span title={post.creator.toString() + "-" + post.id}>
            [P# {post.creator.toString().substring(0, 6)}-{post.id}]{" "}
          </span> */}
          <h1>{post.title}</h1>
        </>
      }
    >
      <div>{post.content}</div>
    </Card>
  );
};

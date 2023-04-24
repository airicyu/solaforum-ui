import { Card, List, Tag } from "antd";
import { PostDto } from "../models/PostDto";
import { NavLink } from "react-router-dom";
import { ReplyDto } from "../models/ReplyDto";
import luxon, { DateTime } from "luxon";

export const PostReplyItem = ({ reply }: { reply: ReplyDto }) => {
  const timeDisplay =
    (reply.time &&
      DateTime.fromMillis(reply.time * 1000)
        .toLocal()
        .toFormat("dd MMM, yyyy, HH:mm:ss")) ||
    null;
  return (
    <Card className="post-reply-card">
      {
        <>
          [R#{reply.id}]
          <div style={{ float: "right", width: 400 }}>
            Author: <Tag>{reply.author.toString()}</Tag>
          </div>
          <div style={{ float: "right", width: 200 }}>
            Time: <Tag>{timeDisplay}</Tag>
          </div>
          <div>{reply.content}</div>
        </>
      }
    </Card>
  );
};

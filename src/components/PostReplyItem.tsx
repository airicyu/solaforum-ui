import { Card, Tag } from "antd";
import { ReplyDto } from "../core/models/replyDto.js";
import { DateTime } from "luxon";
import { formatAgoDate } from "../utils/utils";

export const PostReplyItem = ({ reply }: { reply: ReplyDto }) => {
  const time =
    (reply.createdTime && DateTime.fromMillis(reply.createdTime).toLocal()) ||
    null;

  const timeActual = time?.toFormat("dd MMM, yyyy, HH:mm:ss") ?? "";

  const timeDisplay = (time && formatAgoDate(time)) ?? "";

  return (
    <Card
      className="post-reply-card"
      title={
        <>
          <div style={{ float: "left", width: 150 }}>
            [R#{reply.id}] By{" "}
            <Tag title={reply.author.toString()}>
              {reply.authorName.toString()}
            </Tag>
          </div>
          <div style={{ float: "right", width: 140 }}>
            <Tag title={timeActual}>{timeDisplay}</Tag>
          </div>
        </>
      }
    >
      {
        <div>
          <pre>{reply.content}</pre>
        </div>
      }
    </Card>
  );
};

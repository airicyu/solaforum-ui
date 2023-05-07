import { Card, Tag, Modal, message, Radio, Divider, Row, Col } from "antd";
import { ReplyDto } from "../core/models/replyDto.js";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Web3Context } from "../contexts/Web3Context";
import BN from "bn.js";
import { PostReplyItem } from "../components/PostReplyItem";
import { EditFilled, HomeFilled } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { NavLink } from "react-router-dom";
import _ from "lodash";
import * as anchor from "@coral-xyz/anchor";
import { PostDto } from "../core/models/postDto.js";
import { PublicKey } from "@solana/web3.js";
import { PostHeadItem } from "../components/PostHeadItem";

const earthId = new BN(1);

export const ViewPost = () => {
  const web3Context = useContext(Web3Context);
  const anchorWallet = useAnchorWallet();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDto | null>(null);
  const [replies, setReplies] = useState<ReplyDto[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [isCreateReplyModalOpen, setIsCreateReplyModalOpen] = useState(false);
  const [isInitLoad, setIsInitLoad] = useState<boolean>(true);
  const [isRefetch, setIsRefetch] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [lastReplyId, setLastReplyId] = useState<number>(0);

  const postCreator = useMemo(
    () =>
      postId?.split("-")?.[0]
        ? new PublicKey(postId?.split("-")?.[0])
        : undefined,
    [postId]
  );

  const userPostId = useMemo(
    () => (postId?.split("-")?.[1] ? +postId?.split("-")?.[1] : undefined),
    [postId]
  );

  const createReply = useCallback(
    async (content: string) => {
      if (!anchorWallet) {
        messageApi.open({
          type: "warning",
          content: "wallet not connected!",
        });
        return;
      }
      if (web3Context) {
        if (!web3Context.userInitialized) {
          messageApi.open({
            type: "warning",
            content: "User not initialized!",
          });
        } else if (postCreator && userPostId) {
          await web3Context.forumService?.createReply(
            anchorWallet!.publicKey,
            postCreator,
            userPostId,
            content
          );
          setIsRefetch(true);
        }
      }
    },
    [anchorWallet, messageApi, postCreator, userPostId, web3Context]
  );

  if (!postCreator || !userPostId || !web3Context?.forumService) {
    return <></>;
  }

  if (isInitLoad) {
    (async () => {
      setIsInitLoad(false);
      if (postId && !post) {
        const _post = await web3Context.forumService.getPost(
          postCreator,
          userPostId
        );
        setPost(_post);
        setLastReplyId(_post.replyNextId - 1);
      }
    })();
  }

  if (isRefetch && post) {
    (async () => {
      setIsRefetch(false);
      //getReplys
      const newReplyDtos = await web3Context.forumService!.getPostReplys(
        postCreator,
        userPostId,
        _.last(replies)?._trxHash ?? null
      );

      const lastReplyIdValue = Math.max(
        _.last(replies)?.id ?? 0,
        _.last(newReplyDtos)?.id ?? 0
      );
      setReplies([...replies, ...newReplyDtos]);
      //   replies.push(
      //     ...replies.filter((reply) => reply.id > lastReplyIdValue)
      //   );
      setLastReplyId(lastReplyIdValue);
    })();
  }

  const createReplyModal = (
    <>
      <Modal
        title="New Reply"
        open={isCreateReplyModalOpen}
        onOk={async (e) => {
          if (anchor.utils.bytes.utf8.encode(inputContent).length > 255) {
            messageApi.open({
              type: "error",
              content: "Content too long!",
            });
          } else {
            await createReply(inputContent);
            setInputContent("");
            setIsCreateReplyModalOpen(false);
          }
        }}
        onCancel={() => {
          setIsCreateReplyModalOpen(false);
        }}
      >
        <div>
          <div>
            Content: ({anchor.utils.bytes.utf8.encode(inputContent).length}/255
            bytes)
          </div>
          <div
            className={
              anchor.utils.bytes.utf8.encode(inputContent).length > 255
                ? "error-highlight"
                : ""
            }
          >
            <TextArea
              rows={8}
              maxLength={255}
              defaultValue={inputContent}
              onChange={(e) => {
                setInputContent(e.target.value);
              }}
            ></TextArea>
          </div>
        </div>
      </Modal>
    </>
  );

  const postHeadItemElem = post ? <PostHeadItem post={post} /> : null;

  return (
    <>
      <div>
        <Radio.Group>
          <Radio.Button onClick={() => navigate("/")}>
            <HomeFilled />
          </Radio.Button>

          <Radio.Button
            onClick={() => {
              setIsCreateReplyModalOpen(true);
            }}
          >
            <EditFilled />
          </Radio.Button>
        </Radio.Group>
      </div>

      <Divider />

      <Row>
        <Col span={18} offset={3}>
          {postHeadItemElem}
          <Divider />
          {replies.map((reply, i) => {
            return (
              <div key={i}>
                <PostReplyItem reply={reply}></PostReplyItem>
                <div className="gap-space"></div>
              </div>
            );
          })}
        </Col>
      </Row>

      {createReplyModal}
      {contextHolder}
    </>
  );
};

import { Card, Tag, Modal, message, Radio } from "antd";
import { PostWithReplyDto } from "../models/ReplyDto";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState, useCallback } from "react";
import { Web3Context } from "../contexts/Web3Context";
import BN from "bn.js";
import { PostReplyItem } from "../components/PostReplyItem";
import { EditFilled, HomeFilled } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { NavLink } from "react-router-dom";
import _ from "lodash";

const earthId = new BN(1);

export const ViewPost = () => {
  const { accountAddress } = useParams();
  const web3Context = useContext(Web3Context);
  const anchorWallet = useAnchorWallet();
  const { postId } = useParams();
  const [post, setPost] = useState<PostWithReplyDto | null>(null);
  const [inputContent, setInputContent] = useState("");
  const [isCreateReplyModalOpen, setIsCreateReplyModalOpen] = useState(false);
  const [isInitLoad, setIsInitLoad] = useState<boolean>(true);
  const [isRefetch, setIsRefetch] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [lastReplyId, setLastReplyId] = useState<number>(0);

  if (isInitLoad && web3Context?.forumService) {
    (async () => {
      setIsInitLoad(false);
      if (postId && !post) {
        const _post = await web3Context?.forumService!.getPostReplies(
          earthId,
          new BN(postId)
        );
        setPost(_post);
        setLastReplyId(_.last(_post.replies)?.id ?? 0);
      }
    })();
  }

  if (isRefetch && postId && post && web3Context?.forumService) {
    (async () => {
      setIsRefetch(false);
      //getReplys
      const replies = await web3Context.forumService!.getReplies(
        earthId,
        new BN(postId),
        lastReplyId + 1
      );

      const lastReplyIdValue = _.last(post.replies)?.id ?? 0;
      const updatedPost = _.cloneDeep(post);
      updatedPost.replies.push(
        ...replies.filter((reply) => reply.id > lastReplyIdValue)
      );
      setLastReplyId(lastReplyIdValue);
      setPost(updatedPost);
    })();
  }

  const createReply = useCallback(
    async (earthId: BN, postId: BN, content: string) => {
      if (!anchorWallet) {
        messageApi.open({
          type: "warning",
          content: "wallet not connected!",
        });
        return;
      }
      if (web3Context && postId) {
        if (!web3Context.userInitialized) {
          messageApi.open({
            type: "warning",
            content: "User not initialized!",
          });
        } else {
          await web3Context.forumService?.createReply(
            anchorWallet!.publicKey,
            earthId,
            postId,
            content
          );
          setIsRefetch(true);
        }
      }
    },
    [anchorWallet, messageApi, web3Context]
  );

  const createReplyModal = (
    <>
      <Modal
        title="New Reply"
        open={isCreateReplyModalOpen}
        onOk={async (e) => {
          await createReply(earthId, new BN(postId!), inputContent);
          setInputContent("");
          setIsCreateReplyModalOpen(false);
        }}
        onCancel={() => {
          setIsCreateReplyModalOpen(false);
        }}
      >
        <div>Content:</div>
        <div>
          <TextArea
            maxLength={255}
            defaultValue={inputContent}
            onChange={(e) => {
              setInputContent(e.target.value);
            }}
          ></TextArea>
        </div>
      </Modal>
    </>
  );

  return (
    <>
      <div>
        Replies: <Tag>{lastReplyId}</Tag>
      </div>
      <div>
        <Radio.Group>
          <Radio.Button>
            <NavLink to={`/`}>
              <HomeFilled />
            </NavLink>
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
      <hr />
      <Card
        className="post-head-card"
        title={
          <>
            [P#{post?.id}] {post?.title}{" "}
            <div style={{ float: "right" }}>
              Author: <Tag>{post?.author?.toString() ?? "???"}</Tag>
            </div>
          </>
        }
      >
        {
          <>
            <div>{post?.content}</div>
          </>
        }
      </Card>
      <hr />
      {post?.replies?.map((reply, i) => {
        return (
          <div key={i}>
            <PostReplyItem reply={reply}></PostReplyItem>
            <div className="gap-space"></div>
          </div>
        );
      })}

      {createReplyModal}
    </>
  );
};

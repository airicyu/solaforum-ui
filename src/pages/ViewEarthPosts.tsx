import { useEffect, useContext, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Web3Context } from "../contexts/Web3Context";
import { List, Modal, Input, Tag, message, Radio } from "antd";
import BN from "bn.js";
import { PostDto } from "../models/PostDto";
import { EarthDto } from "../models/EarthDto";
import { EarthPostItem } from "../components/EarthPostItem";
import { EditFilled, HomeFilled } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const earthId = new BN(1);

export const ViewEarthPosts = (props: any) => {
  // const { accountAddress } = useParams();
  const web3Context = useContext(Web3Context);
  // const connection = web3Context.connection;
  const [earth, setEarth] = useState<EarthDto | null>(null);
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const anchorWallet = useAnchorWallet();
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    (async () => {
      setIsRefresh(false);
      if (web3Context) {
        const earth = await web3Context.forumService?.getEarth(earthId);
        setEarth(earth);
        const posts = await web3Context.forumService?.getEarthPosts(earthId);
        setPosts(posts);
      }
    })();
  }, [web3Context, web3Context?.forumService, isRefresh]);

  const createPost = useCallback(
    async (earthId: BN, title: string, content: string) => {
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
        } else {
          await web3Context.forumService?.createPost(
            anchorWallet.publicKey,
            earthId,
            title,
            content
          );
          setIsRefresh(true);
        }
      }
    },
    [anchorWallet, messageApi, web3Context]
  );
  const postElements = (
    <List
      itemLayout="horizontal"
      dataSource={posts}
      renderItem={(post, index) => (
        <>
          <EarthPostItem post={post}></EarthPostItem>
          <div className="gap-space"></div>
        </>
      )}
    />
  );

  const createPostModal = (
    <>
      <Modal
        title="New Post"
        open={isCreatePostModalOpen}
        onOk={async (e) => {
          await createPost(earthId, inputTitle, inputContent);
          setInputTitle("");
          setInputContent("");
          setIsCreatePostModalOpen(false);
        }}
        onCancel={() => {
          setIsCreatePostModalOpen(false);
        }}
      >
        <div>Title:</div>
        <div className="gap-space"></div>
        <div>
          <Input
            maxLength={30}
            defaultValue={inputTitle}
            onChange={(e) => {
              setInputTitle(e.target.value);
            }}
          ></Input>
        </div>
        <div className="gap-space"></div>
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
      <h2>
        Universe: <Tag>{earth?.name}</Tag>
      </h2>
      <div>
        Posts: <Tag>{earth?.postCount}</Tag>
      </div>

      <div>
        <Radio.Group>
          <Radio.Button
            onClick={() => {
              setIsCreatePostModalOpen(true);
            }}
          >
            <EditFilled />
          </Radio.Button>
        </Radio.Group>
      </div>
      <hr />
      {postElements}
      {/* <FloatButton
        icon={
          <EditTwoTone
            onClick={() => {
              setIsCreatePostModalOpen(true);
            }}
          />
        }
      ></FloatButton> */}
      {createPostModal}
    </>
  );
};

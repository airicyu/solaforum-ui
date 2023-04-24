export const idl = {
  version: "0.1.0",
  name: "solaforum",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "earthIdCounter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "initializeUser",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userReserveReceipt",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "reserveEarthId",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "earthIdCounter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userReserveReceipt",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
      returns: "u64",
    },
    {
      name: "createEarth",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userReserveReceipt",
          isMut: false,
          isSigner: false,
        },
        {
          name: "earth",
          isMut: true,
          isSigner: false,
        },
        {
          name: "postIdCounter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "CreateEarthData",
          },
        },
      ],
    },
    {
      name: "reservePostId",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "earthIdCounter",
          isMut: false,
          isSigner: false,
        },
        {
          name: "postIdCounter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userReserveReceipt",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "earthId",
          type: "u64",
        },
      ],
      returns: "u64",
    },
    {
      name: "createPost",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userReserveReceipt",
          isMut: false,
          isSigner: false,
        },
        {
          name: "post",
          isMut: true,
          isSigner: false,
        },
        {
          name: "replyIdCounter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "CreatePostData",
          },
        },
      ],
    },
    {
      name: "reserveReplyId",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "earthIdCounter",
          isMut: false,
          isSigner: false,
        },
        {
          name: "postIdCounter",
          isMut: false,
          isSigner: false,
        },
        {
          name: "replyIdCounter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userReserveReceipt",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "ReserveReplyIdData",
          },
        },
      ],
      returns: "u8",
    },
    {
      name: "createReply",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userReserveReceipt",
          isMut: false,
          isSigner: false,
        },
        {
          name: "reply",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "CreateReplyData",
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "IdCounter",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nextId",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "U8IdCounter",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nextId",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "Earth",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "u64",
          },
          {
            name: "name",
            type: "string",
          },
        ],
      },
    },
    {
      name: "Post",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "u64",
          },
          {
            name: "author",
            type: "publicKey",
          },
          {
            name: "title",
            type: "string",
          },
        ],
      },
    },
    {
      name: "Reply",
      type: {
        kind: "struct",
        fields: [
          {
            name: "author",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "CreateEarthData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
        ],
      },
    },
    {
      name: "CreatePostData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "earthId",
            type: "u64",
          },
          {
            name: "title",
            type: "string",
          },
          {
            name: "content",
            type: "string",
          },
        ],
      },
    },
    {
      name: "ReserveReplyIdData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "earthId",
            type: "u64",
          },
          {
            name: "postId",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "CreateReplyData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "earthId",
            type: "u64",
          },
          {
            name: "postId",
            type: "u64",
          },
          {
            name: "content",
            type: "string",
          },
        ],
      },
    },
    {
      name: "IdReserveReceipt",
      type: {
        kind: "struct",
        fields: [
          {
            name: "earthId",
            type: "u64",
          },
          {
            name: "postId",
            type: "u64",
          },
          {
            name: "replyId",
            type: "u8",
          },
        ],
      },
    },
  ],
};

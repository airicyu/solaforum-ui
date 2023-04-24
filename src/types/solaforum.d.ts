declare type Solaforum = {
  version: "0.1.0";
  name: "solaforum";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "earthIdCounter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "initializeUser";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userReserveReceipt";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "reserveEarthId";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "earthIdCounter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userReserveReceipt";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
      returns: "u64";
    },
    {
      name: "createEarth";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userReserveReceipt";
          isMut: false;
          isSigner: false;
        },
        {
          name: "earth";
          isMut: true;
          isSigner: false;
        },
        {
          name: "postIdCounter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            defined: "CreateEarthData";
          };
        }
      ];
    },
    {
      name: "reservePostId";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "earthIdCounter";
          isMut: false;
          isSigner: false;
        },
        {
          name: "postIdCounter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userReserveReceipt";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "earthId";
          type: "u64";
        }
      ];
      returns: "u64";
    },
    {
      name: "createPost";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userReserveReceipt";
          isMut: false;
          isSigner: false;
        },
        {
          name: "post";
          isMut: true;
          isSigner: false;
        },
        {
          name: "replyIdCounter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            defined: "CreatePostData";
          };
        }
      ];
    },
    {
      name: "reserveReplyId";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "earthIdCounter";
          isMut: false;
          isSigner: false;
        },
        {
          name: "postIdCounter";
          isMut: false;
          isSigner: false;
        },
        {
          name: "replyIdCounter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userReserveReceipt";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            defined: "ReserveReplyIdData";
          };
        }
      ];
      returns: "u8";
    },
    {
      name: "createReply";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userReserveReceipt";
          isMut: false;
          isSigner: false;
        },
        {
          name: "reply";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            defined: "CreateReplyData";
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "idCounter";
      type: {
        kind: "struct";
        fields: [
          {
            name: "nextId";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "u8IdCounter";
      type: {
        kind: "struct";
        fields: [
          {
            name: "nextId";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "earth";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "name";
            type: "string";
          }
        ];
      };
    },
    {
      name: "post";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "author";
            type: "publicKey";
          },
          {
            name: "title";
            type: "string";
          }
        ];
      };
    },
    {
      name: "reply";
      type: {
        kind: "struct";
        fields: [
          {
            name: "author";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "createEarthData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          }
        ];
      };
    },
    {
      name: "createPostData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "earthId";
            type: "u64";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "content";
            type: "string";
          }
        ];
      };
    },
    {
      name: "reserveReplyIdData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "earthId";
            type: "u64";
          },
          {
            name: "postId";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "createReplyData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "earthId";
            type: "u64";
          },
          {
            name: "postId";
            type: "u64";
          },
          {
            name: "content";
            type: "string";
          }
        ];
      };
    },
    {
      name: "idReserveReceipt";
      type: {
        kind: "struct";
        fields: [
          {
            name: "earthId";
            type: "u64";
          },
          {
            name: "postId";
            type: "u64";
          },
          {
            name: "replyId";
            type: "u8";
          }
        ];
      };
    }
  ];
};

export const IDL: Solaforum = {
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
      name: "idCounter",
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
      name: "u8IdCounter",
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
      name: "earth",
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
      name: "post",
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
      name: "reply",
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
      name: "createEarthData",
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
      name: "createPostData",
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
      name: "reserveReplyIdData",
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
      name: "createReplyData",
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
      name: "idReserveReceipt",
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

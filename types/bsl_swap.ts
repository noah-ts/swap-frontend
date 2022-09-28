export type BslSwap = {
  "version": "0.1.0",
  "name": "bsl_swap",
  "instructions": [
    {
      "name": "initializeUserState",
      "accounts": [
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeSwapState",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "swapStateBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeEscrowState",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeEscrow",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataOfferor",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ataBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addMintOfferee",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initiateSwap",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offerorState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offereeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeEscrow",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeree",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelSwap",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offerorState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offereeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "acceptSwap",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offerorState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offereeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferNftFromOffereeToOfferor",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ataOfferor",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataOfferee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "userState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userEnum",
            "type": "u8"
          },
          {
            "name": "counterParty",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "swapState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "offeror",
            "type": "publicKey"
          },
          {
            "name": "offeree",
            "type": "publicKey"
          },
          {
            "name": "swapStateBump",
            "type": "u8"
          },
          {
            "name": "mintsOfferor",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "mintsOfferee",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "escrowState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "ataOfferor",
            "type": "publicKey"
          },
          {
            "name": "stateBump",
            "type": "u8"
          },
          {
            "name": "ataBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "UserEnum",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Offeror"
          },
          {
            "name": "Offeree"
          },
          {
            "name": "None"
          }
        ]
      }
    },
    {
      "name": "CloseEscrowEnum",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Cancel"
          },
          {
            "name": "Accept"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UserEnumInvalid",
      "msg": "User is invalid, has to be offeror or offeree"
    },
    {
      "code": 6001,
      "name": "CloseEscrowEnumInvalid",
      "msg": "Close escrow type is invalid, has to be cancel or accept"
    }
  ]
};

export const IDL: BslSwap = {
  "version": "0.1.0",
  "name": "bsl_swap",
  "instructions": [
    {
      "name": "initializeUserState",
      "accounts": [
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeSwapState",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "swapStateBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeEscrowState",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeEscrow",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataOfferor",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ataBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addMintOfferee",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initiateSwap",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offerorState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offereeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeEscrow",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeree",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelSwap",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offerorState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offereeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "acceptSwap",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offerorState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offereeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferNftFromOffereeToOfferor",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeror",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeree",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "ataOfferor",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataOfferee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "userState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userEnum",
            "type": "u8"
          },
          {
            "name": "counterParty",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "swapState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "offeror",
            "type": "publicKey"
          },
          {
            "name": "offeree",
            "type": "publicKey"
          },
          {
            "name": "swapStateBump",
            "type": "u8"
          },
          {
            "name": "mintsOfferor",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "mintsOfferee",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "escrowState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "ataOfferor",
            "type": "publicKey"
          },
          {
            "name": "stateBump",
            "type": "u8"
          },
          {
            "name": "ataBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "UserEnum",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Offeror"
          },
          {
            "name": "Offeree"
          },
          {
            "name": "None"
          }
        ]
      }
    },
    {
      "name": "CloseEscrowEnum",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Cancel"
          },
          {
            "name": "Accept"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UserEnumInvalid",
      "msg": "User is invalid, has to be offeror or offeree"
    },
    {
      "code": 6001,
      "name": "CloseEscrowEnumInvalid",
      "msg": "Close escrow type is invalid, has to be cancel or accept"
    }
  ]
};

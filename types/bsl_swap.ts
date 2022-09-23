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
      "name": "initializeEscrow",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAssetA",
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
          "name": "escrowBump",
          "type": "u8"
        }
      ]
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
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAssetA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetB",
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
          "name": "ataOfferorAssetA",
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
          "name": "escrow",
          "isMut": true,
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
          "name": "mintAssetA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetB",
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
          "name": "ataOfferorAssetA",
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
      "name": "acceptSwapOne",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
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
          "name": "mintAssetA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetB",
          "isMut": false,
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
        },
        {
          "name": "ataOffereeAssetA",
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
      "name": "acceptSwapTwo",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetB",
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
          "name": "ataOfferorAssetB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataOffereeAssetB",
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
            "name": "mintAssetA",
            "type": "publicKey"
          },
          {
            "name": "mintAssetB",
            "type": "publicKey"
          },
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "swapStateBump",
            "type": "u8"
          },
          {
            "name": "escrowBump",
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UserEnumInvalid",
      "msg": "User is invalid, has to be offeror or offeree"
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
      "name": "initializeEscrow",
      "accounts": [
        {
          "name": "swapState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAssetA",
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
          "name": "escrowBump",
          "type": "u8"
        }
      ]
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
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAssetA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetB",
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
          "name": "ataOfferorAssetA",
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
          "name": "escrow",
          "isMut": true,
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
          "name": "mintAssetA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetB",
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
          "name": "ataOfferorAssetA",
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
      "name": "acceptSwapOne",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
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
          "name": "mintAssetA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetB",
          "isMut": false,
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
        },
        {
          "name": "ataOffereeAssetA",
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
      "name": "acceptSwapTwo",
      "accounts": [
        {
          "name": "swapState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAssetB",
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
          "name": "ataOfferorAssetB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ataOffereeAssetB",
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
            "name": "mintAssetA",
            "type": "publicKey"
          },
          {
            "name": "mintAssetB",
            "type": "publicKey"
          },
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "swapStateBump",
            "type": "u8"
          },
          {
            "name": "escrowBump",
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UserEnumInvalid",
      "msg": "User is invalid, has to be offeror or offeree"
    }
  ]
};
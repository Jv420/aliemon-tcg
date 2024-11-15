import {
  createThirdwebClient,
  getContract,
  sendAndConfirmTransaction,
} from "thirdweb";

import { config } from "dotenv";

import { privateKeyToAccount } from "thirdweb/wallets";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "thirdweb/extensions/erc1155";
import { createNewPack } from "thirdweb/extensions/pack";
import { sepolia } from "thirdweb/chains";

config();

const main = async () => {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set");
  }
  if (!process.env.THIRDWEB_SECRET_KEY) {
    throw new Error("THIRDWEB_SECRET_KEY is not set");
  }

  try {
    const EDITION_CONTRACT_ADDRESS = "";
    const PACK_CONTRACT_ADDRESS = "";

    const chain = sepolia;

    // Initialize the client and the account
    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    const account = privateKeyToAccount({
      client,
      privateKey: process.env.PRIVATE_KEY,
    });

    // Get the contracts

    const contractEdition = getContract({
      address: EDITION_CONTRACT_ADDRESS,
      chain,
      client,
    });

    const contractPack = getContract({
      address: PACK_CONTRACT_ADDRESS,
      chain,
      client,
    });

    // Check if the Account is approved

    const isApproved = await isApprovedForAll({
      contract: contractEdition,
      owner: account.address,
      operator: PACK_CONTRACT_ADDRESS,
    });
    console.log("Account is approved");

    if (!isApproved) {
      const transaction = setApprovalForAll({
        contract: contractEdition,
        operator: PACK_CONTRACT_ADDRESS,
        approved: true,
      });

      const approvalData = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      console.log(`Approval Transaction hash: ${approvalData.transactionHash}`);
    }

    // Create a new Pack of Cards

    const transactionPack = createNewPack({
      contract: contractPack,
      client,
      recipient: account.address,
      tokenOwner: account.address,
      packMetadata: {
        name: "Basic Pack (#1)",
        image:
          "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/QmVVPgwgRpF38ja6nddnQfWnRWjhzRXet9ZkUHh5a95Lj8",
        description: "Basic Aliemon Pack",
      },

      openStartTimestamp: new Date(),

      erc1155Rewards: [
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(0),
          quantityPerReward: 1,
          totalRewards: 5,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(1),
          quantityPerReward: 1,
          totalRewards: 40,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(2),
          quantityPerReward: 1,
          totalRewards: 20,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(3),
          quantityPerReward: 1,
          totalRewards: 60,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(4),
          quantityPerReward: 1,
          totalRewards: 15,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(5),
          quantityPerReward: 1,
          totalRewards: 40,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(6),
          quantityPerReward: 1,
          totalRewards: 60,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(7),
          quantityPerReward: 1,
          totalRewards: 5,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(8),
          quantityPerReward: 1,
          totalRewards: 100,
        },
      ],

      amountDistributedPerOpen: BigInt(5),
    });

    const dataPack = await sendAndConfirmTransaction({
      transaction: transactionPack,
      account,
    });

    console.log(`Pack Transaction hash: ${dataPack.transactionHash}`);
  } catch (error) {
    console.error("Something went wrong", error);
  }
};

main();

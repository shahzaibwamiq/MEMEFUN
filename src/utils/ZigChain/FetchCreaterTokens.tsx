import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const fetchTokensCreator = async (walletAddress: string) => {
    const client = await CosmWasmClient.connect("https://testnet-rpc.zigchain.com");

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("Contract address is not defined.");
    }

    const result = await client.queryContractSmart(contractAddress, {
        tokens_by_creator: {
            creator: walletAddress,
        },
    });

    return result;
};

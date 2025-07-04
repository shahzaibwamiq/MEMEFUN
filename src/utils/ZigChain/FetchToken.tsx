import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const fetchTokens = async () => {
    const client = await CosmWasmClient.connect("https://testnet-rpc.zigchain.com");

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("contract address is not defined.");
    }

    const result = await client.queryContractSmart(contractAddress, {
        list_tokens: {
            start_after: null,
            limit: 30
        }
    });

    return result;
};

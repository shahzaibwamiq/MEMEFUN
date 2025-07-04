import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const fetchSingleTokens = async (baseToken: string) => {
    const client = await CosmWasmClient.connect("https://testnet-rpc.zigchain.com");

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("contract address is not defined.");
    }

    const result = await client.queryContractSmart(contractAddress, {
        token_by_base: {
            base: baseToken
        }
    });

    return result;
};

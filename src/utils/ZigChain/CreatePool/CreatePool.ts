import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, calculateFee } from "@cosmjs/stargate";

export interface CreatePoolMsg {
    create_pool: {
        symbol: string;
        creator: string;
        is_seven_percent?: boolean
    };
}

export const createPoolTx = async ({
    msg,
    signer,
}: {
    msg: CreatePoolMsg;
    signer: OfflineSigner;
}): Promise<{ txHash: string }> => {
    const rpc = process.env.NEXT_PUBLIC_RPC_ADDRESS;
    const contractAddress = process.env.NEXT_PUBLIC_BONDING_CURVE_ADDRESS;

    if (!rpc) throw new Error("Missing RPC address.");
    if (!contractAddress) throw new Error("Missing bonding contract address.");

    try {
        const gasPrice = GasPrice.fromString("0.0003uzig");
        const client = await SigningCosmWasmClient.connectWithSigner(rpc, signer, { gasPrice });

        const [account] = await signer.getAccounts();

        const estimatedGas = await client.simulate(account.address, [{
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
                sender: account.address,
                contract: contractAddress,
                msg: msg,
                funds: [],
            },
        }], "auto");
        const gasLimit = Math.ceil(estimatedGas * 1.3);
        const fee = calculateFee(gasLimit, gasPrice);

        const result = await client.execute(
            account.address,
            contractAddress,
            msg,
            fee,
            "", // Memo
            []
        );

        return {
            txHash: result.transactionHash,
        };
    } catch (error: unknown) {
        const rawLog = error instanceof Error ? error.message : String(error);
        const raw = rawLog.toLowerCase();

        let message = "Pool creation failed. Please try again.";

        if (raw.includes("already exists")) {
            message = "A pool with this token symbol already exists.";
        } else if (raw.includes("unauthorized")) {
            message = "Unauthorized. Wallet not permitted to create this pool.";
        } else if (raw.includes("insufficient funds")) {
            message = "Insufficient ZIG in wallet.";
        }

        throw new Error(message);
    }
};

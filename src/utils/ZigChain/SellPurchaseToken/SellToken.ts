import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, calculateFee } from "@cosmjs/stargate";

export interface SellTokenMsg {
    sell_token: {
        symbol: string;
        name: string;
        amount: string;
    };
}

export const SellTokenTx = async ({
    msg,
    signer,
    base
}: {
    msg: SellTokenMsg;
    signer: OfflineSigner;
    base: string;
}): Promise<string> => {
    try {
        const rpc = process.env.NEXT_PUBLIC_RPC_ADDRESS;
        const contractAddress = process.env.NEXT_PUBLIC_BONDING_CURVE_ADDRESS;

        if (!rpc) throw new Error("Missing rpc address.");
        if (!contractAddress) throw new Error("Missing contract address.");

        const gasPrice = GasPrice.fromString("0.0003uzig");
        const client = await SigningCosmWasmClient.connectWithSigner(rpc, signer, { gasPrice });

        const [account] = await signer.getAccounts();

        const execMsg = {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
                sender: account.address,
                contract: contractAddress,
                msg: new TextEncoder().encode(JSON.stringify(msg)),
                funds: [
                    {
                        denom: base.trim(),
                        amount: msg.sell_token.amount.toString(),
                    }
                ],
            },
        };

        const estimatedGas = await client.simulate(account.address, [execMsg], "");
        const gasLimit = Math.ceil(estimatedGas * 1.3);
        const fee = calculateFee(gasLimit, gasPrice);

        const result = await client.signAndBroadcast(account.address, [execMsg], fee, "");

        if (result.code !== 0) {
            throw new Error(result.rawLog || "Transaction failed");
        }

        return result.transactionHash;
    } catch (error: unknown) {
        let rawLog = "";

        if (error instanceof Error) {
            rawLog = error.message;
        }
        const errAsAny = error as { response?: { raw_log?: string }; raw_log?: string; message?: string };
        rawLog = errAsAny?.response?.raw_log || errAsAny?.raw_log || rawLog;

        const raw = rawLog.toLowerCase();
        let message = "Something went wrong. Please try again.";

        if (raw.includes("insufficient funds")) {
            message = "You don’t have enough tokens to complete this transaction.";
        } else if (raw.includes("spendable balance") && raw.includes("smaller")) {
            message = "Insufficient token balance to sell. Please check your wallet.";
        } else if (raw.includes("unauthorized")) {
            message = "Unauthorized action. Please reconnect your wallet and try again.";
        } else if (raw.includes("not found")) {
            message = "Token not found. Please verify token name and symbol.";
        } else if (raw.includes("denom") && raw.includes("does not exist")) {
            message = "This token is invalid or not available in your wallet.";
        } else if (raw.includes("out of gas")) {
            message = "Transaction ran out of gas. Try increasing the gas limit.";
        } else if (raw.includes("overflow") || raw.includes("math")) {
            message = "Math error in transaction. Double-check the amount.";
        } else if (raw.includes("invalid type")) {
            message = "Contract message format is invalid. Please contact support.";
        } else if (raw.includes("math error in updated_reserve_calculation")) {
            message = "You are out of Quota.";
        }

        throw new Error(message);
    }
};

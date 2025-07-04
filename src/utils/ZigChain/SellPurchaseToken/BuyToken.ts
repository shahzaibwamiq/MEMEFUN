import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, calculateFee } from "@cosmjs/stargate";

export interface BuyTokenMsg {
    buy_token: {
        symbol: string;
        name: string;
        slippage?: string;
    };
}

export const BuyTokenTx = async ({
    msg,
    signer,
    amount,
}: {
    msg: BuyTokenMsg;
    signer: OfflineSigner;
    amount: number;
}): Promise<string> => {
    const rpc = process.env.NEXT_PUBLIC_RPC_ADDRESS;
    const contractAddress = process.env.NEXT_PUBLIC_BONDING_CURVE_ADDRESS;

    if (!rpc) throw new Error("Missing RPC address.");
    if (!contractAddress) throw new Error("Missing contract address.");

    try {
        const gasPrice = GasPrice.fromString("0.0003uzig");
        const client = await SigningCosmWasmClient.connectWithSigner(rpc, signer, { gasPrice });

        const [account] = await signer.getAccounts();

        const microAmount = Math.ceil(amount * 1_000_000).toString();


        const execMsg = {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
                sender: account.address,
                contract: contractAddress,
                msg: new TextEncoder().encode(JSON.stringify(msg)),
                funds: [
                    {
                        denom: "uzig",
                        amount: microAmount,
                    },
                ],
            },
        };

        const estimatedGas = await client.simulate(account.address, [execMsg], "auto");
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

        if (raw.includes("unauthorized")) {
            message = "You are not authorized to perform this action.";
        } else if (raw.includes("insufficient funds") || raw.includes("spendable balance")) {
            message = "Insufficient funds. Please ensure you have enough ZIG in your wallet.";
        } else if (raw.includes("insufficient fee")) {
            message = "Insufficient fee. Please ensure deployment fee is included.";
        } else if (raw.includes("wallet not connected")) {
            message = "Wallet not connected. Please reconnect your wallet.";
        } else if (raw.includes("amount is not positive") || raw.includes("coin 0uzig")) {
            message = "Amount must be greater than 0 ZIG.";
        } else if (raw.includes("you cannot buy more than") && raw.includes("of the total supply")) {
            message = "Purchase limit exceeded. You cannot buy more than 7% of the total supply.";
        } else if (raw.includes("math error in remaining_uzigs_calculation")) {
            message = "You are trying to purchase more ZIG than available. Please reduce the amount.";
        }

        throw new Error(message);
    }
};

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, calculateFee } from "@cosmjs/stargate";

export interface CreateTokenMsg {
    create_denom: {
        symbol: string;
        name: string;
        uri: string;
    };
}

export interface BuyTokenMsg {
    buy_token: {
        symbol: string;
        name: string;
        slippage?: string;
    };
}

export const signCreateTokenTx = async (
    { msg, signer, is_seven_percent, buyAmount }:
    { msg: CreateTokenMsg; signer: OfflineSigner; is_seven_percent: boolean; buyAmount?: number }):
    Promise<{txHash: string; buyTxHash?: string;}> =>
{
    const rpc = process.env.NEXT_PUBLIC_RPC_ADDRESS;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const bondingContractAddress = process.env.NEXT_PUBLIC_BONDING_CURVE_ADDRESS;
    
    if (!rpc) throw new Error("Missing rpc address.");
    if (!contractAddress) throw new Error("Missing contract address.");
    if (!bondingContractAddress) throw new Error("Missing bonding contract address.");

    try {
        const gasPrice = GasPrice.fromString("0.0003uzig");
        const client = await SigningCosmWasmClient.connectWithSigner(rpc, signer, { gasPrice });

        const [account] = await signer.getAccounts();
        
        const messages = [];

        // 1. Create denom message
        const create_denom = {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
                sender: account.address,
                contract: contractAddress,
                msg: new TextEncoder().encode(JSON.stringify(msg)),
                funds: [
                    {
                        denom: "uzig",
                        amount: "111000000",
                    },
                ],
            },
        };
        messages.push(create_denom);

        // 2. Create pool message
        const create_pool = {
            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
            value: {
                sender: account.address,
                contract: bondingContractAddress,
                msg: new TextEncoder().encode(JSON.stringify({
                    create_pool: {
                        symbol: msg.create_denom.symbol.toLowerCase(),
                        creator: account.address,
                        is_seven_percent: is_seven_percent
                    },
                })),
                funds: [],
            },
        };
        messages.push(create_pool);

        const estimatedGasCreate = await client.simulate(account.address, messages, "auto");
        const gasLimitCreate = Math.ceil(estimatedGasCreate * 1.3);
        const feeCreate = calculateFee(gasLimitCreate, gasPrice);

        // Execute all messages in a single transaction
        const resultCreate = await client.signAndBroadcast(account.address, messages, feeCreate, "");

        if (resultCreate.code !== 0) {
            throw new Error(resultCreate.rawLog || "Transaction failed");
        }

        // 3. Optional buy token message
        if (buyAmount && buyAmount > 0) {
            const microAmount = Math.ceil(buyAmount * 1_000_000).toString();
            const buy_token = {
                typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                value: {
                    sender: account.address,
                    contract: bondingContractAddress,
                    msg: new TextEncoder().encode(JSON.stringify({
                        buy_token: {
                            symbol: msg.create_denom.symbol.toLowerCase(),
                            name: msg.create_denom.name.toLowerCase(),
                            slippage: "0"
                        },
                    })),
                    funds: [
                        {
                            denom: "uzig",
                            amount: microAmount,
                        },
                    ],
                },
            };
            
            const estimatedGasBuy = await client.simulate(account.address, [buy_token], "auto");
            const gasLimitBuy = Math.ceil(estimatedGasBuy * 1.3);
            const feeBuy = calculateFee(gasLimitBuy, gasPrice);

            const resultBuy = await client.signAndBroadcast(account.address, [buy_token], feeBuy, "");

            if (resultBuy.code !== 0) {
                throw new Error(resultBuy.rawLog || "Transaction failed");
            }

            return {
                txHash: resultCreate.transactionHash,
                buyTxHash: resultBuy.transactionHash,
            };
        }

        return {
            txHash: resultCreate.transactionHash,
        };
    }
    catch (error: unknown) {
        let rawLog = "";

        if (error instanceof Error) {
            rawLog = error.message;
        }

        const errAsAny = error as { response?: { raw_log?: string }; raw_log?: string; message?: string };
        rawLog = errAsAny?.response?.raw_log || errAsAny?.raw_log || rawLog;

        const raw = rawLog.toLowerCase();
        let message = "Something went wrong. Please check your token details and try again.";


        if (raw.includes("symbol length")) {
            message = "Token symbol must be between 3 and 10 lowercase letters.";
        } else if (raw.includes("name must contain only lowercase letters")) {
            message = "Token name must only contain lowercase letters (a–z).";
        } else if (raw.includes("unauthorized")) {
            message = "You are not authorized to perform this action.";
        } else if (raw.includes("insufficient funds") || raw.includes("spendable balance")) {
            message = "Insufficient funds. Make sure you have at least 111 ZIG in your wallet.";
        } else if (raw.includes("insufficient fee")) {
            message = "Insufficient deployment fee. You must send 111 ZIG.";
        } else if (raw.includes("invalid token parameters")) {
            message = "Invalid token parameters. Please check symbol, name, and supply.";
        } else if (raw.includes("token with symbol") && raw.includes("already exists")) {
            message = "A token with this symbol already exists. Choose a different symbol.";
        } else if (raw.includes("denom") && raw.includes("already exists")) {
            message = "A denom with this name already exists. Please use a different name.";
        } else if (raw.includes("out of gas")) {
            message = "Gas limit exceeded. Try increasing the gas amount.";
        } else if (raw.includes("not found")) {
            message = "Contract storage key not found. Ensure correct token creator.";
        }

        throw new Error(message);
    }
};

// import axios from "axios";

// interface ZigPriceResponse {
//     zignaly: {
//         usd: number;
//     };
// }

export const fetchZigPrice = async (): Promise<number> => {
    // const response = await axios.get<ZigPriceResponse>(
    //     "https://pro-api.coingecko.com/api/v3/simple/price?ids=zignaly&vs_currencies=usd",
    //     {
    //         headers: {
    //             "x-cg-pro-api-key": process.env.NEXT_PUBLIC_COINGECKO_API_KEY || "",
    //         },
    //     }
    // );
    return 1.00;
};

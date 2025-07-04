export interface CoinAttributes {
    id: number;
    user_id: number;
    factory_id: number;
    contract: string;
    token: string;
    pool?: string;
    graph?: string;
    name: string;
    symbol: string;
    description: string;
    chainId: string;
    twitter?: string;
    discord?: string;
    telegram?: string;
    website?: string;
    livestreamId?: string;
    status: string;
    logo?: string;
    featured: boolean;
    kingofthehill: boolean;
    active: boolean;
    created_at?: Date;
    updated_at?: Date;
    tradeCount?: number;
    commentCount?: number;
    HoldersCount?: number;
    user?: User;
    wishlists: WishlistAttributes[];
    targetAmount?: number;
    TokenPrice?: TokenPrice
}

export interface TokenPrice {
    symbol: string;
    pool: Pool;
    token_price: string;
    supply: string;
    reserve_uzigs: string;
    total_bought: string;
    total_sold: string;
    market_cap: string;
    price_ohlc_history?: PriceOhlcHistory[];
    liquidity: string;
    volume: string;
}

export interface Pool {
    symbol: string;
    creator: string;
    circulating_supply: string;
    reserve_zigs: string;
    trading_paused: boolean;
    graduated: boolean;
    is_bonding: boolean;
    migration_initiated: boolean;
    migration_timestamp: string;
}

export interface PriceOhlcHistory {
    time: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume?: string;
}

export interface User {
    id?: number;
    name?: string;
    address?: string;
}

export interface WishlistAttributes {
    id?: number;
}

export interface TransactionAttributes {
    id: number;
    launchpad_id: number;
    txid:string;
    address: string;
    qty: string;
    amount: string;
    zig: string;
    type: string;
    created_at: string;
    updated_at?: string;
}

export interface HoldersAttributes {
    id: number;
    launchpad_id: number;
    user_id:string;
    address: string;
    qty: string;
    prebond: boolean;
    user?: User;
    created_at: string;
    updated_at?: string;
}

export interface UserWishlistAttributes {
    id: number;
    userId: string;
    postId: string;
    createdAt?: Date;
    updatedAt?: Date;
    coin: WishlistCoinAttributes;
}

export interface WishlistCoinAttributes {
    id: number;
    user_id: number;
    factory_id: number;
    contract: string;
    token: string;
    pool?: string;
    graph?: string;
    name: string;
    symbol: string;
    description: string;
    chainId: string;
    twitter?: string;
    discord?: string;
    telegram?: string;
    website?: string;
    livestreamId?: string;
    status: string;
    logo?: string;
    featured: boolean;
    kingofthehill: boolean;
    active: boolean;
    created_at?: Date;
    updated_at?: Date;
    HoldersCount?: number;
    TradesCount?: number;
}
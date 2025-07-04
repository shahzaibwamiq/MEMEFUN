

interface CalulatePrice {
    zigPrice?: number;
    market_cap?: number;
    zigCollected?: number;
    targetPrice?: number;
    coinPriceUzig?: number;
}

export async function CalculateMarketCap(props: CalulatePrice): Promise<number | null>{
    if (props.market_cap == null || props.zigPrice == null) return null;

    const MarketCapInZig = Number(props.market_cap) / 1_000_000;
    const setMarketCap = MarketCapInZig * props.zigPrice;

    return setMarketCap;
}

export async function CalculateBondingCurve(props: CalulatePrice): Promise<number | null>{
    if (props.zigCollected == null || props.targetPrice == null || props.targetPrice === 0)
        return null;

    const bondingCurve = (props.zigCollected * 100) / props.targetPrice;

    return bondingCurve;
}

export async function CalculateTargetPriceUsd(props: CalulatePrice): Promise<number | null>{
    if (props.zigPrice == null || props.targetPrice == null || props.targetPrice === 0)
        return null;

    const Price = props.targetPrice / 1_000_000;
    const PriceUsd = Price * props.zigPrice;

    return PriceUsd;
}

export async function CalculateCoinPriceUsd(props: CalulatePrice): Promise<number | null>{
    if (props.zigPrice == null || props.coinPriceUzig == null || props.coinPriceUzig === 0)
        return null;

    const Price = props.coinPriceUzig / 1_000_000;
    const PriceUsd = Price * props.zigPrice;

    return PriceUsd;
}

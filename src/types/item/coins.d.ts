declare global {
    class CoinsPF2e implements Coins {
        constructor(data?: Coins | null);

        pp: number;
        gp: number;
        sp: number;
        cp: number;

        get copperValue(): number;
        get goldValue(): number;
        plus(coins: Coins): CoinsPF2e;
        add(coins: Coins): CoinsPF2e;
        scale(factor: number): CoinsPF2e;
        adjustForSize(size: Size): CoinsPF2e;
        toObject(): Coins;
        static fromString(coinString: string, quantity?: number): CoinsPF2e;
        static fromPrice(price: PartialPrice, factor: number): CoinsPF2e;
        toString(): string;
    }
}

export type {};

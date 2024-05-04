declare global {
    interface AddItemOptions {
        stack?: boolean;
    }

    class InventoryBulk {
        actor: ActorPF2e;
        encumberedAfterAddend: number;
        maxAddend: number;

        get encumberedAfter(): number;
        get encumberedAfterBreakdown(): string;
        get max(): number;
        get maxBreakdown(): string;
        get value(): Bulk;
        get encumberedPercentage(): number;
        get maxPercentage(): number;
        get maxPercentageInteger(): number;
        get isEncumbered(): boolean;
        get isOverMax(): boolean;
        get bulk(): number;

        static computeTotalBulk(items: PhysicalItemPF2e[], actorSize: Size): Bulk;
    }

    class ActorInventory<TActor extends ActorPF2e> extends DelegatedCollection<
        PhysicalItemPF2e<TActor>
    > {
        actor: TActor;
        bulk: InventoryBulk;

        get coins(): CoinsPF2e;
        get totalWealth(): CoinsPF2e;
        get invested(): ValueAndMax | null;

        sellAllTreasure(): Promise<void>;
        add(item: PhysicalItemPF2e, options?: AddItemOptions): Promise<void>;
        addCoins(coins: Partial<Coins>, options?: { combineStacks?: boolean }): Promise<void>;
        removeCoins(coins: Partial<Coins>, options?: { byValue?: boolean }): Promise<boolean>;
        findStackableItem(item: PhysicalItemPF2e | ItemSourcePF2e): PhysicalItemPF2e<TActor> | null;
    }
}

export type {};

declare global {
    type TreasureSource = BasePhysicalItemSource<"treasure", TreasureSystemSource>;

    interface TreasureSystemSource extends PhysicalSystemSource {
        traits: PhysicalItemTraits<never>;
        stackGroup: "coins" | "gems" | null;
        apex?: never;
        subitems?: never;
        usage?: never;
    }

    interface TreasureSystemData extends PhysicalSystemData {
        traits: PhysicalItemTraits<never>;
        equipped: TreasureEquippedData;
        usage: CarriedUsage;
        stackGroup: "coins" | "gems" | null;
        apex?: never;
        subitems?: never;
    }

    interface TreasureEquippedData extends EquippedData {
        invested?: never;
    }

    class TreasurePF2e<TParent extends ActorPF2e = ActorPF2e> extends PhysicalItemPF2e<TParent> {
        get isCoinage(): boolean;
        get denomination(): CoinDenomination | null;
    }

    interface TreasurePF2e {
        readonly _source: TreasureSource;
        system: TreasureSystemData;
    }
}

export type {};

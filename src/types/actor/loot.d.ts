declare global {
    type LootSource = BaseActorSourcePF2e<"loot", LootSystemSource>;

    interface LootSystemSource extends ActorSystemSource {
        attributes: LootAttributesSource;
        details: LootDetailsSource;
        lootSheetType: "Merchant" | "Loot";
        hiddenWhenEmpty: boolean;
        traits?: never;
    }

    interface LootAttributes
        extends Omit<LootAttributesSource, "immunities" | "weaknesses" | "resistances">,
            Omit<ActorAttributes, "perception" | "hp" | "ac"> {
        initiative?: never;
    }

    interface LootDetailsSource {
        alliance?: never;
        description: string;
        level: {
            value: number;
        };
    }

    interface LootDetails extends Omit<LootDetailsSource, "alliance">, ActorDetails {
        alliance: null;
    }

    interface LootSystemData
        extends Omit<LootSystemSource, "attributes" | "details">,
            ActorSystemData {
        attributes: LootAttributes;
        details: LootDetails;
        traits?: never;
    }

    interface LootAttributesSource extends ActorAttributesSource {
        hp?: never;
        ac?: never;
        perception?: never;
        immunities?: never;
        weaknesses?: never;
        resistances?: never;
    }

    class LootPF2e extends ActorPF2e {
        get isLoot(): boolean;
        get isMerchant(): boolean;
        get hiddenWhenEmpty(): boolean;
        get canHostRuleElements(): boolean;
        get canAct(): false;
    }

    interface LootPF2e {
        readonly _source: LootSource;
        system: LootSystemData;

        readonly saves?: never;

        get hitPoints(): null;
    }
}

export type {};

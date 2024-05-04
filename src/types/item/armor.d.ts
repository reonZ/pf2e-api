declare global {
    type ArmorSource = BasePhysicalItemSource<"armor", ArmorSystemSource>;

    type ArmorPropertyRuneType = string;

    type OtherArmorTag = "shoddy";

    type ArmorTrait = string;

    type SpecificArmorData = {
        material: ItemMaterialSource;
        runes: ArmorRuneSource;
    };

    interface ArmorTraits extends PhysicalItemTraits<ArmorTrait> {
        otherTags: OtherArmorTag[];
    }

    interface ArmorRuneData extends ArmorRuneSource {
        effects: ArmorPropertyRuneType[];
    }

    interface ArmorSystemData
        extends Omit<
                ArmorSystemSource,
                | "apex"
                | "bulk"
                | "description"
                | "hp"
                | "identification"
                | "material"
                | "price"
                | "temporary"
                | "usage"
            >,
            Omit<Investable<PhysicalSystemData>, "baseItem" | "subitems" | "traits"> {
        runes: ArmorRuneData;
        usage: WornUsage;
        stackGroup: null;
    }

    interface ArmorSystemSource extends Investable<PhysicalSystemSource> {
        traits: ArmorTraits;
        category: ArmorCategory;
        group: ArmorGroup | null;
        baseItem: BaseArmorType | null;
        acBonus: number;
        strength: number | null;
        dexCap: number;
        checkPenalty: number;
        speedPenalty: number;
        runes: ArmorRuneSource;
        specific: SpecificArmorData | null;
        subitems: PhysicalItemSource[];
        readonly usage?: never;
    }

    type ArmorRuneSource = {
        potency: ZeroToFour;
        resilient: ZeroToThree;
        property: ArmorPropertyRuneType[];
    };

    type ArmorCategory =
        | "light"
        | "unarmored"
        | "medium"
        | "heavy"
        | "light-barding"
        | "heavy-barding";

    type BaseArmorType = string;

    type ArmorGroup = "wood" | "composite" | "chain" | "cloth" | "leather" | "plate" | "skeletal";

    class ArmorPF2e<TParent extends ActorPF2e = ActorPF2e> extends PhysicalItemPF2e<TParent> {
        get isBarding(): boolean;
        get baseType(): BaseArmorType | null;
        get group(): ArmorGroup | null;
        get category(): ArmorCategory;
        get dexCap(): number;
        get strength(): number | null;
        get checkPenalty(): number;
        get speedPenalty(): number;
        get acBonus(): number;
        get isSpecific(): boolean;
    }

    interface ArmorPF2e {
        readonly _source: ArmorSource;
        system: ArmorSystemData;
    }
}

export type {};

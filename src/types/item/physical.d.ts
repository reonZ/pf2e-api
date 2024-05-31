declare global {
    type PhysicalItemType =
        | "armor"
        | "book"
        | "consumable"
        | "backpack"
        | "equipment"
        | "shield"
        | "treasure"
        | "weapon";

    type PhysicalItemSource =
        | ArmorSource
        | BookSource
        | ConsumableSource
        | ContainerSource
        | EquipmentSource
        | ShieldSource
        | TreasureSource
        | WeaponSource;

    type PhysicalItemTrait = string;

    interface PhysicalItemTraits<T extends PhysicalItemTrait> extends TraitsWithRarity<T> {
        otherTags: string[];
    }

    type BasePhysicalItemSource<
        TType extends PhysicalItemType,
        TSystemSource extends PhysicalSystemSource = PhysicalSystemSource
    > = BaseItemSourcePF2e<TType, TSystemSource>;

    interface PhysicalItemHitPoints extends PhysicalItemHPSource {
        brokenThreshold: number;
    }

    interface PhysicalItemHPSource {
        value: number;
        max: number;
    }

    interface Coins {
        pp?: number;
        gp?: number;
        sp?: number;
        cp?: number;
    }

    interface PartialPrice {
        value: Coins;
        per?: number;
    }

    interface Price extends PartialPrice {
        value: CoinsPF2e;
        per: number;
    }

    type ItemCarryType = "attached" | "dropped" | "held" | "stowed" | "worn";

    type EquippedData = {
        carryType: ItemCarryType;
        inSlot?: boolean;
        handsHeld?: ZeroToTwo;
        invested?: boolean | null;
    };

    interface IdentificationSource {
        status: IdentificationStatus;
        unidentified: MystifiedData;
        misidentified: object;
    }

    interface BulkData {
        heldOrStowed: number;
        value: number;
        per: number;
    }

    type IdentificationStatus = "identified" | "unidentified";

    interface MystifiedData {
        name: string;
        img: string;
        data: {
            description: {
                value: string;
            };
        };
    }

    interface PhysicalSystemSource extends ItemSystemSource {
        level: { value: number };
        traits: PhysicalItemTraits<PhysicalItemTrait>;
        quantity: number;
        baseItem: string | null;
        bulk: {
            value: number;
        };
        hp: PhysicalItemHPSource;
        hardness: number;
        price: PartialPrice;
        equipped: EquippedData;
        identification: IdentificationSource;
        containerId: string | null;
        material: ItemMaterialSource;
        size: Size;
        usage?: { value: string };
        activations?: Record<string, ItemActivation>;
        temporary?: boolean;
        subitems?: PhysicalItemSource[];
        apex?: {
            attribute: AttributeString;
            selected?: boolean;
        };
    }

    interface ItemActivation {
        id: string;
        description: {
            value: string;
        };
        actionCost: ActionCost;
        components: {
            command: boolean;
            envision: boolean;
            interact: boolean;
            cast: boolean;
        };
        frequency?: Frequency;
        traits: ValuesList<ActionTrait>;
    }

    type PreciousMaterialType =
        | "abysium"
        | "adamantine"
        | "dawnsilver"
        | "djezet"
        | "duskwood"
        | "inubrix"
        | "noqual"
        | "orichalcum"
        | "siccatite"
        | "silver"
        | "cold-iron"
        | "dragonhide"
        | "grisantian-pelt"
        | "keep-stone"
        | "peachwood"
        | "sisterstone"
        | "sisterstone-dusk"
        | "sisterstone-scarlet"
        | "sovereign-steel"
        | "warpglass";

    type PreciousMaterialGrade = "low" | "standard" | "high";

    interface ItemMaterialSource {
        grade: PreciousMaterialGrade | null;
        type: PreciousMaterialType | null;
    }

    interface ItemMaterialData extends ItemMaterialSource {
        effects: MaterialDamageEffect[];
    }

    interface PhysicalSystemData
        extends Omit<PhysicalSystemSource, "description">,
            Omit<ItemSystemData, "level"> {
        apex?: {
            attribute: AttributeString;
            selected: boolean;
        };
        hp: PhysicalItemHitPoints;
        price: Price;
        bulk: BulkData;
        material: ItemMaterialData;
        traits: PhysicalItemTraits<PhysicalItemTrait>;
        temporary: boolean;
        identification: IdentificationData;
        usage: UsageDetails;
        stackGroup: string | null;
    }

    interface HeldUsage {
        value: string;
        type: "held";
        where?: never;
        hands: 1 | 2;
    }

    interface WornUsage {
        value: string;
        type: "worn";
        where?: string | null;
        hands?: 0;
    }

    interface AttachedUsage {
        value: string;
        type: "attached";
        where: string;
        hands?: 0;
    }

    interface CarriedUsage {
        value: "carried";
        type: "carried";
        where?: never;
        hands?: 0;
    }

    type Investable<TData extends PhysicalSystemData | PhysicalSystemSource> = TData & {
        equipped: {
            invested: boolean | null;
        };
    };

    type UsageDetails = HeldUsage | WornUsage | AttachedUsage | CarriedUsage;

    interface IdentificationData extends IdentificationSource {
        identified: MystifiedData;
    }

    class PhysicalItemPF2e<TParent extends ActorPF2e = ActorPF2e> extends ItemPF2e<TParent> {
        subitems: Collection<PhysicalItemPF2e<TParent>>;

        get quantity(): number;
        get carryType(): ItemCarryType;
        get isInvested(): boolean | null;
        get isEquipped(): boolean;
        get isStowed(): boolean;
        get container(): ContainerPF2e<ActorPF2e> | null;
        get isHeld(): boolean;
        get assetValue(): CoinsPF2e;
        get identificationStatus(): IdentificationStatus;
        get isIdentified(): boolean;
        get isAlchemical(): boolean;
        get isMagical(): boolean;
        get isCursed(): boolean;
        get price(): Price;
        get traits(): Set<PhysicalItemTrait>;
        get isInContainer(): boolean;
        get isDamaged(): boolean;
        get isBroken(): boolean;
        get isDestroyed(): boolean;
        get hardness(): number;
        get level(): number;
        get rarity(): Rarity;
    }

    interface PhysicalItemPF2e {
        readonly _source: PhysicalItemSource;
        system: PhysicalSystemData;
    }
}

export type {};

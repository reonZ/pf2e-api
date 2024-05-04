declare global {
    type ShieldSource = BasePhysicalItemSource<"shield", ShieldSystemSource>;

    type BaseShieldType =
        | "buckler"
        | "casters-targe"
        | "dart-shield"
        | "fortress-shield"
        | "gauntlet-buckler"
        | "harnessed-shield"
        | "heavy-rondache"
        | "hide-shield"
        | "klar"
        | "meteor-shield"
        | "razor-disc"
        | "salvo-shield"
        | "steel-shield"
        | "swordstealer-shield"
        | "tower-shield"
        | "wooden-shield";

    type ShieldTrait =
        | "fire"
        | "arcane"
        | "divine"
        | "holy"
        | "magical"
        | "metal"
        | "occult"
        | "primal"
        | "unholy"
        | "water"
        | "wood"
        | "air"
        | "earth"
        | "apex"
        | "invested"
        | "inscribed"
        | "deflecting-bludgeoning"
        | "deflecting-physical-ranged"
        | "deflecting-piercing"
        | "deflecting-slashing"
        | "foldaway"
        | "harnessed"
        | "hefty-2"
        | "integrated-1d6-b"
        | "integrated-1d6-p"
        | "integrated-1d6-s"
        | "integrated-1d6-s-versatile-p"
        | "launching-dart"
        | "shield-throw-20"
        | "shield-throw-30";

    interface ShieldSystemSource extends PhysicalSystemSource {
        traits: ShieldTraitsSource;
        baseItem: BaseShieldType | null;
        acBonus: number;
        speedPenalty: number;
        specific: SpecificShieldData | null;
        runes: ShieldRuneData;
        readonly usage?: never;
        subitems: PhysicalItemSource[];
    }

    interface IntegratedWeaponSource {
        runes: WeaponRuneSource;
        versatile: { selected: DamageType } | null;
    }

    interface IntegratedWeaponData extends IntegratedWeaponSource {
        damageType: DamageType;
        versatile: { options: DamageType[]; selected: DamageType } | null;
    }

    interface ShieldTraitsSource extends PhysicalItemTraits<ShieldTrait> {
        integrated: IntegratedWeaponSource | null;
    }

    type ShieldRuneData = { reinforcing: ZeroToSix };

    interface SpecificShieldData extends Pick<ShieldSystemSource, "material" | "runes"> {
        integrated: { runes: Omit<WeaponRuneData, "effects"> } | null;
    }

    interface ShieldSystemData
        extends Omit<
                ShieldSystemSource,
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
            Omit<PhysicalSystemData, "baseItem" | "subitems" | "traits"> {
        traits: ShieldTraits;
        usage: HeldUsage;
        stackGroup: null;
    }

    interface ShieldTraits extends ShieldTraitsSource {
        integrated: IntegratedWeaponData | null;
    }

    class ShieldPF2e<TParent extends ActorPF2e = ActorPF2e> extends PhysicalItemPF2e<TParent> {
        get baseType(): BaseShieldType | null;
        get isBuckler(): boolean;
        get isTowerShield(): boolean;
        get speedPenalty(): number;
        get acBonus(): number;
        get isSpecific(): boolean;
        get isRaised(): boolean;
    }

    interface ShieldPF2e {
        readonly _source: ShieldSource;
        system: ShieldSystemData;

        get traits(): Set<ShieldTrait>;
    }
}

export type {};

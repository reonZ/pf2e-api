declare global {
    type WeaponCategory = "unarmed" | "simple" | "martial" | "advanced";

    type WeaponTrait = string;
    type OtherWeaponTag = "improvised" | "shoddy";

    interface WeaponTraitsSource extends PhysicalItemTraits<WeaponTrait> {
        otherTags: OtherWeaponTag[];
        toggles?: {
            doubleBarrel?: { selected: boolean };
            modular?: { selected: DamageType | null };
            versatile?: { selected: DamageType | null };
        };
    }

    type WeaponMaterialType = Exclude<PreciousMaterialType, "dragonhide" | "grisantian-pelt">;

    interface WeaponMaterialSource extends ItemMaterialSource {
        type: WeaponMaterialType | null;
    }

    type WeaponGroup =
        | "axe"
        | "bomb"
        | "bow"
        | "brawling"
        | "club"
        | "crossbow"
        | "dart"
        | "firearm"
        | "flail"
        | "hammer"
        | "knife"
        | "pick"
        | "polearm"
        | "shield"
        | "sling"
        | "spear"
        | "sword";

    interface WeaponPersistentDamage {
        number: number;
        faces: 4 | 6 | 8 | 10 | 12 | null;
        type: DamageType;
    }

    interface WeaponDamage {
        dice: number;
        die: DamageDieSize | null;
        damageType: DamageType;
        modifier: number;
        persistent: WeaponPersistentDamage | null;
    }

    type WeaponRangeIncrement =
        | 20
        | 10
        | 15
        | 30
        | 40
        | 50
        | 100
        | 200
        | 300
        | 60
        | 80
        | 70
        | 90
        | 110
        | 120
        | 140
        | 150
        | 180
        | 240;

    type WeaponReloadTime = "-" | "0" | "1" | "2" | "3" | "10";

    type WeaponPropertyRuneType = string;

    type WeaponRuneSource = {
        potency: ZeroToFour;
        striking: ZeroToThree;
        property: WeaponPropertyRuneType[];
    };

    type MeleeWeaponGroup =
        | "axe"
        | "brawling"
        | "club"
        | "dart"
        | "flail"
        | "hammer"
        | "knife"
        | "pick"
        | "polearm"
        | "shield"
        | "spear"
        | "sword";

    interface ComboWeaponMeleeUsage {
        damage: { type: DamageType; die: DamageDieSize };
        group: MeleeWeaponGroup;
        traits?: WeaponTrait[];
        traitToggles?: { modular: DamageType | null; versatile: DamageType | null };
    }

    type SpecificWeaponData = {
        material: WeaponMaterialSource;
        runes: WeaponRuneSource;
    };

    interface WeaponSystemSource extends Investable<PhysicalSystemSource> {
        traits: WeaponTraitsSource;
        material: WeaponMaterialSource;
        category: WeaponCategory;
        group: WeaponGroup | null;
        baseItem: BaseWeaponType | null;
        bonus: {
            value: number;
        };
        damage: WeaponDamage;
        bonusDamage: {
            value: number;
        };
        splashDamage: {
            value: number;
        };
        range: WeaponRangeIncrement | null;
        maxRange?: number | null;
        reload: {
            value: WeaponReloadTime | null;
        };
        usage: {
            canBeAmmo?: boolean;
            value:
                | "worngloves"
                | "held-in-one-hand"
                | "held-in-one-plus-hands"
                | "held-in-two-hands";
        };
        runes: WeaponRuneSource;
        attribute?: AttributeString | null;
        meleeUsage?: ComboWeaponMeleeUsage;
        specific: SpecificWeaponData | null;
        graspingAppendage?: boolean;
        subitems: PhysicalItemSource[];
        property1: {
            value: string;
            dice: number;
            die: DamageDieSize;
            damageType: DamageType | "";
            critDice: number;
            critDie: DamageDieSize;
            critDamage: string;
            critDamageType: DamageType | "";
        };
        selectedAmmoId: string | null;
    }

    type WeaponSource = BasePhysicalItemSource<"weapon", WeaponSystemSource> & {
        flags: DeepPartial<WeaponFlags>;
    };

    type WeaponFlags = ItemFlagsPF2e & {
        pf2e: {
            battleForm?: boolean;
            comboMeleeUsage: boolean;
            fixedAttack?: number | null;
            attackItemBonus: number;
            damageFacesUpgraded: boolean;
        };
    };

    interface WeaponTraits extends WeaponTraitsSource {
        otherTags: OtherWeaponTag[];
        toggles: WeaponTraitToggles;
    }

    interface WeaponMaterialData extends ItemMaterialData {
        type: WeaponMaterialType | null;
    }

    interface WeaponRuneData extends WeaponRuneSource {
        effects: WeaponPropertyRuneType[];
    }

    type WeaponUsageDetails = UsageDetails & Required<WeaponSystemSource["usage"]>;

    interface WeaponSystemData
        extends Omit<
                WeaponSystemSource,
                "apex" | "bulk" | "description" | "hp" | "identification" | "price" | "temporary"
            >,
            Omit<Investable<PhysicalSystemData>, "material" | "subitems"> {
        traits: WeaponTraits;
        baseItem: BaseWeaponType | null;
        material: WeaponMaterialData;
        maxRange: number | null;
        reload: {
            value: WeaponReloadTime | null;
            /** Whether the ammunition (or the weapon itself, if thrown) should be consumed upon firing */
            consume: boolean | null;
            /** A display label for use in any view */
            label: string | null;
        };
        runes: WeaponRuneData;
        usage: WeaponUsageDetails;
        graspingAppendage: boolean;
        meleeUsage?: Required<ComboWeaponMeleeUsage>;
        stackGroup: null;
    }

    class WeaponTraitToggles {}

    class WeaponPF2e<TParent extends ActorPF2e = ActorPF2e> extends PhysicalItemPF2e<TParent> {}

    interface WeaponPF2e {
        flags: WeaponFlags;
        readonly _source: WeaponSource;
        system: WeaponSystemData;

        get traits(): Set<WeaponTrait>;
    }
}

export type {};

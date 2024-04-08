declare global {
    type ConsumableSource = BasePhysicalItemSource<"consumable", ConsumableSystemSource>;

    type ConsumableTrait = string;
    type OtherConsumableTag = "herbal";

    type ConsumableCategory =
        | "scroll"
        | "wand"
        | "poison"
        | "catalyst"
        | "elixir"
        | "fulu"
        | "gadget"
        | "mutagen"
        | "oil"
        | "potion"
        | "snare"
        | "talisman"
        | "drug"
        | "ammo"
        | "other"
        | "toolkit";

    interface ConsumableTraits extends PhysicalItemTraits<ConsumableTrait> {
        otherTags: OtherConsumableTag[];
    }

    type ConsumableUses = {
        value: number;
        max: number;
        /** Whether to delete the consumable upon use if it has no remaining uses and a quantity of 1 */
        autoDestroy: boolean;
    };

    type ConsumableDamageHealing = {
        formula: string;
        type: DamageType;
        kind: DamageKind;
    };

    type AmmoStackGroup =
        | "arrows"
        | "blowgunDarts"
        | "bolts"
        | "rounds5"
        | "rounds10"
        | "slingBullets"
        | "sprayPellets"
        | "woodenTaws";

    interface ConsumableSystemSource extends PhysicalSystemSource {
        apex?: never;
        traits: ConsumableTraits;
        category: ConsumableCategory;
        uses: ConsumableUses;
        /** A formula for a healing or damage roll */
        damage: ConsumableDamageHealing | null;
        spell: SpellSource | null;
        usage: { value: string };
        stackGroup: AmmoStackGroup | null;
        subitems?: never;
    }

    interface ConsumableSystemData
        extends Omit<
                ConsumableSystemSource,
                | "bulk"
                | "description"
                | "hp"
                | "identification"
                | "material"
                | "price"
                | "temporary"
                | "usage"
            >,
            Omit<PhysicalSystemData, "subitems" | "traits"> {
        apex?: never;
        stackGroup: AmmoStackGroup | null;
    }

    class ConsumablePF2e<TParent extends ActorPF2e = ActorPF2e> extends PhysicalItemPF2e<TParent> {
        get uses(): ValueAndMax;
    }

    interface ConsumablePF2e {
        readonly _source: ConsumableSource;
        system: ConsumableSystemData;
    }
}

export type {};

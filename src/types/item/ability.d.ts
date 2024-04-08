declare global {
    type AbilitySource = BaseItemSourcePF2e<"action", AbilitySystemSource>;

    type ActionCategory = "familiar" | "interaction" | "defensive" | "offensive";

    interface AbilityTraitsSource extends ItemTraitsNoRarity<ActionTrait> {
        toggles?: { mindshift?: { selected?: boolean } | null };
    }

    interface AbilitySystemSource extends ItemSystemSource {
        traits: AbilityTraitsSource;
        actionType: {
            value: ActionType;
        };
        actions: {
            value: OneToThree | null;
        };
        category: ActionCategory | null;
        deathNote: boolean;
        frequency?: FrequencySource;
        selfEffect?: SelfEffectReferenceSource | null;
        level?: never;
    }

    interface AbilityTraits extends AbilityTraitsSource {
        toggles: AbilityTraitToggles;
    }

    interface AbilitySystemData
        extends Omit<AbilitySystemSource, "description">,
            Omit<ItemSystemData, "level"> {
        traits: AbilityTraits;
        frequency?: Frequency;
        selfEffect: SelfEffectReference | null;
    }

    class AbilityTraitToggles {}

    class AbilityItemPF2e<TParent extends ActorPF2e = ActorPF2e> extends ItemPF2e<TParent> {}

    interface AbilityItemPF2e {
        readonly _source: AbilitySource;
        system: AbilitySystemData;
    }
}

export type {};

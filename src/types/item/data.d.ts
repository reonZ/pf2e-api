declare global {
    type ItemTrait = string;

    interface ItemTraits<T extends ItemTrait = ItemTrait> {
        value: string[];
        rarity: Rarity;
        otherTags: string[];
    }

    interface ItemTraitsNoRarity<T extends ItemTrait = ItemTrait>
        extends Omit<ItemTraits<T>, "rarity"> {
        rarity?: never;
    }
}

export type {};

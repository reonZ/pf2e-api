declare global {
    type ItemTrait = string;

    interface ItemTraits<T extends ItemTrait = ItemTrait> {
        value: string[];
        rarity: Rarity;
        otherTags: string[];
    }

    type RangeData = {
        increment: number | null;
        max: number;
    };

    interface ItemTraitsNoRarity<T extends ItemTrait = ItemTrait>
        extends Omit<ItemTraits<T>, "rarity"> {
        rarity?: never;
    }

    type CoinDenomination = "pp" | "gp" | "sp" | "cp";

    interface ParentedDataModelConstructionOptions<TParent extends FoundryDocument>
        extends DataModelConstructionOptions<TParent> {
        parent: TParent;
    }
}

export type {};

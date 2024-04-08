declare global {
    interface ValueAndMaybeMax {
        value: number;
        max?: number;
    }

    interface ValueAndMax extends Required<ValueAndMaybeMax> {}

    interface TraitsWithRarity<T extends string> {
        value: T[];
        rarity: Rarity;
    }

    interface ValuesList<T extends string = string> {
        value: T[];
    }

    type SetElement<TSet extends Set<unknown>> = TSet extends Set<infer TElement>
        ? TElement
        : never;

    type PreCreate<T extends DocumentSourceData> = DeepPartial<T> &
        Required<Pick<T, "name" | "type">>;

    type EmbeddedDocumentUpdateData<T extends DocumentSourceData> = Partial<Omit<T, "_id">> &
        Required<Pick<T, "_id">> & {
            [key: string]: unknown;
        };

    type EmbeddedItemInstances<TParent extends ActorPF2e> = {
        [K in keyof ItemInstances<TParent>]: ItemInstances<TParent>[K][];
    };
}

export type {};

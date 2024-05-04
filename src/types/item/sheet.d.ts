declare global {
    class ItemSheetPF2e<TItem extends ItemPF2e = ItemPF2e> extends ItemSheet<TItem> {
        item: TItem;
    }

    class LootSheetPF2e extends ActorSheetPF2e<LootPF2e> {}

    interface LootSheetDataPF2e extends ActorSheetDataPF2e<LootPF2e> {
        isLoot: boolean;
    }
}

export type {};

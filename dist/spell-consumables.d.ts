declare function createConsumableFromSpell(spell: SpellPF2e, { type, heightenedLevel, mystified, temp, itemName, itemImg, }: {
    type: SpellConsumableItemType;
    heightenedLevel?: number;
    mystified?: boolean;
    temp?: boolean;
    itemName?: string;
    itemImg?: string;
}): Promise<PreCreate<ConsumableSource>>;
export { createConsumableFromSpell };

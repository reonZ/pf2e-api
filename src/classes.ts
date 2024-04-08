function getStatisticClass(statistic: Statistic) {
    return statistic.constructor as typeof Statistic;
}

function getSpellCollectionClass<TParent extends CreaturePF2e>(actor: TParent) {
    return actor.spellcasting.get("rituals")!.spells!
        .constructor as typeof SpellCollection<TParent>;
}

function getSpellClass() {
    return CONFIG.PF2E.Item.documentClasses.spell;
}

export { getSpellClass, getStatisticClass, getSpellCollectionClass };

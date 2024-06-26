declare function getStatisticClass(statistic: Statistic): typeof Statistic;
declare function getSpellCollectionClass<TParent extends CreaturePF2e>(actor: TParent): typeof SpellCollection<TParent>;
declare function getSpellClass(): typeof SpellPF2e;
declare function getDamageRollClass(): typeof DamageRoll;
export { getDamageRollClass, getSpellClass, getStatisticClass, getSpellCollectionClass };

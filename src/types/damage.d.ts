declare global {
    type DamageKind = "damage" | "healing";

    type DamageDieSize = "d10" | "d12" | "d4" | "d6" | "d8";

    type DamageType =
        | "acid"
        | "bleed"
        | "bludgeoning"
        | "cold"
        | "electricity"
        | "fire"
        | "force"
        | "mental"
        | "piercing"
        | "poison"
        | "slashing"
        | "sonic"
        | "spirit"
        | "vitality"
        | "void"
        | "untyped";

    type DamageCategoryUnique = "precision" | "splash" | "persistent";

    type DamageCategory =
        | "abysium"
        | "adamantine"
        | "dawnsilver"
        | "djezet"
        | "duskwood"
        | "energy"
        | "inubrix"
        | "noqual"
        | "orichalcum"
        | "physical"
        | "siccatite"
        | "silver"
        | "precision"
        | "splash"
        | "cold-iron"
        | "keep-stone"
        | "peachwood"
        | "sisterstone-dusk"
        | "sisterstone-scarlet"
        | "sovereign-steel"
        | "warpglass"
        | "persistent";

    type MaterialDamageEffect =
        | "abysium"
        | "adamantine"
        | "dawnsilver"
        | "djezet"
        | "duskwood"
        | "inubrix"
        | "noqual"
        | "orichalcum"
        | "siccatite"
        | "silver"
        | "cold-iron"
        | "keep-stone"
        | "peachwood"
        | "sisterstone-dusk"
        | "sisterstone-scarlet"
        | "sovereign-steel"
        | "warpglass";
}

export type {};

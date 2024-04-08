declare global {
    type DeitySource = BaseItemSourcePF2e<"deity", DeitySystemSource>;

    type Sanctification = "holy" | "unholy";
    type DeityDomain = string;
    type BaseWeaponType = string;

    type DeitySystemSource = ItemSystemSource & {
        category: "deity" | "pantheon" | "philosophy";
        sanctification: DeitySanctification | null;
        domains: {
            primary: DeityDomain[];
            alternate: DeityDomain[];
        };
        font: DivineFonts;
        attribute: AttributeString[];
        skill: SkillLongForm[] | null;
        weapons: BaseWeaponType[];
        spells: Record<number, ItemUUID>;
        level?: never;
        traits: OtherTagsOnly;
    };

    type DeitySanctification = { modal: "can" | "must"; what: Sanctification[] };

    type DivineFonts = ["harm"] | ["heal"] | ["harm", "heal"] | never[];

    interface DeitySystemData
        extends Omit<DeitySystemSource, "description">,
            Omit<ItemSystemData, "level" | "traits"> {}
}

export type {};

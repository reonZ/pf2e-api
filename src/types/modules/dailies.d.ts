declare global {
    namespace dailies {
        type StaffPF2e = WeaponPF2e<CharacterPF2e> | EquipmentPF2e<CharacterPF2e>;

        type StaffFlags = {
            staffId: string;
            charges: {
                value: number;
                max: number;
            };
            expended: boolean;
            spells: SpellSource[];
            statistic?: {
                slug: string;
                tradition: MagicTradition;
            };
        };
    }
}

export type {};

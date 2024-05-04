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

    class PF2eDailiesModule extends Module {
        api: {
            canCastRank: (actor: CharacterPF2e, rank: ZeroToTen) => boolean | null;
            setStaffChargesValue: (
                actor: CharacterPF2e,
                value?: number | undefined
            ) => Promise<FoundryDocument<any>> | undefined;
            openDailiesInterface: (actor: CharacterPF2e) => Promise<void>;
        };
    }
}

export type {};

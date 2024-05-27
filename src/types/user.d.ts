declare global {
    type UserVisibility = "none" | "all" | "owner" | "gm";

    interface UserSettingsPF2e {
        showEffectPanel: boolean;
        showCheckDialogs: boolean;
        showDamageDialogs: boolean;
        monochromeDarkvision: boolean;
        searchPackContents: boolean;
    }

    class UserPF2e extends User {
        targets: Set<TokenPF2e> & { ids: string[] };

        get character(): ActorPF2e | null;
        get settings(): Readonly<UserSettingsPF2e>;

        getActiveTokens(): TokenDocumentPF2e[];
    }
}

export type {};

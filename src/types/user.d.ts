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
        get settings(): Readonly<UserSettingsPF2e>;

        getActiveTokens(): TokenDocumentPF2e[];
    }
}

export type {};

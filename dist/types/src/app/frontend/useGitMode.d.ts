export declare const useGitMode: () => {
    mode: "dev" | "static" | "git";
    setMode: import("react").Dispatch<import("react").SetStateAction<"dev" | "static" | "git">>;
    isStatic: boolean;
    isDev: boolean;
    isGit: boolean;
};

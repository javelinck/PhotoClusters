import React, { createContext, useContext, useMemo, useState } from "react";

export type ClusterMode = "time"

export type ClusteringSettings = {
	mode: ClusterMode;
	gapMinutes: number;
};

type SettingsState = {
	settings: ClusteringSettings;
	setSettings: (next: ClusteringSettings) => void;
	patchSettings: (patch: Partial<ClusteringSettings>) => void;
};

const Ctx = createContext<SettingsState | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
	const [settings, setSettings] = useState<ClusteringSettings>({
		mode: "time",
		gapMinutes: 90,
	});

	const value = useMemo<SettingsState>(
		() => ({
			settings,
			setSettings,
			patchSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
		}),
		[settings]
	);

	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useSettings = () => {
	const v = useContext(Ctx);
	if (!v) throw new Error("useSettings must be used inside SettingsProvider");
	return v;
};

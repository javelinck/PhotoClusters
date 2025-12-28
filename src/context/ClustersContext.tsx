import React, { createContext, useContext, useMemo, useState } from "react";
import type * as MediaLibrary from "expo-media-library";
import type { Cluster } from "../clustering/types";

type ClustersState = {
	clusters: Cluster[];
	assetsById: Record<string, MediaLibrary.Asset>;
	setData: (clusters: Cluster[], assetsById: Record<string, MediaLibrary.Asset>) => void;
};

const Ctx = createContext<ClustersState | null>(null);

export const ClustersProvider = ({ children }: { children: React.ReactNode }) => {
	const [clusters, setClusters] = useState<Cluster[]>([]);
	const [assetsById, setAssetsById] = useState<Record<string, MediaLibrary.Asset>>({});

	const value = useMemo<ClustersState>(
		() => ({
			clusters,
			assetsById,
			setData: (c, map) => {
				setClusters(c);
				setAssetsById(map);
			},
		}),
		[clusters, assetsById]
	);

	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useClusters = () => {
	const v = useContext(Ctx);
	if (!v) throw new Error("useClusters must be used inside ClustersProvider");
	return v;
};

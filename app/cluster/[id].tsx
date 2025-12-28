import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useClusters } from '@/src/context/ClustersContext';

export default function ClusterScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { clusters, assetsById } = useClusters();

	const cluster = useMemo(() => clusters.find((c) => c.id === id), [clusters, id]);

	if (!cluster) {
		return (
			<View style={{ padding: 16 }}>
				<Text>Cluster not found. Go back and scan again.</Text>
			</View>
		);
	}

	const assets = cluster.assetIds
		.map((assetId) => assetsById[assetId])
		.filter(Boolean);

	return (
		<FlatList
			data={assets}
			keyExtractor={(item) => item.id}
			numColumns={3}
			contentContainerStyle={{ padding: 6, paddingBottom: 24 }}
			ListHeaderComponent={
				<View style={{ padding: 10, gap: 4 }}>
					<Text style={{ fontWeight: "800", fontSize: 16 }}>{cluster.title}</Text>
					<Text style={{ color: "#666" }}>{cluster.count} photos</Text>
				</View>
			}
			renderItem={({ item }) => (
				<View style={{ width: "33.3333%", aspectRatio: 1, padding: 4 }}>
					<Image
						source={{ uri: item.uri }}
						style={{ width: "100%", height: "100%", borderRadius: 8, backgroundColor: "#f2f2f2" }}
					/>
				</View>
			)}
		/>
	);
}

import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import { Image } from "expo-image";

import { useClusters } from '@/src/context/ClustersContext';
import { useSettings } from '@/src/context/SettingsContext';
import { clusterByTime } from '@/src/clustering/clusterByTime';

const PAGE_SIZE = 400;

export default function ClustersTab() {
  const { clusters, setData } = useClusters();
  const { settings } = useSettings();

  const [perm, requestPermission] = MediaLibrary.usePermissions();
  const [loading, setLoading] = useState(false);
  const [scannedCount, setScannedCount] = useState(0);

  const canRead = perm?.granted;

  const scanLibrary = useCallback(async () => {
    try {
      setLoading(true);
      setScannedCount(0);

      const all: MediaLibrary.Asset[] = [];
      let after: string | undefined;

      while (true) {
        const page = await MediaLibrary.getAssetsAsync({
          first: PAGE_SIZE,
          after,
          mediaType: MediaLibrary.MediaType.photo,
          sortBy: [MediaLibrary.SortBy.creationTime],
        });

        all.push(...page.assets);
        setScannedCount(all.length);

        if (!page.hasNextPage) break;
        after = page.endCursor ?? undefined;
      }

      const assetsById = Object.fromEntries(
        all.map((a) => [a.id, a])
      ) as Record<string, MediaLibrary.Asset>;

      const clustered = clusterByTime(all, {
        gapMinutes: settings.gapMinutes,
        minClusterSize: 1,
      });

      setData(clustered, assetsById);
    } catch (e: any) {
      Alert.alert("Scan failed", e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [setData, settings.gapMinutes]);

  const header = useMemo(() => {
    const access = perm?.accessPrivileges;

    return (
      <View style={{ padding: 16, gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "800" }}>
          Photo Clusters (time)
        </Text>

        <Text style={{ color: "#666" }}>
          Threshold:{" "}
          <Text style={{ fontWeight: "800" }}>{settings.gapMinutes} minutes</Text>
        </Text>

        {!canRead ? (
          <Pressable
            onPress={async () => {
              const res = await requestPermission();
              if (!res.granted) {
                Alert.alert(
                  "Permission needed",
                  "Please allow access to your photo library."
                );
              }
            }}
            style={{
              backgroundColor: "black",
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderRadius: 10,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              Grant Photo Access
            </Text>
          </Pressable>
        ) : (
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Pressable
              onPress={scanLibrary}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#333" : "black",
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>
                {loading ? "Scanning..." : "Scan Library"}
              </Text>
            </Pressable>

            {access === "limited" ? (
              <Pressable
                onPress={() => MediaLibrary.presentPermissionsPickerAsync()}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#111",
                }}
              >
                <Text style={{ fontWeight: "700" }}>Choose More Photos</Text>
              </Pressable>
            ) : null}
          </View>
        )}

        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ActivityIndicator />
            <Text>Scanned: {scannedCount} photos</Text>
          </View>
        ) : (
          <Text style={{ color: "#444" }}>
            Clusters:{" "}
            <Text style={{ fontWeight: "800" }}>{clusters.length}</Text>
          </Text>
        )}
      </View>
    );
  }, [
    canRead,
    clusters.length,
    loading,
    perm?.accessPrivileges,
    requestPermission,
    scanLibrary,
    scannedCount,
    settings.gapMinutes,
  ]);

  return (
    <FlatList
      data={clusters}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={header}
      contentContainerStyle={{ paddingBottom: 24 }}
      renderItem={({ item }) => (
        <Link href={{ pathname: "/cluster/[id]", params: { id: item.id } }} asChild>
          <Pressable
            style={{
              marginHorizontal: 16,
              marginBottom: 12,
              borderRadius: 14,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#eee",
              backgroundColor: "white",
              flexDirection: "row",
            }}
          >
            <Image
              source={{ uri: item.coverUri }}
              style={{ width: 90, height: 90, backgroundColor: "#f2f2f2" }}
              contentFit="cover"
            />
            <View style={{ padding: 12, flex: 1, gap: 4 }}>
              <Text numberOfLines={2} style={{ fontWeight: "800" }}>
                {item.title}
              </Text>
              <Text style={{ color: "#666" }}>{item.count} photos</Text>
            </View>
          </Pressable>
        </Link>
      )}
      ListEmptyComponent={
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ color: "#666" }}>
            No clusters yet. Grant permission and press “Scan Library”.
          </Text>
        </View>
      }
    />
  );
}

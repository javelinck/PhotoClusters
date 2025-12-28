import type * as MediaLibrary from "expo-media-library";
import type { Cluster } from "./types";
import { dayPart, formatTimeRange } from "../utils/time";

export type ClusterByTimeOptions = {
	gapMinutes?: number;
	minClusterSize?: number;
};

export const clusterByTime = (
	assets: MediaLibrary.Asset[],
	options: ClusterByTimeOptions = {}
): Cluster[] => {
	const gapMinutes = options.gapMinutes ?? 90;
	const minClusterSize = options.minClusterSize ?? 1;
	const gapMs = gapMinutes * 60 * 1000;

	if (!assets.length) return [];

	const sorted = [...assets].sort((a, b) => a.creationTime - b.creationTime);

	const clusters: Cluster[] = [];

	let bucket: {
		startTime: number;
		endTime: number;
		coverUri: string;
		assetIds: string[];
	} | null = null;

	for (const a of sorted) {
		if (!bucket) {
			bucket = {
				startTime: a.creationTime,
				endTime: a.creationTime,
				coverUri: a.uri,
				assetIds: [a.id],
			};
			continue;
		}

		const diff = a.creationTime - bucket.endTime;
		const needNewCluster = diff > gapMs;

		if (needNewCluster) {
			if (bucket.assetIds.length >= minClusterSize) {
				const title = `${formatTimeRange(bucket.startTime, bucket.endTime)} • ${dayPart(
					bucket.startTime
				)}`;

				clusters.push({
					id: `${bucket.startTime}-${bucket.endTime}-${clusters.length}`,
					title,
					startTime: bucket.startTime,
					endTime: bucket.endTime,
					coverUri: bucket.coverUri,
					assetIds: bucket.assetIds,
					count: bucket.assetIds.length,
				});
			}

			bucket = {
				startTime: a.creationTime,
				endTime: a.creationTime,
				coverUri: a.uri,
				assetIds: [a.id],
			};
		} else {
			bucket.endTime = a.creationTime;
			bucket.assetIds.push(a.id);
			bucket.coverUri = a.uri;
		}
	}

	if (bucket && bucket.assetIds.length >= minClusterSize) {
		const title = `${formatTimeRange(bucket.startTime, bucket.endTime)} • ${dayPart(
			bucket.startTime
		)}`;

		clusters.push({
			id: `${bucket.startTime}-${bucket.endTime}-${clusters.length}`,
			title,
			startTime: bucket.startTime,
			endTime: bucket.endTime,
			coverUri: bucket.coverUri,
			assetIds: bucket.assetIds,
			count: bucket.assetIds.length,
		});
	}

	return clusters.sort((a, b) => b.startTime - a.startTime);
};

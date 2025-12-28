# Photo Clusters (Expo SDK 52+ / TypeScript / Expo Router)


## Tech Stack

- Expo SDK 52+
- TypeScript
- Expo Router
- `expo-media-library` — access to device photo library
- `expo-image` — reliable rendering of iOS `ph://...` asset URIs

---

## How to Run

1) Install dependencies

    ```bash
    npm install
    ```

2) Start the project

    ```bash
    npx expo start
    ```

3) Open the app on a real device using **Expo Go**.

---

## Permissions (Photos)

The app requests Photos permission on first launch.

- If permission is denied, the app shows a **Grant Photo Access** button.
- On iOS, the user may select **Limited Access**.  
  In that case, clustering uses only the allowed subset of photos, and the app provides a **Choose More Photos** action via the system picker.

---

## Clustering Approach (Version A: Time-based “Event Clustering”)

### Why time-based clustering?
Time is the most reliable signal available for every photo:
- works offline (no backend / no AI / no internet)
- produces predictable event-like clusters (walk / dinner / trip segment)

This is a strong baseline that can later be extended with geo or AI if needed.

### Algorithm
Implemented in `src/clustering/clusterByTime.ts`.

1. Load photo assets using `expo-media-library` (with pagination to support large libraries).
2. Sort photos by `creationTime`.
3. Walk through photos and build clusters:
   - If the time gap between consecutive photos is **greater than `gapMinutes`**, start a new cluster.
   - Otherwise add the photo to the current cluster.

Each cluster stores:
- `startTime`, `endTime`
- `count`
- `coverUri` (most recent photo in the cluster)
- list of `assetIds` (for rendering the grid inside the cluster)

### Settings
In the **Settings** tab, the user can adjust:
- `gapMinutes` — time gap threshold between photos that starts a new cluster
  
---

## UI Flow

1. Open app → grant Photos permission
2. Go to **Clusters** tab → press **Scan Library**
3. Browse cluster list (cover + title + count)
4. Open any cluster → see a grid of photos inside

---

## Performance Considerations

Real photo libraries can contain thousands of photos. To keep the app responsive:
- assets are loaded with pagination: `getAssetsAsync({ first, after })`
- lists and grids use `FlatList`
- clustering runs in memory after scan (baseline approach)

---

## iOS Note: `ph://` URIs

On iOS, gallery assets may return `uri` in the `ph://...` format (Photos framework).  
React Native’s default `<Image />` does not reliably render these URIs.

This project uses **`expo-image`** to correctly render `ph://` assets and improve performance.

---

## Future Improvements

- Recluster without re-scan (store scanned assets and recompute on settings change)
- Reduce noise by merging single-photo clusters into nearby clusters
- Add optional geo (EXIF) clustering when location exists
- Cache clusters in local storage (`expo-sqlite`) to avoid full rescans

---

import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSettings, type ClusterMode } from '@/src/context/SettingsContext';

const Option = ({
									label,
									value,
									selected,
									onPress,
								}: {
	label: string;
	value: ClusterMode;
	selected: boolean;
	onPress: () => void;
}) => (
	<Pressable
		onPress={onPress}
		style={{
			padding: 14,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: selected ? "black" : "#ddd",
			backgroundColor: selected ? "#f2f2f2" : "white",
		}}
	>
		<Text style={{ fontWeight: "700" }}>{label}</Text>
		<Text style={{ color: "#666", marginTop: 4 }}>{value}</Text>
	</Pressable>
);

const timeArray = [60, 90, 120, 150, 180, 210, 240];

export default function SettingsTab() {
	const { settings, patchSettings } = useSettings();

	return (
		<View style={{ padding: 16, gap: 12 }}>
			<Text style={{ fontSize: 18, fontWeight: "800" }}>Clustering mode</Text>

			<Option
				label="Time"
				value="time"
				selected={settings.mode === "time"}
				onPress={() => patchSettings({ mode: "time" })}
			/>

			<Text style={{ fontSize: 16, fontWeight: "800" }}>Thresholds</Text>

			<View style={{ gap: 8 }}>
				<Text>Time gap (minutes): {settings.gapMinutes}</Text>
				<View style={{ flexDirection: "row", gap: 8, flexWrap:'wrap' }}>
					{timeArray.map((v) => (
						<Pressable
							key={v}
							onPress={() => patchSettings({ gapMinutes: v })}
							style={{
								paddingVertical: 10,
								paddingHorizontal: 12,
								borderRadius: 10,
								borderWidth: 1,
								borderColor: settings.gapMinutes === v ? "black" : "#ddd",
							}}
						>
							<Text style={{ fontWeight: "700" }}>{v}</Text>
						</Pressable>
					))}
				</View>
			</View>
		</View>
	);
}

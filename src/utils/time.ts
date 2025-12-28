export const formatTimeRange = (startMs: number, endMs: number) => {
	const start = new Date(startMs);
	const end = new Date(endMs);

	const sameDay =
		start.getFullYear() === end.getFullYear() &&
		start.getMonth() === end.getMonth() &&
		start.getDate() === end.getDate();

	const dateFmt = new Intl.DateTimeFormat(undefined, {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

	const timeFmt = new Intl.DateTimeFormat(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});

	return sameDay
		? `${dateFmt.format(start)} • ${timeFmt.format(start)}–${timeFmt.format(end)}`
		: `${dateFmt.format(start)} ${timeFmt.format(start)} – ${dateFmt.format(end)} ${timeFmt.format(end)}`;
};

export const dayPart = (ms: number) => {
	const h = new Date(ms).getHours();
	if (h < 6) return "Night";
	if (h < 12) return "Morning";
	if (h < 18) return "Day";
	return "Evening";
};

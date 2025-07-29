export function formatDateTime(dateStr: string, timeStr: string) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const dateObj = new Date(dateStr);
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);

    return dateObj.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

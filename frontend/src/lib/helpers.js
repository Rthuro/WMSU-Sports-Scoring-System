
export function capitalizeFirstLetter(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

export function formatDateNumber(date) {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = d.getDate();
    const year = String(d.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
}

export function formatDateToString(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const day = String(date.getDate()).padStart(2, '0');
    return `${monthName} ${day}, ${year}`;
}

export function formatTime(dateString) {
    if (!dateString) return "";
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
}

export function getTimeStringForDB (ms) {
    const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const milliseconds = String(ms % 1000).padStart(3, "0");

    return `${minutes}:${seconds}.${milliseconds}`;
};

export function getTimeInSeconds(timeString) {
    if (!timeString) return 0;
    
    // Supports formats like "HH:MM:SS.mmm"
    const [hhmmss, ms = "0"] = timeString.split(".");
    const [hours, minutes, seconds] = hhmmss.split(":").map(Number);

    return (
        (hours || 0) * 3600000 +
        (minutes || 0) * 60000 +
        (seconds || 0) * 1000 +
        parseInt(ms.padEnd(3, "0"), 10)
    );
}
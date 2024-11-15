export function formatDateToReadable(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const options = { month: 'short', day: 'numeric' };

    const formattedDate = date.toLocaleDateString('en-US', options);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    const year = date.getFullYear();
    const includeYear = year !== now.getFullYear();
    return includeYear ? `${formattedDate.replace(day, `${day}${suffix}`)}, ${year}` : formattedDate.replace(day, `${day}${suffix}`);
}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) return 'th';
    const lastDigit = day % 10;
    switch (lastDigit) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

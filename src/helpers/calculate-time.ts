export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime(); // Difference in milliseconds

  // Calculate time difference in seconds, minutes, hours, days, months, and years
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30); // Approximate month as 30 days
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears > 1) {
    // If more than 1 year, return the exact date in a readable format
    return new Date(date).toLocaleDateString(); // e.g., "9/18/2023"
  } else if (diffYears === 1) {
    return "1 year ago";
  } else if (diffMonths > 0) {
    if (diffMonths === 1) {
      return "1 month ago";
    }
    return `${diffMonths} months ago`;
  } else if (diffDays > 0) {
    if (diffDays === 1) {
      return "1 day ago";
    }
    return `${diffDays} days ago`;
  } else if (diffHours > 0) {
    if (diffHours === 1) {
      return "1 hour ago";
    }
    return `${diffHours} hours ago`;
  } else if (diffMinutes > 0) {
    if (diffMinutes === 1) {
      return "1 minute ago";
    }
    return `${diffMinutes} minutes ago`;
  } else {
    if (diffSeconds === 1) {
      return "1 second ago";
    }
    return `${diffSeconds} seconds ago`;
  }
}

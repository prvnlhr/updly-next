/**
 * Formats a date (either ISO string or Date object) and extracts components
 * @param dateInput - Date object or ISO 8601 string
 * @returns Formatted date information
 */
export function formatDate(dateInput: string | Date): {
  formattedDate: string;
  month: string;
  date: number;
  year: number;
} {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input provided");
  }

  // Rest of the function remains the same...
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  const getOrdinalSuffix = (n: number): string => {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const formattedDate = `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;

  return {
    formattedDate,
    month,
    date: day,
    year,
  };
}

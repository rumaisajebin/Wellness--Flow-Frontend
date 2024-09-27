export const capitalizeFirstLetter = (str) => {
    return str
      ? str
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : '-';
};

export const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHours}:${minutes} ${period}`;
  };


//   export const formattedDate =
//     date instanceof Date
//       ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//           2,
//           "0"
//         )}-${String(date.getDate()).padStart(2, "0")}`
//       : date;
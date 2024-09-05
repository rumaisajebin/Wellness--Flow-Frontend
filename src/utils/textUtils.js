// src/utils/textUtils.js

/**
 * Capitalizes the first letter of each word in a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export const capitalizeFirstLetter = (str) => {
    return str
      ? str
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : '-';
  };
export const isValidRating = (rating) => rating >= 1 && rating <= 5;

export const isNonEmpty = (value) => value && value.trim().length > 0;

export const getRatingColor = (rating: number) => {
  if (rating <= 2) return "red";
  if (rating > 2 && rating < 4) return "yellow";
  if (rating >= 4 && rating <= 5) return "green";
};

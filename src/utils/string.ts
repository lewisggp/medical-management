export const formatDateForInput = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

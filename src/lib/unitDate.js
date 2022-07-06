export const unitDate = (dateString) => {
  if(!dateString) return
  return dateString.split('.').join('/');
};

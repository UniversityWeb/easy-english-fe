export const formatDate = (isoString) => {
  console.log(`isoString: ${isoString}`)
  const date = new Date(isoString);

  if (isNaN(date)) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
};
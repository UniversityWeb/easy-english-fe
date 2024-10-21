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

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export const delayLoading = async (startTime) => {
  const elapsedTime = Date.now() - startTime;
  const delay = Math.max(0, 500 - elapsedTime);
  await new Promise(resolve => setTimeout(resolve, delay));
};
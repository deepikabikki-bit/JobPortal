export const formatSalary = (salary) => {
  if (!salary || salary.isDisclosed === false) return 'Best in Industry';
  if (!salary.min && !salary.max) return 'Competitive';

  const formatNum = (num) => {
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} LPA`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(0)}k`;
    }
    return `₹${num}`;
  };

  if (salary.period === 'per month') {
    if (salary.min && salary.max) {
      return `₹${salary.min.toLocaleString('en-IN')} - ₹${salary.max.toLocaleString('en-IN')} / month`;
    }
    return `₹${(salary.max || salary.min).toLocaleString('en-IN')} / month`;
  }

  if (salary.min && salary.max) {
    return `${formatNum(salary.min)} - ${formatNum(salary.max)}`;
  }

  return formatNum(salary.max || salary.min);
};

export const timeAgo = (date) => {
  if (!date) return 'Recently';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

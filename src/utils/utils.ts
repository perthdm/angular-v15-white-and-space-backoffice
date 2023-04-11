export const API_DOMAIN = 'http://localhost:3000';

export const formatDateTime = (time?: any, type?: string) => {
  let d = time ? new Date(time) : new Date();
  let h = timeTwoDigit(d.getHours());
  let m = timeTwoDigit(d.getMinutes());
  let s = timeTwoDigit(d.getSeconds());

  if (type === 'onlyTime') {
    return `${h}:${m}:${s}`;
  } else if (type) {
    return `${d.toLocaleDateString('th-TH')}`;
  }
  return `${d.toLocaleDateString('th-TH')} - ${h}:${m}:${s}`;
};

const timeTwoDigit = (num: any) => {
  return (num < 10 ? '0' : '') + num;
};

let isDev = true;

export const API_DOMAIN = isDev
  ? 'http://localhost:3000'
  : 'http://192.168.1.163:3000';

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

export const getStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const setStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getDefaultValue = (value: any) => {
  let val = parseFloat(value).toFixed(2);
  let temp = val.split('.');
  let itg = parseInt(temp[0]).toLocaleString();
  let digit = temp[1];

  return value ? `${itg}.${digit}` : '0.00';
};

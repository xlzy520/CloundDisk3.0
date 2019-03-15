export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
  }
}

export function formatSize(size) {
  if (size.includes('B')) {
    size = size.replace('B', '');
  }
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;
  if (size >= gb) {
    return (size / gb).toFixed(2) + 'GB';
  } else if (size >= mb) {
    return (size / mb).toFixed(2) + 'MB';
  } else if (size >= kb) {
    return (size / kb).toFixed(2) + 'KB';
  } else {
    return size + 'B';
  }
}

export function sizeSort(a, b) {
  if (a.fsize && b.fsize) {
    let number_a = Number(a.fsize.replace('B', ''));
    let number_b = Number(b.fsize.replace('B', ''));
    if (a.ffiletype === 1 && b.ffiletype !== 1) return 1;
    if (a.ffiletype !== 1 && b.ffiletype === 1) return -1;
    if (a.ffiletype !== 1 && b.ffiletype !== 1) return number_a - number_b;
  }
}

export function nameSort(a, b) {
  if (a.fname && b.fname) {
    if (a.ffiletype === 1 && b.ffiletype !== 1) return 1;
    if (a.ffiletype !== 1 && b.ffiletype === 1) return -1;
    let nameCode_a = a.fname.charCodeAt(0);
    let nameCode_b = b.fname.charCodeAt(0);
    if (a.ffiletype !== 1 && b.ffiletype !== 1 || a.ffiletype === 1 && b.ffiletype === 1) return nameCode_a - nameCode_b;
  }
}

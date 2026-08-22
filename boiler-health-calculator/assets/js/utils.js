function increaseByPercentCeil(value, percent) {
  return value + Math.ceil((value * percent) / 100);
}


function getPercentageOf(value, percentage) {
  return (value * percentage) / 100;
}


function ceilDivide(dividend, divisor) {
  return Math.floor((dividend + divisor - 1) / divisor);
}

function getPercentCeil(value, percent) {
  return ceilDivide(value * percent, 100);
}


export { increaseByPercentCeil, getPercentageOf, getPercentCeil };

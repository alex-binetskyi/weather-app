function timeFormat(value) {
  if(value < 10) {
    return `0${value}`
  }
  return value
}
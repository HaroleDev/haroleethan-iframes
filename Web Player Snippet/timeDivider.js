let spinindex = 0

function intervalDivide () {
  const spinners = ['/', '–', '\\', '|']
  let line = spinners[spinindex]
  if (line == undefined) {
    spinindex = 0
    line = spinners[spinindex]
  }
  spinindex = spinindex > spinners.length ? 0 : spinindex + 1
  postMessage(line)
  setTimeout('intervalDivide()', 1000)
}

intervalDivide()

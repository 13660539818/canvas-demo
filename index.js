function Rect(startX, startY, endX, endY, color) {
  this.startX = startX
  this.startY = startY
  this.endX = endX
  this.endY = endY
  this.color = color
  this.isSelected = false
}

let rectList = []

let canvas
let context

window.onload = function () {
  canvas = document.getElementById('canvas')
  context = canvas.getContext('2d')

  canvas.onmousedown = mouseDown
  canvas.onmousemove = mouseMove
  canvas.onmouseup = mouseUp
}

let startX
let startY
let endX
let endY

let width = 0
let height = 0

let isDrawing = false
let isDragging = false

let currentRect

const colors = ['green', 'blue', 'red', 'yellow', 'magenta', 'orange', 'brown', 'purple', 'pink']
let color

function mouseDown(e) {
  isDrawing = false
  isDragging = false
  startX = e.offsetX
  startY = e.offsetY
  rectIndex = rectList.findIndex(item => {
    if (item.startX < item.endX) {
      if (item.startY < item.endY) {
        return startX > item.startX && startX < item.endX && startY > item.startY && startY < item.endY
      } else {
        return startX > item.startX && startX < item.endX && startY > item.endY && startY < item.startY
      }
    } else {
      if (item.startY < item.endY) {
        return startX > item.endY && startX < item.startY && startY > item.startY && startY < item.endY
      } else {
        return startX > item.startX && startX < item.endX && startY > item.endY && startY < item.startY
      }
    }
  })
  console.log(rectIndex)
  if (rectIndex !== -1) {
    currentRect = rectList[rectIndex]
    isDragging = true
    currentRect.isSelected = true
  } else {
    isDrawing = true
  }
  color = colors[randomFromTo(0, 8)]
}

function mouseMove(e) {
  endX = e.offsetX
  endY = e.offsetY
  if (isDrawing) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawRects()
    context.globalAlpha = 0.3
    context.beginPath()
    context.moveTo(startX, startY)
    context.lineTo(endX, startY)
    context.lineTo(endX, endY)
    context.lineTo(startX, endY)
    context.lineTo(startX, startY)
    context.fillStyle = color
    context.strokeStyle = 'black'
    context.fill()
    context.stroke()
  } else if (isDragging) {
    const w = Math.abs(startX - endX)
    const h = Math.abs(startY - endY)
    if (endX < startX) {
      startX -= w
      endX -= w
      currentRect.startX -= w
      currentRect.endX -= w
    }
    if (endX >= startX) {
      startX += w
      endX += w
      currentRect.startX += w
      currentRect.endX += w
    }
    if (endY < startY) {
      startY -= h
      endY -= h
      currentRect.startY -= h
      currentRect.endY -= h
    }
    if (endY >= startY) {
      startY += h
      endY += h
      currentRect.startY += h
      currentRect.endY += h
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawRects()
  }
}

function mouseUp(e) {
  if (isDrawing) {
    rectList.unshift(new Rect(startX, startY, endX, endY, color))
    isDrawing = false
  }
  if (isDragging) {
    rectList.forEach(item => {
      item.isSelected = false
    })
    isDragging = false
  }
}

function drawRects() {
  for (let i = 0; i < rectList.length; i++) {
    let rect = rectList[i]
    context.globalAlpha = 0.3
    context.beginPath()
    context.moveTo(rect.startX, rect.startY)
    context.lineTo(rect.endX, rect.startY)
    context.lineTo(rect.endX, rect.endY)
    context.lineTo(rect.startX, rect.endY)
    context.lineTo(rect.startX, rect.startY)
    context.fillStyle = rect.color
    context.fill()
    if (rect.isSelected) {
      context.strokeStyle = 'black'
      context.stroke()
    }
  }
}

//在某个范围内生成随机数
function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function clearCanvas() {
  // 去除所有圆圈
  rectList = []

  context.clearRect(0, 0, canvas.width, canvas.height)
}

function save () {
  const data = canvas.toDataURL( 'image/png', 1 )
  const chileNode =document.createElement('img')
  chileNode.src = data
  document.getElementById('img-container').appendChild(chileNode)
  clearCanvas()
}
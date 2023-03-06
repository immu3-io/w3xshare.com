import { ethers } from 'ethers'
declare const Waypoint: any

export const truncateAddress = (address: string, size: number = 5): string => (address ? `${address.slice(0, size)}...${address.slice(-size)}` : '')
export const isAddress = (address: string): boolean => (address ? ethers.utils.isAddress(address) : false)
export const getBase64 = (file: File): Promise<string> => {
  const reader = new FileReader()
  reader.readAsDataURL(file as Blob)

  return new Promise<string>(resolve => {
    reader.onload = () => resolve(reader.result as any)
    reader.onerror = () => resolve(null)
  })
}
export const getFileBuffer = (file: string): Promise<any> => {
  const reader = new FileReader()
  const blob = new Blob([file], { type: 'application/octet-stream' })
  // reader.readAsDataURL(file)

  reader.readAsArrayBuffer(blob)
  return new Promise<any>(resolve => {
    reader.onload = () => resolve(reader.result as any)
    reader.onerror = () => resolve(null)
  })
}
export const getBlob = async (file: File): Promise<Blob> => {
  return new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type })
  // file.ar
  // const reader = new FileReader()
  // reader.readAsArrayBuffer(file)
  // return new Promise<Blob>(resolve => {
  //   reader.onload = (event: any) => resolve(new Blob([new Uint8Array(event.target.result)], { type: file.type }))
  //   reader.onerror = () => resolve(null)
  // })
}
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}

export const imgToSVG = (): void => {
  document.querySelectorAll('img.fn__svg').forEach(el => {
    const imgID = el.getAttribute('id')
    const imgClass = el.getAttribute('class')
    const imgURL = el.getAttribute('src')

    fetch(imgURL)
      .then(data => data.text())
      .then(response => {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(response, 'text/html')
        const svg = xmlDoc.querySelector('svg')

        if (typeof imgID !== 'undefined') {
          svg.setAttribute('id', imgID)
        }

        if (typeof imgClass !== 'undefined') {
          svg.setAttribute('class', imgClass + ' replaced-svg')
        }

        svg.removeAttribute('xmlns:a')

        el.parentNode && el.parentNode.replaceChild(svg, el)
      })
  })
}
export const animationText = (): void => {
  const animatedText = document.querySelectorAll('.fn_animated_text')

  animatedText.forEach(text => {
    const letters = text.innerHTML.split('')
    let time = Number(text.getAttribute('wait'))
    let speed = Number(text.getAttribute('speed'))

    time || (time = 0)
    speed || (speed = 4)
    speed = speed / 100

    text.innerHTML = '<em>321...</em>'
    text.classList.add('ready')

    if (typeof window !== 'undefined') {
      require('waypoints/lib/noframework.waypoints.min.js')

      new Waypoint({
        element: text,
        handler: function () {
          if (!text.classList.contains('stop')) {
            text.classList.add('stop')

            setTimeout(() => {
              text.innerHTML = ''
              letters.forEach((i, e) => {
                const span = document.createElement('span')
                span.textContent = i
                span.style.animationDelay = e * speed + 's'
                text.append(span)
              })
            }, time)
          }
        },

        offset: '90%'
      })
    }
  })
}

export const dataBgImg = (): void => {
  const bgImg: any = document.querySelectorAll('[data-bg-img]')

  for (let i = 0; i < bgImg.length; i++) {
    const element = bgImg[i]
    element.style.backgroundImage = `url(${element.getAttribute('data-bg-img')})`
  }
}

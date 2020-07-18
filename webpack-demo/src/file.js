/**
 * file-loader 默认会在内部生成一张图片， 到build目录下
 */
import Img from './1.jpg'
let image = new Image()
image.src = Img

document.body.appendChild(image)
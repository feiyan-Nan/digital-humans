import { useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useSize } from 'ahooks';
import useStore from '@/store';
import './index.css';

let timer = 0;

function Video() {
  const { updateLocations, selected, updateSelected, digitalManImage, align, updateScale, scale, backGroundImage } =
    useStore(
      (state) => ({
        // locations: state.locations,
        updateLocations: state.updateLocations,
        selected: state.selected,
        updateSelected: state.updateSelected,
        digitalManImage: state.digitalManImage,
        align: state.align,
        updateScale: state.updateScale,
        scale: state.scale,
        backGroundImage: state.backGroundImage,
      }),
      shallow,
    );
  const [hasWH, setHasWH] = useState(false);
  const ref = useRef(null);
  const size = useSize(ref);
  console.log(scale, 'scale');
  // 设置背景图
  useEffect(() => {
    const backImgView = document.getElementById('backImgView') as HTMLElement;
    if (backGroundImage) {
      backImgView.style.backgroundImage = `url(${backGroundImage})`;
    } else {
      backImgView.style.backgroundImage = 'none';
    }
  }, [backGroundImage]);

  useEffect(() => {
    if (!size || !size.height || !size.width) {
      return;
    }
    const backImgView = document.getElementById('backImgView') as HTMLElement;
    const canvasctx = document.getElementById('digitalMan') as HTMLCanvasElement;
    console.log('size', size);
    const { width, height } = size ?? {};
    if (align === 'VERTICAL') {
      // 9:16 === 1080 * 1920
      if ((width * 16) / 9 > height) {
        backImgView.style.height = `${height}px`;
        backImgView.style.width = `${(height * 9) / 16}px`;
        canvasctx.width = (height * 9) / 16;
        canvasctx.height = height;
        updateScale(height / 1920);
      } else {
        backImgView.style.width = `${width}px`;
        backImgView.style.height = `${(width * 16) / 9}px`;
        canvasctx.width = width;
        canvasctx.height = (width * 16) / 9;
        updateScale(width / 1080);
      }
    }

    if (align === 'HORIZONTAL') {
      // 16:9 === 1920 * 1080
      if ((width * 9) / 16 > height) {
        backImgView.style.height = `${height}px`;
        backImgView.style.width = `${(height * 16) / 9}px`;
        canvasctx.width = (height * 16) / 9;
        canvasctx.height = height;
        updateScale(height / 1080);
      } else {
        backImgView.style.height = `${(width * 9) / 16}px`;
        backImgView.style.width = `${width}px`;
        canvasctx.width = width;
        canvasctx.height = (width * 9) / 16;
        updateScale(width / 1920);
      }
    }
  }, [size, align]);

  const onClickDigitalMan = (e: any) => {
    e.stopPropagation();
    updateSelected(true);
  };
  useEffect(() => {
    if (scale === 1) {
      return;
    }
    // offsetLeft 距离父级元素左边的距离
    let StartX: number;
    let StartY: number;
    let originImageWidth: number;
    let originImageHeight: number;

    const loginTag = document.getElementById('home_body') as HTMLElement; // 要拖动的元素
    const canvasctx = (document.getElementById('digitalMan') as HTMLCanvasElement).getContext(
      '2d',
    ) as CanvasRenderingContext2D;
    setHasWH(false);
    console.log('执行');
    const image = new Image();
    image.src = digitalManImage;
    image.onload = function () {
      originImageWidth = image.width;
      originImageHeight = image.height;
      canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);
      const { scale, align } = useStore.getState();
      let left;
      let top;
      let width;
      let height;
      if (align === 'VERTICAL') {
        console.log('竖版,竖版竖版竖版竖版');
        top = 192 * scale;
        left = 52 * scale;
        width = 973 * scale;
        height = 1728 * scale;
      } else {
        console.log('横版, 横版横版横版横版横版');
        top = 108 * scale;
        left = 686 * scale;
        width = 548 * scale;
        height = 972 * scale;
      }
      canvasctx.drawImage(image, left, top, width, height);
      // 给数字人一个初始位置
      loginTag.style.top = `${top}px`;
      loginTag.style.left = `${left}px`;
      loginTag.style.width = `${width}px`;
      loginTag.style.height = `${height}px`;
      updateLocations({
        left,
        top,
        width,
        height,
      });
      setHasWH(true);
    };

    const aSpan = loginTag.getElementsByTagName('span');
    for (let i = 0; i < aSpan.length; i++) {
      dragFn(aSpan[i]);
    }

    function dragFn(obj: HTMLSpanElement) {
      obj.onmousedown = function (ev) {
        const oEv = ev || event;
        oEv.stopPropagation();
        const startTime = performance.now(); // 记录初始时间

        const oldWidth = loginTag.offsetWidth;
        const oldHeight = loginTag.offsetHeight;
        const oldX = oEv.clientX;
        const oldY = oEv.clientY;
        const oldLeft = loginTag.offsetLeft;
        const oldTop = loginTag.offsetTop;

        document.onmousemove = function (moveEv: any) {
          const oEv = moveEv || event;
          oEv.stopPropagation();

          if (obj.className === 'tl') {
            loginTag.style.width = `${oldWidth - (oEv.clientX - oldX)}px`;
            loginTag.style.height = `${oldHeight - ((oEv.clientX - oldX) / originImageWidth) * originImageHeight}px`;
            loginTag.style.left = `${oldLeft + (oEv.clientX - oldX)}px`;
            loginTag.style.top = `${oldTop + ((oEv.clientX - oldX) / originImageWidth) * originImageHeight}px`;
          } else if (obj.className === 'bl') {
            loginTag.style.width = `${oldWidth - (oEv.clientX - oldX)}px`;
            loginTag.style.height = `${oldHeight - ((oEv.clientX - oldX) / originImageWidth) * originImageHeight}px`;
            loginTag.style.left = `${oldLeft + (oEv.clientX - oldX)}px`;
          } else if (obj.className === 'tr') {
            loginTag.style.width = `${oldWidth + (oEv.clientX - oldX)}px`;
            loginTag.style.height = `${oldHeight + ((oEv.clientX - oldX) / originImageWidth) * originImageHeight}px`;
            loginTag.style.top = `${oldTop - ((oEv.clientX - oldX) / originImageWidth) * originImageHeight}px`;
          } else if (obj.className === 'br') {
            loginTag.style.width = `${oldWidth + (oEv.clientX - oldX)}px`;
            loginTag.style.height = `${oldHeight + ((oEv.clientX - oldX) / originImageWidth) * originImageHeight}px`;
          } else if (obj.className === 't') {
            loginTag.style.height = `${oldHeight - (oEv.clientY - oldY)}px`;
            loginTag.style.width = `${oldWidth - ((oEv.clientY - oldY) / originImageHeight) * originImageWidth}px`;
            loginTag.style.top = `${oldTop + (oEv.clientY - oldY)}px`;
          } else if (obj.className === 'b') {
            loginTag.style.height = `${oldHeight + (oEv.clientY - oldY)}px`;
            loginTag.style.width = `${oldWidth + ((oEv.clientY - oldY) / originImageHeight) * originImageWidth}px`;
          } else if (obj.className === 'l') {
            loginTag.style.height = `${oldHeight - ((oEv.clientX - oldX) / originImageWidth) * originImageHeight}px`;
            loginTag.style.width = `${oldWidth - (oEv.clientX - oldX)}px`;
            loginTag.style.left = `${oldLeft + (oEv.clientX - oldX)}px`;
          } else if (obj.className === 'r') {
            loginTag.style.height = `${oldHeight + ((oEv.clientX - oldX) / originImageWidth) * originImageHeight}px`;
            loginTag.style.width = `${oldWidth + (oEv.clientX - oldX)}px`;
          }
          const { width, height, top, left } = loginTag.style;
          canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);
          canvasctx.drawImage(image, parseFloat(left), parseFloat(top), parseFloat(width), parseFloat(height));
          updateLocations({
            left: parseFloat(left),
            top: parseFloat(top),
            width: parseFloat(width),
            height: parseFloat(height),
          });
        };

        document.onmouseup = function (e: any) {
          if (!loginTag.contains(e.target)) {
            timer = performance.now() - startTime;
          }
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;
      };
    }

    loginTag.addEventListener('mousedown', (event) => {
      updateSelected(true);
      StartX = event.clientX - loginTag.offsetLeft;
      StartY = event.clientY - loginTag.offsetTop;
      document.addEventListener('mousemove', dropname);
      document.addEventListener('mouseup', stopDraging);
    });

    function dropname(events: any) {
      events.stopPropagation();
      const left = events.clientX - StartX;
      const top = events.clientY - StartY;
      loginTag.style.left = `${left}px`;
      loginTag.style.top = `${top}px`;
      canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);
      if (image.src.includes('undefined')) {
        return;
      }
      canvasctx?.drawImage(
        image,
        left,
        top,
        parseFloat(events.target.style.width),
        parseFloat(events.target.style.height),
      );
      updateLocations({
        left,
        top,
      });
    }

    function stopDraging() {
      document.removeEventListener('mousemove', dropname);
      document.removeEventListener('mouseup', stopDraging);
    }

    function drawCanvas() {
      if (!document.hidden) {
        const { left, top, width, height } = useStore.getState().locations;
        canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);
        canvasctx.drawImage(image, left, top, width, height);
      }
    }

    document.addEventListener('visibilitychange', drawCanvas);
    return () => {
      document.removeEventListener('visibilitychange', drawCanvas);
    };
  }, [digitalManImage, size, scale]);
  return (
    <div
      id="videoWrap"
      ref={ref}
      onClick={() => {
        if (timer && timer > 150) {
          timer = 0;
          return;
        }
        updateSelected(false);
      }}
    >
      <div id="backImgView">
        <div id="home_body" onClick={onClickDigitalMan} style={{ cursor: selected ? 'move' : 'default' }}>
          <span className="r" style={{ display: selected && hasWH ? 'block' : 'none' }} />
          <span className="l" style={{ display: selected && hasWH ? 'block' : 'none' }} />
          <span className="t" style={{ display: selected && hasWH ? 'block' : 'none' }} />
          <span className="b" style={{ display: selected && hasWH ? 'block' : 'none' }} />
          <span className="br" style={{ display: selected && hasWH ? 'block' : 'none' }} />
          <span className="bl" style={{ display: selected && hasWH ? 'block' : 'none' }} />
          <span className="tr" style={{ display: selected && hasWH ? 'block' : 'none' }} />
          <span className="tl" style={{ display: selected && hasWH ? 'block' : 'none' }} />
        </div>
        <div className="videoView">
          <canvas id="digitalMan" width="942" height="530" />
        </div>
      </div>
    </div>
  );
}

export default Video;

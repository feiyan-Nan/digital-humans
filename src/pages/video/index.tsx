import useStore from '@/store';
import { shallow } from 'zustand/shallow';
import './index.css';
import { useEffect } from 'react';

function Video() {
  const { locations, updateLocations, selected, updateSelected } = useStore(
    (state) => ({
      locations: state.locations,
      updateLocations: state.updateLocations,
      selected: state.selected,
      updateSelected: state.updateSelected,
    }),
    shallow,
  );
  console.log(locations, selected, 'locations');
  const onClickDigitalMan = (e: any) => {
    e.stopPropagation();
    updateSelected(true);
  };
  useEffect(() => {
    // offsetLeft 距离父级元素左边的距离
    let StartX;
    let StartY;

    const loginTag = document.getElementById('home_body'); // 要拖动的元素
    const canvasctx = document.getElementById('digitalMan')?.getContext('2d');
    canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);

    const image = new Image();
    image.src =
      'https://digital-person.oss-cn-hangzhou.aliyuncs.com/alpha/51c8b926-62b5-4a2e-944e-ea54499eb5e6_avatar.png';
    image.onload = function () {
      canvasctx.drawImage(image, 0, 0, 180, 320);
    };
    // 给数字人一个初始位置
    loginTag.style.top = `${0}px`;
    loginTag.style.left = `${0}px`;
    loginTag.style.width = `${180}px`;
    loginTag.style.height = `${320}px`;

    console.log(canvasctx, canvasctx.canvas.width, canvasctx.canvas.height);

    const aSpan = loginTag.getElementsByTagName('span');
    for (let i = 0; i < aSpan.length; i++) {
      dragFn(aSpan[i]);
    }

    function dragFn(obj) {
      obj.onmousedown = function (ev) {
        console.log(obj, 'KKKKK');
        const oEv = ev || event;
        oEv.stopPropagation();

        const oldWidth = loginTag.offsetWidth;
        const oldHeight = loginTag.offsetHeight;
        const oldX = oEv.clientX;
        const oldY = oEv.clientY;
        const oldLeft = loginTag.offsetLeft;
        const oldTop = loginTag.offsetTop;
        console.log(oldWidth, oldHeight, oldX, oldY, oldLeft, oldTop);

        document.onmousemove = function (ev) {
          const oEv = ev || event;
          oEv.stopPropagation();

          if (obj.className == 'tl') {
            loginTag.style.width = `${oldWidth - (oEv.clientX - oldX)}px`;
            loginTag.style.height = `${oldHeight - (oEv.clientY - oldY)}px`;
            loginTag.style.left = `${oldLeft + (oEv.clientX - oldX)}px`;
            loginTag.style.top = `${oldTop + (oEv.clientY - oldY)}px`;
          } else if (obj.className == 'bl') {
            loginTag.style.width = `${oldWidth - (oEv.clientX - oldX)}px`;
            loginTag.style.height = `${oldHeight + (oEv.clientY - oldY)}px`;
            loginTag.style.left = `${oldLeft + (oEv.clientX - oldX)}px`;
            // loginTag.style.bottom = oldTop + (oEv.clientY + oldY) + 'px';
          } else if (obj.className == 'tr') {
            loginTag.style.width = `${oldWidth + (oEv.clientX - oldX)}px`;
            loginTag.style.height = `${oldHeight - (oEv.clientY - oldY)}px`;
            // loginTag.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
            loginTag.style.top = `${oldTop + (oEv.clientY - oldY)}px`;
          } else if (obj.className == 'br') {
            loginTag.style.width = `${oldWidth + (oEv.clientX - oldX)}px`;
            loginTag.style.height = `${oldHeight + (oEv.clientY - oldY)}px`;
            // loginTag.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
            // loginTag.style.bottom = oldTop + (oEv.clientY + oldY) + 'px';
          } else if (obj.className == 't') {
            loginTag.style.height = `${oldHeight - (oEv.clientY - oldY)}px`;
            loginTag.style.top = `${oldTop + (oEv.clientY - oldY)}px`;
          } else if (obj.className == 'b') {
            loginTag.style.height = `${oldHeight + (oEv.clientY - oldY)}px`;
            // loginTag.style.bottom = oldTop - (oEv.clientY + oldY) + 'px';
          } else if (obj.className == 'l') {
            loginTag.style.height = `${oldHeight}px`;
            loginTag.style.width = `${oldWidth - (oEv.clientX - oldX)}px`;
            loginTag.style.left = `${oldLeft + (oEv.clientX - oldX)}px`;
          } else if (obj.className == 'r') {
            loginTag.style.height = `${oldHeight + ((oEv.clientX - oldX) / 9) * 16}px`;
            loginTag.style.width = `${oldWidth + (oEv.clientX - oldX)}px`;
            // loginTag.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
          }
          const { width, height, top, left } = loginTag.style;
          console.log('result', '宽:', width, '高:', height, '顶部:', top, '左侧:', left);
          canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);
          canvasctx.drawImage(image, parseFloat(left), parseFloat(top), parseFloat(width), parseFloat(height));
          updateLocations({
            left: parseFloat(left),
            top: parseFloat(top),
            width: parseFloat(width),
            height: parseFloat(height),
          });
        };

        document.onmouseup = function () {
          document.onmousemove = null;
        };
        return false;
      };
    }

    loginTag.addEventListener('mousedown', (event) => {
      console.log('移动1');
      StartX = event.clientX - loginTag.offsetLeft;
      StartY = event.clientY - loginTag.offsetTop;
      console.log(StartX, StartY, loginTag.offsetLeft);
      document.addEventListener('mousemove', dropname);
      document.addEventListener('mouseup', stopDraging);
    });

    function dropname(events) {
      events.stopPropagation();
      // console.log('移动2', events.target.style.width, events.target.style.height);
      const left = events.clientX - StartX;
      const top = events.clientY - StartY;
      loginTag.style.left = `${left}px`;
      loginTag.style.top = `${top}px`;
      canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);
      canvasctx.drawImage(
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
  }, []);
  return (
    <div id="long_home" onClick={() => updateSelected(false)}>
      <div id="home_body" onClick={onClickDigitalMan} style={{ cursor: selected ? 'move' : 'default' }}>
        <span className="r" hidden={!selected} />
        <span className="l" hidden={!selected} />
        <span className="t" hidden={!selected} />
        <span className="b" hidden={!selected} />
        <span className="br" hidden={!selected} />
        <span className="bl" hidden={!selected} />
        <span className="tr" hidden={!selected} />
        <span className="tl" hidden={!selected} />
        {/* <img draggable="false" */}
        {/*     src="https://digital-person.oss-cn-hangzhou.aliyuncs.com/alpha/51c8b926-62b5-4a2e-944e-ea54499eb5e6_avatar.png" */}
        {/*     alt=""/> */}
      </div>
      <div className="videoView">
        <canvas id="digitalMan" width="942" height="530" />
      </div>
    </div>
  );
}

export default Video;

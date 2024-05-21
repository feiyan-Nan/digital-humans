import useStore from '@/store';
import './index.css';
import {useEffect} from "react";


function Home() {
  const count = useStore((state) => state.count);

  useEffect(() => {
    // offsetLeft 距离父级元素左边的距离
    var StartX
    var StartY

    var loginTag = document.getElementById('home_body') //要拖动的元素
    const canvasctx = document.getElementById('digitalMan')?.getContext('2d');
    canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);

    const image = new Image();
    image.src = 'https://digital-person.oss-cn-hangzhou.aliyuncs.com/alpha/51c8b926-62b5-4a2e-944e-ea54499eb5e6_avatar.png'
    image.onload = function () {
      canvasctx.drawImage(image, 0, 0, 180, 320);
    }
    // 给数字人一个初始位置
    loginTag.style.top = 0 + 'px';
    loginTag.style.left = 0 + 'px';
    loginTag.style.width = 180 + 'px';
    loginTag.style.height = 320 + 'px';

    console.log(canvasctx, canvasctx.canvas.width, canvasctx.canvas.height);

    var aSpan = loginTag.getElementsByTagName('span');
    for (var i = 0; i < aSpan.length; i++) {
      dragFn(aSpan[i]);
    }

    function dragFn(obj) {
      obj.onmousedown = function (ev) {
        console.log(obj, 'KKKKK')
        var oEv = ev || event;
        oEv.stopPropagation()

        var oldWidth = loginTag.offsetWidth;
        var oldHeight = loginTag.offsetHeight;
        var oldX = oEv.clientX;
        var oldY = oEv.clientY;
        var oldLeft = loginTag.offsetLeft;
        var oldTop = loginTag.offsetTop;
        console.log(oldWidth, oldHeight, oldX, oldY, oldLeft, oldTop)

        document.onmousemove = function (ev) {
          var oEv = ev || event;
          oEv.stopPropagation()

          if (obj.className == 'tl') {
            loginTag.style.width = oldWidth - (oEv.clientX - oldX) + 'px';
            loginTag.style.height = oldHeight - (oEv.clientY - oldY) + 'px';
            loginTag.style.left = oldLeft + (oEv.clientX - oldX) + 'px';
            loginTag.style.top = oldTop + (oEv.clientY - oldY) + 'px';
          } else if (obj.className == 'bl') {
            loginTag.style.width = oldWidth - (oEv.clientX - oldX) + 'px';
            loginTag.style.height = oldHeight + (oEv.clientY - oldY) + 'px';
            loginTag.style.left = oldLeft + (oEv.clientX - oldX) + 'px';
            // loginTag.style.bottom = oldTop + (oEv.clientY + oldY) + 'px';
          } else if (obj.className == 'tr') {
            loginTag.style.width = oldWidth + (oEv.clientX - oldX) + 'px';
            loginTag.style.height = oldHeight - (oEv.clientY - oldY) + 'px';
            // loginTag.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
            loginTag.style.top = oldTop + (oEv.clientY - oldY) + 'px';
          } else if (obj.className == 'br') {
            loginTag.style.width = oldWidth + (oEv.clientX - oldX) + 'px';
            loginTag.style.height = oldHeight + (oEv.clientY - oldY) + 'px';
            // loginTag.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
            // loginTag.style.bottom = oldTop + (oEv.clientY + oldY) + 'px';
          } else if (obj.className == 't') {
            loginTag.style.height = oldHeight - (oEv.clientY - oldY) + 'px';
            loginTag.style.top = oldTop + (oEv.clientY - oldY) + 'px';
          } else if (obj.className == 'b') {
            loginTag.style.height = oldHeight + (oEv.clientY - oldY) + 'px';
            // loginTag.style.bottom = oldTop - (oEv.clientY + oldY) + 'px';
          } else if (obj.className == 'l') {
            loginTag.style.height = oldHeight + 'px';
            loginTag.style.width = oldWidth - (oEv.clientX - oldX) + 'px';
            loginTag.style.left = oldLeft + (oEv.clientX - oldX) + 'px';
          } else if (obj.className == 'r') {
            loginTag.style.height = oldHeight + (oEv.clientX - oldX) / 9 * 16 + 'px';
            loginTag.style.width = oldWidth + (oEv.clientX - oldX) + 'px';
            // loginTag.style.right = oldLeft - (oEv.clientX - oldX) + 'px';
          }
          const width = loginTag.style.width;
          const heiht = loginTag.style.height;
          const top = loginTag.style.top;
          const left = loginTag.style.left;
          console.log('result', '宽:', width, "高:", heiht, '顶部:', top, "左侧:", left);
          canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);
          canvasctx.drawImage(image, parseFloat(left), parseFloat(top), parseFloat(width), parseFloat(heiht));
        };

        document.onmouseup = function () {
          document.onmousemove = null;
        };
        return false;
      };
    }


    loginTag.addEventListener('mousedown', (event) => {
      console.log('移动1')
      StartX = event.clientX - loginTag.offsetLeft
      StartY = event.clientY - loginTag.offsetTop
      console.log(StartX, StartY, loginTag.offsetLeft)
      document.addEventListener('mousemove', dropname)
      document.addEventListener('mouseup', stopDraging)
    })

    function dropname(events) {
      events.stopPropagation()
      // console.log('移动2', events.target.style.width, events.target.style.height);
      let left = events.clientX - StartX
      let top = events.clientY - StartY
      loginTag.style.left = left + 'px'
      loginTag.style.top = top + 'px'
      console.log(left, top);
      canvasctx.clearRect(0, 0, canvasctx.canvas.width, canvasctx.canvas.height);
      canvasctx.drawImage(image, left, top, parseFloat(events.target.style.width), parseFloat(events.target.style.height));
    }

    function stopDraging() {
      document.removeEventListener('mousemove', dropname)
      document.removeEventListener('mouseup', stopDraging)
    }

  }, []);
  return (
    <div id="long_home">
      <div id="home_body">
        <span className="r"></span>
        <span className="l"></span>
        <span className="t"></span>
        <span className="b"></span>
        <span className="br"></span>
        <span className="bl"></span>
        <span className="tr"></span>
        <span className="tl"></span>
        {/*<img draggable="false"*/}
        {/*     src="https://digital-person.oss-cn-hangzhou.aliyuncs.com/alpha/51c8b926-62b5-4a2e-944e-ea54499eb5e6_avatar.png"*/}
        {/*     alt=""/>*/}
      </div>
      <div className="videoView">
        <canvas id="digitalMan" width="942" height="530"></canvas>
      </div>
    </div>
  );
}

export default Home;

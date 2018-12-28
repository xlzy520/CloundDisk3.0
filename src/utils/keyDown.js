//    var cvsWidth=1000,cvsHigh=600;
var cvsWidth, cvsHigh;
var ctx, cvs;

export function autoRun() {
  var clientWidth = document.body.clientWidth;
  var clientHeight = document.documentElement.clientHeight || window.screen.height || document.body.clientHeight;
  cvs = document.getElementById('cvs_key');
  cvsWidth = clientWidth;
  cvsHigh = clientHeight;
  cvs.setAttribute('width', cvsWidth + '');
  cvs.setAttribute('height', cvsHigh + '');
  ctx = cvs.getContext('2d');
  run();
}

class Word {
  constructor(word, size, color) {
    // 基本属性
    this.word = word;
    this.size = size;
    this.color = color;

    // 运动速度变量
    this.x = 0;// 位置x
    this.y = 0;// 位置Y
    this.bound = 0;
    this.speed = 0;// 运动速度
    this.forward = 0;// 运动方向
    this.speedx = 0;// X方向上的速度
    this.speedy = 0;// Y方向上的速度
    this.YA = 0;// Y方向上的加速度
    this.XA = 0;// X方向上的加速度

    // 旋转角变量
    this.deg = 0;// 初始角度
    this.rotatedeg = 0; // 角速度
    this.rotatedegA = 0; // 角加速度

    // 倾斜角变量
    this.declinedeg = 0;// 初始倾斜角
    this.declinePoint = [];// 倾角支撑点 x,y
    this.declinedegV = 0;// 倾角变化角速度
    this.declinedegVA = 0;// 倾角变换角加速度
  }

  init(x, y, speed, forward, deg, rotatedeg) {
    this.x = x;// 位置x
    this.y = y;// 位置Y
    this.bound = y + 20;// 边界
    this.speed = speed;// 运动速度
    this.forward = forward;// 运动方向
    this.speedx = Math.floor((speed * Math.cos(Math.PI * forward / 180)));// X方向上的速度
    this.speedy = Math.floor((speed * Math.sin(Math.PI * forward / 180)));// Y方向上的速度
    this.YA = 2;// Y方向上的加速度
    this.XA = 0;// X方向上的加速度
    // 旋转角变量
    this.deg = deg;// 初始角度
    this.rotatedeg = rotatedeg; // 角速度

    return this;
  }

  draw(baseLine) {
    // 旋转
    if (baseLine === 'bottom') { this.rotate(this.declinedeg, this.declinePoint[0], this.declinePoint[1]); } else { this.rotate(this.deg, this.x, this.y); }

    ctx.font = this.size + 'px Verdana';
    ctx.textBaseline = baseLine || 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = this.color;
    ctx.fillText(this.word, this.x, this.y);

    // 旋转复原
    if (baseLine === 'bottom') { this.rotate(-this.declinedeg, this.declinePoint[0], this.declinePoint[1]); } else { this.rotate(-this.deg, this.x, this.y); }
  }

  rotate(deg, x, y) {
    ctx.translate(x, y);
    ctx.rotate(deg * (Math.PI / 180));
    ctx.translate(-x, -y);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  fade() {
    var reg = /[0-9]\.[0-9]+/;
    var a = this.color.match(reg);
    a = parseFloat(a[0]);
    a -= 0.02;
    if (a <= 0) return true;
    this.color = this.color.replace(reg, a + '');
  }

  move() {
    var stop;
    this.x += this.speedx;
    this.y += this.speedy;
    this.hit();// 碰撞墙壁检测
    this.speedy += this.YA;// y方向添加重力加速度

    this.rotateText();
    //            console.log(this.x,this.y,this.speedy)

    stop = this.fade();

    this.draw('middle');

    return stop;
  }

  hit() {
    if (this.x >= cvsWidth - this.size / 2) {
      this.speedx = -(this.speedx / 2);// x方向速度损失一半
      this.x = cvsWidth - this.size / 2;
      this.forwardx = -this.forwardx;
    }
    if (this.y >= this.bound - this.size / 2) {
      this.speedy = -(this.speedy / 4);// y方向速度损失四分之三
      this.y = this.bound - this.size / 2;
      if (Math.abs(this.speedy + this.YA) < 5) {
        return true;
      }
    }
    if (this.x <= this.size / 2) {
      this.speedx = -this.speedx;
      this.x = this.size / 2;
      this.forwardx = -this.forwardx;
    }
    if (this.y <= this.size / 2) {
      this.speedy = -this.speedy;
      this.y = this.size / 2;
    }
  }

  rotateText() {
    //            this.draw('middle');
    this.deg += this.rotatedeg;
  }

  shakeText() {
    if (Math.abs(this.declinedeg) > 45) {
      // 翻转
      if (this.declinedeg > 45) {
        // 改变支撑点
      }
      if (this.declinedeg < -45) {
        // 改变支撑点
      }
    }

    if (this.declinedeg === 0 || (this.declinedeg + this.declinedegV) * this.declinedeg < 0) {
      this.declinedegVA = -this.declinedegVA * 2;
      // 改变支撑点

      if (Math.abs(this.declinedegV) < 3) {
        this.declinedeg = 0;
        this.declinedegV = 0;
        this.declinedegVA = 0;
        return false;
      }
    }

    this.declinedeg += this.declinedegV;
    this.declinedegV += this.declinedegVA;
  }
}

class Controller {
  constructor() {
    this.words = [];
    this.circles = [];
  }

  addWord(word, size, color, x, y, bound) {
    var c_color = 'rgba(' + Math.floor(this.random(0, 225)) + ',' + Math.floor(this.random(0, 225)) + ',' + Math.floor(this.random(0, 225)) + ',1.00)';

    var w = new Word(word, size, color);

    var forward = this.random(-80, -100);
    var deg;
    var degA;
    if (forward < -90) {
      deg = this.random(0, -10);
      degA = this.random(0, -5);
    } else {
      deg = this.random(0, 10);
      degA = this.random(0, 5);
    }

    this.words.push(w.init(x, bound, this.random(30, 50), forward, deg, degA));

    this.circles.push(new Circle(x, y, 1, c_color));
  }

  animateWord() {
    this.words.forEach((word, i) => {
      if (word.move()) { this.delWord(i); }
    });
  }

  animateCircle() {
    this.circles.forEach((circle, i) => {
      if (circle.animate()) { this.delCircle(i); }
    });
  }

  delWord(i) {
    this.words.splice(i, 1);
  }

  delCircle(i) {
    this.circles.splice(i, 1);
  }

  random(a, b) {
    return Math.random() * (b - a) + a;
  }
}

class KeyBoard {
  constructor(x, y, keySize) {
    this.x = x;
    this.y = y;
    this.size = keySize;
    this.fontSize = keySize / 2;

    this.keyWords = [];
    this.keyWords[0] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.keys = [];
    this.keysInfo = {};
  }

  init() {
    var nx = this.x;
    var ny = this.y;

    this.keyWords.forEach((row, i) => {
      nx = this.x + 2 * i * this.size / 3;
      row.forEach((key) => {
        this.keys.push(new Keyword(key, this.fontSize, 'white', '#444444', '#999999', this.size, this.size, nx, ny));
        this.keysInfo[key] = {
          x: nx + this.size / 2,
          y: ny + this.size / 2
        };
        nx = nx + 10 + this.size;
      });
      ny = ny + 10 + this.size;
    });

    return this.keysInfo;
  }

  press(kw) {
    this.keys.forEach((key) => {
      if (kw === key.word) { key.press(); } else { key.unPress(); }
    });
    this.draw();
  }

  draw() {
    this.keys.forEach((key) => {
      key.draw();
    });
  }
}

class Keyword {
  constructor(word, size, wordColor, color, pressColor, width, height, x, y) {
    this.word = word;
    this.size = size;
    this.wordColor = wordColor;
    this.color = color;
    this.pressColor = pressColor || 'gray';
    this.isPress = false;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.r = 5;
  }

  press() {
    this.isPress = true;
  }

  unPress() {
    this.isPress = false;
  }

  draw() {
    ctx.beginPath();
    //            ctx.fillStyle=this.isPress?this.pressColor:this.color;
    ctx.strokeStyle = 'white';
    ctx.moveTo(this.x + this.r, this.y);
    ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, this.r);
    ctx.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, this.r);
    ctx.arcTo(this.x, this.y + this.height, this.x, this.y, this.r);
    ctx.arcTo(this.x, this.y, this.x + this.width, this.y, this.r);
    //            ctx.fill();
    ctx.stroke();

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = this.wordColor;
    ctx.font = this.size + 'px Verdana';
    ctx.fillText(this.word, this.x + this.width / 2, this.y + this.height / 2);
    ctx.closePath();
  }
}

class Circle {
  constructor(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  animate() {
    this.r += 20;
    this.draw();
    return this.fade();
  }

  fade() {
    var reg = /[0-9]\.[0-9]+/;
    var a = this.color.match(reg);
    a = parseFloat(a[0]);
    a -= 0.05;
    if (a <= 0) return true;
    this.color = this.color.replace(reg, a + '');
  }
}

function clearReact() {
  ctx.clearRect(0, 0, cvsWidth, cvsHigh);
}

var run = (function() {
  var keysInfo = {};

  return function() {
    var divY = cvsHigh / 3 * 2;
    var c = new Controller();
    var kb = new KeyBoard((cvsWidth - ((cvsHigh - divY) / 4 + 10) * 10) / 2, divY + 80, (cvsHigh - divY) / 4);
    var key;
    keysInfo = kb.init();
    window.onkeydown = function(e) {
      if ((e.keyCode >= 49 && e.keyCode <= 59) || (e.keyCode >= 96 && e.keyCode <= 105)) {
        if (e.target.type !== 'password') {
          key = e.key;
          kb.press(key);
          c.addWord(key, 100, 'rgba(225,225,225,1.0)', keysInfo[key].x, keysInfo[key].y, divY - 20);
        }
      }
    };
    window.onkeyup = function() {
      kb.press();
    };
    function animate() {
      clearReact();
      c.animateCircle();
      staticImg();
      kb.draw();
      c.animateWord();

      requestAnimationFrame(animate);
    }
    function staticImg() {
      // 画上半部分背景色
      ctx.beginPath();
      ctx.fillStyle = '#2d3a4b';
      ctx.moveTo(0, 0);
      ctx.lineTo(0, divY + 40);
      ctx.lineTo(cvsWidth, divY + 40);
      ctx.lineTo(cvsWidth, 0);
      ctx.fill();
      ctx.closePath();

      // 画分界线
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'white';
      ctx.moveTo(0, divY + 40);
      ctx.lineTo(cvsWidth, divY + 40);
      ctx.stroke();
      ctx.closePath();
    }
    animate();
  };
})();

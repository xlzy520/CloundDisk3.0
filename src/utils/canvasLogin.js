export class CanvasAnimate {
  constructor(Dom, options) {
    options = options || {};
    this.Element = Dom;
    this.cvs = Dom.getContext('2d');
    this.off_cvs = document.createElement('canvas');
    this.off_cvs.width = Dom.width;
    this.off_cvs.height = Dom.height;
    this.Dom = this.off_cvs.getContext('2d');
    this.width = Dom.width;
    this.height = Dom.height;
    this.length = options.length || 100;
    this.RoundColor = options.RoundColor || '#1296db';
    this.RoundDiameter = options.RoundDiameter || 20;
    this.LineColor = options.LineColor || 'rgba(248,204,220,.1)';
    this.LineWeight = options.LineWeight || 1;
    this.clicked = options.clicked || false;
    this.moveon = options.moveon || false;
    this.list = [];
    this.paused = true;
  }

  Run() {
    if (this.clicked) {
      this.Element.addEventListener('click', this.Clicked.bind(this));
    }
    if (this.moveon) {
      this.Element.addEventListener('mousemove', this.moveXY.bind(this));
      this.Element.addEventListener('mouseout', this.moveoutXY.bind(this));
    }
    this.Draw(this.getLength());
  }

  getLength() {
    const arr = [];
    for (let i = 0; i < this.length; i++) {
      const obj = {};
      obj.x = parseInt(Math.random() * this.width);
      obj.y = parseInt(Math.random() * this.height);
      obj.r = parseInt(Math.random() * 10) || 1;
      obj.controlX = parseInt(Math.random() * 10) > 5 ? 'left' : 'right';
      obj.controlY = parseInt(Math.random() * 10) > 5 ? 'bottom' : 'top';
      arr.push(obj);
    }
    return arr;
  };

  Draw(list) {
    const new_arr = [];
    const line_arr = [];

    list.map((item) => {
      const xy = this.ControlXY(item);
      const obj = this.ControlRound(xy);
      new_arr.push(obj);
    });

    new_arr.map((item1) => {
      new_arr.map((item2) => {
        if (item1 !== item2) {
          const x = item1.x - item2.x;
          const y = item1.y - item2.y;
          if (Math.abs(x) < 100 && Math.abs(y) < 100) {
            const obj = {
              x1: item1.x,
              y1: item1.y,
              x2: item2.x,
              y2: item2.y
            };
            line_arr.push(obj);
          }
        }
      });
    });

    this.drawLine(line_arr);

    new_arr.map((item) => {
      this.drawRound(item);
    });

    this.list = new_arr;

    this.cvs.drawImage(this.off_cvs, 0, 0, this.width, this.height);

    setTimeout(() => {
      if (this.paused) {
        this.next();
      }
    }, 50);
  };

  next() {
    this.cvs.clearRect(0, 0, this.width, this.height);
    this.Dom.clearRect(0, 0, this.width, this.height);
    this.Draw(this.list);
  };

  drawRound(obj) {
    const {x, y} = obj;
    this.Dom.beginPath();
    this.Dom.arc(x, y, 1.5, 0, 2 * Math.PI);
    this.Dom.fillStyle = this.RoundColor;
    this.Dom.fill();
    this.Dom.closePath();
  };

  drawLine(list) {
    list.map((item) => {
      this.Dom.beginPath();
      this.Dom.moveTo(item.x1, item.y1);
      this.Dom.lineTo(item.x2, item.y2);
      this.Dom.lineWidth = this.LineWeight;
      this.Dom.strokeStyle = this.LineColor;
      this.Dom.stroke();
      this.Dom.closePath();
    });
  };

  ControlXY(obj) {
    if (obj.x >= (this.width - obj.r)) {
      obj.controlX = 'left';
    } else if (obj.x <= parseInt(obj.r / 2)) {
      obj.controlX = 'right';
    }

    if (obj.y >= (this.height - obj.r)) {
      obj.controlY = 'bottom';
    } else if (obj.y <= parseInt(obj.r / 2)) {
      obj.controlY = 'top';
    }
    return obj;
  };

  ControlRound(obj) {
    switch (obj.controlX) {
      case 'right':
        obj.x++;
        break;
      case 'left':
        obj.x--;
        break;
    }
    switch (obj.controlY) {
      case 'top':
        obj.y++;
        break;
      case 'bottom':
        obj.y--;
        break;
    }
    return obj;
  };

  Clicked(event) {
    const obj = {};
    obj.x = event.clientX;
    obj.y = event.clientY;
    obj.r = parseInt(Math.random() * 10);
    obj.controlX = parseInt(Math.random() * 10) > 5 ? 'left' : 'right';
    obj.controlY = parseInt(Math.random() * 10) > 5 ? 'bottom' : 'top';
    this.list.push(obj);
  };

  moveXY(event) {
    const obj = {};
    obj.x = event.clientX;
    obj.y = event.clientY;
    obj.r = 0;
    obj.move = true;
    if (this.list[0]['move']) {
      this.list[0]['x'] = obj.x;
      this.list[0]['y'] = obj.y;
      this.list[0]['r'] = 1;
    } else {
      this.list.unshift(obj);
    }
  };

  moveoutXY() {
    this.list.shift();
  };

  pause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.Draw(this.list);
    }
  };
}

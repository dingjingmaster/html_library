var options = {
    resolution: 1,      // 泡泡外框分辨率
    gradient: {
        resolution: 1,
        smallRadius: 0,
        /* 颜色 hsl 表示 */
        hue: {          // 色调：0红色，120绿色，240蓝色
            min: 0,
            max: 240
        },
        saturation: {   // 饱和度 0.0% - 100%
            min: 40,
            max: 80
        },
        lightness: {    // 亮度 0.0% - 100%
            min: 80,
            max: 90
        }
    },
    bokeh: {
        count: 20,      // 泡泡数量
        size: {         // 泡泡直径与屏幕占比最大和最小
            min: 0.1,
            max: 0.2
        },
        alpha: {        // 泡泡透明度
            min: 0.1,
            max: 0.8
        },
        jitter: {       // 泡泡出现的位置
            x: 0.3,
            y: 0.3
        }
    },
    speed: {            // 泡泡速度
        min: 0.006,
        max: 0.01
    },
    debug: {
        strokeBokeh: false,
        showFps: false
    }
};
var mobile = {
        force: false,
        resolution: 0.5,
        bokeh:{
            count: 6
        }
    };

function paopao (id, options, mobile) {
    var circles = [];
    var time;var targetFps = 60;var curFps = 0;var cntFps = 0;var fps = 0;var w = 0;var h = 0;var scale = 0;var pi2 = Math.PI * 2;
    var colorPoints = [new ColorPoint(0, 0, new Color(196, 59, 34)),new ColorPoint(0, 1, new Color(269, 79, 32)), new ColorPoint(1, 0, new Color(30, 42, 33)), new ColorPoint(1, 1, new Color(304, 47, 27))];
    var ctx = document.getElementById('paopao').getContext('2d');
    var gradientBuffer = document.createElement('canvas').getContext('2d');
    var circleBuffer = document.createElement('canvas').getContext('2d');

    gradientBuffer.canvas.height = options.gradient.resolution;
    gradientBuffer.canvas.width = options.gradient.resolution;
    if (isMobile()){
        softCopy(mobile, options);
    }
    resize();
    colorPoints.forEach(function(point) {
        point.oldColor = newColor();
        point.newColor = newColor();
        point.speed = rand(options.speed);
    });
    for(i = 0; i < options.bokeh.count; i++) {
        circles.push(new BokehCircle(Math.random(), Math.random(),rand(options.bokeh.size), rand(options.bokeh.alpha)));
        circles[i].newAlpha = rand(options.bokeh.alpha);
        circles[i].newSize = rand(options.bokeh.size);
        circles[i].speed = rand(options.speed);
        setJitter(circles[i]);
    }
    window.addEventListener("resize", resize);
    render();

    function resize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        w = width * options.resolution;
        h = height * options.resolution;
        scale = Math.sqrt(w * h);

        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.scale(1 / options.resolution, 1 / options.resolution);

        var circleSize = options.bokeh.size.max * scale;
        circleBuffer.canvas.width = circleSize * 2 + 1;
        circleBuffer.canvas.height = circleSize * 2 + 1;
        circleBuffer.fillStyle = "rgb(255, 255, 255)";
        circleBuffer.beginPath();
        circleBuffer.arc(circleSize, circleSize, circleSize, 0, pi2);
        circleBuffer.closePath();
        circleBuffer.fill();
        if (isMobile()){
            render();
        }
    }
    function lerp(a, b, step) {
        return step * (b - a) + a;
    }
    function clamp(a) {
        if (a < 0) return 0;
        if (a > 1) return 1;
        return a;
    }
    function rand(obj) {
        return Math.random() * (obj.max - obj.min) + obj.min;
    }
    function newColor() {
        return new Color(
            rand(options.gradient.hue),
            rand(options.gradient.saturation),
            rand(options.gradient.lightness)
        );
    }
    function isMobile() {
        return (
            mobile.force
            || navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        );
    }
    function BokehCircle(x, y, size, alpha) {
        this.oldX = x;
        this.oldY = y;
        this.oldSize = size;
        this.oldAlpha = alpha;
        this.newX = 0;
        this.newY = 0;
        this.newAlpha = 0;
        this.newSize = 0;
        this.step = 0;
        this.speed = 0;
        this.x = function() {
            return lerp(this.oldX, this.newX, this.step);
        };

        this.y = function() {
            return lerp(this.oldY, this.newY, this.step);
        };

        this.alpha = function() {
            return lerp(this.oldAlpha, this.newAlpha, this.step);
        };

        this.size = function() {
            return lerp(this.oldSize, this.newSize, this.step);
        }
    }
    function render() {
        iterate();
        colorPoints.forEach(function(point) {
            var x = point.x * options.gradient.resolution;
            var y = point.y * options.gradient.resolution;
            var grad = gradientBuffer.createRadialGradient(x, y,
                options.gradient.smallRadius, x, y,
                options.gradient.resolution);
            grad.addColorStop(0, 'hsla(' + point.color().str() + ', 255)');
            grad.addColorStop(1, 'hsla(' + point.color().str() + ', 0)');
            gradientBuffer.fillStyle = grad;
            gradientBuffer.fillRect(0, 0,
                options.gradient.resolution, options.gradient.resolution);
        });

        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(gradientBuffer.canvas, 0, 0, w, h);
        ctx.globalCompositeOperation = "overlay";
        if (options.debug.strokeBokeh){
            ctx.strokeStyle = "yellow";
        }
        circles.forEach(function(circle) {
            var size = circle.size() * scale;
            ctx.globalAlpha = circle.alpha();
            ctx.drawImage(circleBuffer.canvas,
                circle.x() * w - size / 2, circle.y() * h - size / 2,
                size, size);
            if(options.debug.strokeBokeh) {
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeRect(circle.x() * w - size / 2, circle.y() * h - size / 2, size, size);
                ctx.globalCompositeOperation = "overlay";
            }
        });
        ctx.globalAlpha = 1;
        if (options.debug.showFps) {
            if(fps <= 10) ctx.fillStyle = 'red';
            else ctx.fillStyle = 'yellow';
            ctx.font = "20px sans-serif";
            ctx.fillText(Math.round(fps) + " fps", 10, 20);
        }
        window.requestAnimFrame = (function(callback) {
        if (isMobile()){
            return function(callback){window.setTimeout(callback, 1000 / 10);};
        }
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
        window.requestAnimFrame(render);
    }
    function ColorPoint(x, y, color) {
        this.x = x;
        this.y = y;
        this.oldColor = color;
        this.newColor = color;
        this.step = 0;
        this.speed = 0;
        this.color = function() {
            return new Color(lerp(this.oldColor.h, this.newColor.h, this.step),
                lerp(this.oldColor.s, this.newColor.s, this.step),
                lerp(this.oldColor.l, this.newColor.l, this.step));
        }
    }
    function Color(h, s, l) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.str = function() {
            return this.h + ", " + this.s + "%, " + this.l +"%";
        }
    }
    function setJitter(circle) {
        circle.newX = clamp(circle.oldX + rand({
            min: - options.bokeh.jitter.x,
            max: options.bokeh.jitter.x
        }));
        circle.newY = clamp(circle.oldY + rand({
            min: - options.bokeh.jitter.y,
            max: options.bokeh.jitter.y
        }));
    }
    function iterate() {
        var now = Date.now();
        curFps += (now - (time || now));
        cntFps++;
        var delta = (now - (time || now)) / (1000 / targetFps);
        time = now;
        if(curFps > 1000) {
            fps = 1000 / (curFps / cntFps);
            curFps -= 1000;
            cntFps = 0;
        }
        colorPoints.forEach(function(point) {
            point.step += point.speed * delta;
            if (point.step >= 1) {
                point.step = 0;
                point.oldColor = point.newColor;
                point.newColor = newColor();
                point.speed = rand(options.speed);
            }
        });

        circles.forEach(function(circle) {
            circle.step += circle.speed * delta;
            if(circle.step >= 1) {
                circle.step = 0;
                circle.oldX = circle.newX;
                circle.oldY = circle.newY;
                circle.oldAlpha = circle.newAlpha;
                circle.oldSize = circle.newSize;
                setJitter(circle);
                circle.newAlpha = rand(options.bokeh.alpha);
                circle.newSize = rand(options.bokeh.size);
                circle.speed = rand(options.speed);
            }
        });
    }
}

window.addEventListener("load",paopao('paopao', options, mobile));

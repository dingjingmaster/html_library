/* 返回顶部 */
function backTop(btnId) {
  var btn = document.getElementById(btnId);
  var d = document.documentElement;
	var b = document.body;
	window.onscroll = set;
	btn.style.display = "none";
	btn.onclick = function() {
		btn.style.display = "none";
		window.onscroll = null;
		this.timer = setInterval(function() {
			d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
			b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
			if ((d.scrollTop + b.scrollTop) == 0) clearInterval(btn.timer, window.onscroll = set);
		},
		10);
	};
	function set() {
		btn.style.display = (d.scrollTop + b.scrollTop > 100) ? 'block': "none"
	}
};

/* 打开一个窗体 */
function openWindow(url,windowName,width,height){
    var x = parseInt(screen.width / 2.0) - (width / 2.0);
    var y = parseInt(screen.height / 2.0) - (height / 2.0);
    var isMSIE= (navigator.appName == "Microsoft Internet Explorer");
    if (isMSIE) {
    	var p = "resizable=1,location=no,scrollbars=no,width=";
    	p = p+width;
    	p = p+",height=";
    	p = p+height;
    	p = p+",left=";
    	p = p+x;
    	p = p+",top=";
    	p = p+y;
        retval = window.open(url, windowName, p);
    } else {
        var win = window.open(url, "ZyiisPopup", "top=" + y + ",left=" + x + ",scrollbars=" + scrollbars + ",dialog=yes,modal=yes,width=" + width + ",height=" + height + ",resizable=no" );
        eval("try { win.resizeTo(width, height); } catch(e) { }");
        win.focus();
    }
}

/* 加载样式文件 */
function loadStyle(url) {
    try {
        document.createStyleSheet(url)
    } catch(e) {
        var cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.type = 'text/css';
        cssLink.href = url;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(cssLink)
    }
}

/* 获取窗体可见范围的宽和高 */
function getViewSize(){
	var de=document.documentElement;
	var db=document.body;
	var viewW=de.clientWidth==0 ?  db.clientWidth : de.clientWidth;
	var viewH=de.clientHeight==0 ?  db.clientHeight : de.clientHeight;
	return Array(viewW ,viewH);
}

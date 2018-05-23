
/* 去除左边空格 */
function ltrim(s) {
  return s.replace( /^(\s*|  *)/, "");
}

/* 去除右边空格 */
function rtrim(s) {
  return s.replace( /(\s*|　*)$/, "");
}

/* 去除两边空格 */
function trim(s) {
  return ltrim(rtrim(s));
}

/* 字符串是否大于规定长度 */
function isValidLength(chars, len) {
	if (chars.length < len) {
		return false;
	}
	return true;
}

/* 字符串是否为数字 */
function isNumber( chars ) {
	var re=/^\d*$/;
	if (chars.match(re) == null)
		return false;
	else
		return true;
}

/* 字符串是否为浮点数 */
function isFloat( str ) {
	for(i=0;i<str.length;i++)  {
	   if ((str.charAt(i)<"0" || str.charAt(i)>"9")&& str.charAt(i) != '.'){
			return false;
	   }
	}
	return true;
}

/* 判断是否为键盘输入的有效值 */
function checkKey(iKey){
	if(iKey == 32 || iKey == 229){return true;}/*空格和异常*/
	if(iKey>47 && iKey < 58){return true;}/*数字*/
	if(iKey>64 && iKey < 91){return true;}/*字母*/
	if(iKey>95 && iKey < 108){return true;}/*数字键盘1*/
	if(iKey>108 && iKey < 112){return true;}/*数字键盘2*/
	if(iKey>185 && iKey < 193){return true;}/*符号1*/
	if(iKey>218 && iKey < 223){return true;}/*符号2*/
	return false;
}

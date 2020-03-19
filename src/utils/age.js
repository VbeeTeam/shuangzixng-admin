//计算年龄
// export function getAge(birthday) {
//     //出生时间 毫秒
//     var birthDayTime = new Date(birthday);
//     //当前时间 毫秒
//     var nowTime = new Date();
//     var age = nowTime.getFullYear() -
//         birthDayTime.getFullYear() -
//         (nowTime.getMonth() < birthDayTime.getMonth() ||
//             (nowTime.getMonth() == birthDayTime.getMonth() &&
//                 nowTime.getDate() < birthDayTime.getDate()) ?
//             1 :
//             0);

//     return age
// }

export function getAge(strAge) {
	if(strAge != null){
		var birArr = strAge.split("-");
		var birYear = birArr[0];
		var birMonth = birArr[1];
		var birDay = birArr[2];

		d = new Date();
		var nowYear = d.getFullYear();
		var nowMonth = d.getMonth() + 1; //记得加1
		var nowDay = d.getDate();
		var returnAge;

		if (birArr == null) {
			return false
		};
		var d = new Date(birYear, birMonth - 1, birDay);
		if (d.getFullYear() == birYear && (d.getMonth() + 1) == birMonth && d.getDate() == birDay) {
			if (nowYear == birYear) {
				returnAge = 0; //
			} else {
				var ageDiff = nowYear - birYear; //
				if (ageDiff > 0) {
					if (nowMonth == birMonth) {
						var dayDiff = nowDay - birDay; //
						if (dayDiff < 0) {
							returnAge = ageDiff - 1;
						} else {
							returnAge = ageDiff;
						}
					} else {
						var monthDiff = nowMonth - birMonth; //
						if (monthDiff < 0) {
							returnAge = ageDiff - 1;
						} else {
							returnAge = ageDiff;
						}
					}
				} else {
					return "出生日期晚于今天，数据有误"; //返回-1 表示出生日期输入错误 晚于今天
				}
			}
			return returnAge;
		} else {
			return ("输入的日期格式错误！");
		}
	}
}

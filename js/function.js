 
Date.prototype.ISOdate = function () 
{	//Javascript Date Object to MySQL date (2014-05-11)
    var yyyy = this.getFullYear();
    var mm = this.getMonth()+1;
	mm = (mm < 10)? "0"+mm : ""+mm;
    var dd = this.getDate();
	dd = (dd < 10)? "0"+dd : ""+dd;
    return yyyy + "-" + mm + "-" + dd;
} 

String.prototype.toISOdate = function () 
{	//change dd/mm/yy\(Buddhist) to yyyy-mm-dd (Christ)
	if (!this) {
		return ""
	}
	if (ISODATE.test(this)) {
		return this	//already ISO date
	} else {
		if (THAIDATE.test(this)) {
			var date = this.split("/")
		} else {
			if (SHORTDATE.test(this)) {
				var date = this.split("/")
				date[2] = "25" + date[2]
			} else {
				return ""	//invalid date
			}
		}
	}
	date[2] = date[2] - 543
	return (date[2] + "-" + date[1] + "-" + date[0])
} 

String.prototype.thDate = function () 
{	//MySQL date (2014-05-11) to Thai date (11 พค. 2557) 
	if (this < '1900-01-01')
		return this
	var yyyy = parseInt(this.substr(0, 4)) + 543;
	var mm = this.substr(5, 2);
	for (ThMonth in NUMMONTH)
		if (NUMMONTH[ThMonth] === mm) 
			break;
	return (this.substr(8, 2) +' '+ ThMonth + yyyy);
} 

String.prototype.numDate = function () 
{	//Thai date (11 พค. 2557) to MySQL date (2014-05-11)
    var mm = this.substring(this.indexOf(" ")+1, this.length-4);
    var yyyy = parseInt(this.substr(this.length-4)) - 543;
    return yyyy +"-"+ NUMMONTH[mm] +"-"+ this.substr(0, 2);
} 

String.prototype.nextdays = function (days)
{	//MySQL date to be added or substract by days
	var morrow = new Date(this);
	morrow.setDate(morrow.getDate()+days);
	return morrow.ISOdate();
}

String.prototype.getAge = function (toDate)
{	//Calculate age at (toDate) (iso format) from birth date
	//with LARGESTDATE as today
	if (!toDate || this <= '1900-01-01') {
		return this
	}

	var birth = new Date(this);
	if (toDate === LARGESTDATE) {
		var today = new Date()
	} else {
		var today = new Date(toDate);
	}

	if (today.getTime() - birth.getTime() < 0)
		return "wrong date"

	var ayear = today.getFullYear();
	var amonth = today.getMonth();
	var adate = today.getDate();
	var byear = birth.getFullYear();
	var bmonth = birth.getMonth();
	var bdate = birth.getDate();

	var days = adate - bdate;
	var months = amonth - bmonth;
	var years = ayear - byear;
	if (days < 0)
	{
		months -= 1
		days = new Date(byear, bmonth+1, 0).getDate() + days;
	}
	if (months < 0)
	{
		years -= 1
		months += 12
	}

	var ageyears = years? years + Math.floor(months / 6)  + " ปี " : "";
	var agemonths = months? months + Math.floor(days / 15)  + " ด." : "";
	var agedays = days? days + " ว." : "";

	return years? ageyears : months? agemonths : agedays;
}

function getOpdate(date)	//change date from table to iso date
{
	if (date === undefined) { return date }
	if (date === "") {
		return LARGESTDATE
	} else {
		return date.numDate()
	}
}

function putOpdate(date)	//change date in book to show on table
{
	if (!date) { return date }
	if (date === LARGESTDATE) {
		return ""
	} else {
		return date.thDate()
	}
}

function putAgeOpdate(dob, date)
{
	if (!date || !dob) {
		return ""
	} else {
		return dob.getAge(date)
	}
}

function findDateArray(str)	//find date string
{							//in diagnosis, treatment, admission status
	if (!str) { return []}
	var iso = str.match((ISODATEG))
	var fullslash = str.match((THAIDATEG))
	var halfslash = str.match((SHORTDATEG))

	var dateArray = []

	if (iso) {
		dateArray = dateArray.concat( iso )
	}
	if (fullslash) {
		dateArray = dateArray.concat( fullslash )
	}
	if (halfslash) {
		dateArray = dateArray.concat( halfslash )
	}
	return dateArray
}

function dateDiff(fromDate, toDate)	//assume mm/dd/yy(yy) or yyyy-mm-dd
{
	var timeDiff = new Date(toDate) - new Date(fromDate)
	return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
}

function getSunday(date)	//get Sunday in the same week
{
	var today = date? new Date(date) : new Date();
	today.setDate(today.getDate() - today.getDay());
	return today.ISOdate();
}

function Ajax(url, params, callback)
{
	var http = new XMLHttpRequest();
	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() 
	{
		if(http.readyState === 4)
			callback(http.responseText);
	}
	http.send(params);
}

function URIcomponent(qoute)	//necessary when post in http, not when export to excel
{
	if (qoute) {
		qoute = qoute.replace(/\s+$/,'')
		qoute = qoute.replace(/\"/g, "&#34;")	// double quotes ((&#34;) or (&quot))
		qoute = qoute.replace(/\'/g, "&#39;")	// and single quotes (&#39;)
		qoute = qoute.replace(/\\/g, "\\\\")
		qoute = encodeURIComponent(qoute)
	}
	return qoute
}

function findTablerow(tableID, qn)
{
	var rows = document.getElementById(tableID).rows
	var i = 1
	while ((i < rows.length) && (rows[i].cells[QN].innerHTML !== qn)) {
		i++
	}
	if (i < rows.length) {
		return i
	} else {
		return null
	}
}

function findBOOKrow(book, qn)
{  
	var q = 0
	while ((q < book.length) && (book[q].qn !== qn)) {
		q++
	}
	if (q < book.length) {
		return q
	} else {
		return null
	}
}

function findNewBOOKrow(book, opdate)	//find new row (max. qn)
{
	var q = 0
	while (book[q].opdate !== opdate)
	{
		q++
		if (q >= book.length)
			return ""
	}

	var qn = Number(book[q].qn)
	var newq = q
	q++
	while (q < book.length && book[q].opdate === opdate) {
		if (Number(book[q].qn) > qn) {
			qn = Number(book[q].qn)
			newq = q
		}
		q++
	}
	return newq
}

function findStartRowInBOOK(book, opdate)
{
	var q = 0
	while ((q < book.length) && (book[q].opdate < opdate)) {
		q++
	}
	return q	
}

function findVisibleHead(table)
{
	var tohead

	$.each($(table + ' tr:has(th)'), function(i, tr) {
		tohead = tr
		return ($(tohead).offset().top < 0)
	})
	return tohead
}

function calculateWaitnum(tableID, $thisrow, thisOpdate)	//thisOpdate was set caller
{	//queue within each day is sorted by waitnum only, not staffname
	var prevWaitNum = $thisrow.prev()[0]
	var nextWaitNum = $thisrow.next()[0]
	if (prevWaitNum) {
		prevWaitNum = Number(prevWaitNum.title)
	}
	if (nextWaitNum) {
		nextWaitNum = Number(nextWaitNum.title)
	}
	var $prevRowCell = $thisrow.prev().children("td")
	var $nextRowCell = $thisrow.next().children("td")
	var prevOpdate = getOpdate($prevRowCell.eq(OPDATE).html())
	var nextOpdate = getOpdate($nextRowCell.eq(OPDATE).html())
	var defaultWaitnum = 1
	if ((tableID === "queuetbl") && ($('#titlename').html() === "Consults")) {
		defaultWaitnum = -1		//Consults cases have negative waitnum
	}

	if (prevOpdate !== thisOpdate && thisOpdate !== nextOpdate) {
		return defaultWaitnum
	}
	else if (prevOpdate === thisOpdate && thisOpdate !== nextOpdate) {
		return prevWaitNum + defaultWaitnum
	}
	else if (prevOpdate !== thisOpdate && thisOpdate === nextOpdate) {
		return nextWaitNum? (nextWaitNum / 2) : defaultWaitnum
	}
	else if (prevOpdate === thisOpdate && thisOpdate === nextOpdate) {
		return nextWaitNum? ((prevWaitNum + nextWaitNum) / 2) : (prevWaitNum + defaultWaitnum)
	}	//in case of new blank row nextWaitNum is undefined
}

function calculateRoomTime($moverow, $thisrow)
{
	var moveRoom = $moverow.children("td").eq(ROOMTIME).html()
	moveRoom = moveRoom? moveRoom.split("<br>") : ""
	var moveroom = moveRoom[0]? moveRoom[0] : ""

	var thisRoom = $thisrow.children("td").eq(ROOMTIME).html()
	thisRoom = thisRoom? thisRoom.split("<br>") : ""
	var thisroom = thisRoom[0]? thisRoom[0] : ""

	if ((thisroom) && (!moveroom)) {
		return thisRoom
	}
	return false
}

function decimalToTime(dec)
{
	var time = []
	var integer = Math.floor(dec)
	var decimal = dec - integer
	time[0] = (("" + integer).length === 1)? "0" + integer : "" + integer
	time[1] = decimal? String(decimal * 60) : "00"
	return time.join(".")
}

function timeToDecimal(time)
{
	var integer = Math.floor(time);
	time = (time - integer) * 100 / 60;
	return integer + time; // OR: return new String(integer+sec);
}

function addColor($this, thisOpdate) 
{
	var prevdate = $this.prev().children("td").eq(OPDATE).html()
	prevdate = prevdate? prevdate.numDate() : ""
	if (((thisOpdate !== prevdate) && ($this.prev()[0].className.indexOf("odd") < 0))
	|| ((thisOpdate === prevdate) && ($this.prev()[0].className.indexOf("odd") >= 0))) {
		$this.addClass("odd")
	} else {
		$this.removeClass()	//clear colored row that is moved to non-color opdate
	}
}

function findPrevcell(event, editable, pointing) 
{
	var $prevcell = $(pointing)
	var column = $prevcell.index()

	if ((column = editable[($.inArray(column, editable) - 1)]))
	{
		$prevcell = $prevcell.parent().children("td").eq(column)
	}
	else
	{
		do {
			if ($prevcell.parent().index() > 1)
			{	//go to prev row last editable
				$prevcell = $prevcell.parent().prev("tr")
										.children().eq(editable[editable.length-1])
			}
			else
			{	//#tbl tr:1 td:1
				event.preventDefault()
				return false
			}
		}
		while (($prevcell.get(0).nodeName === "TH")	//THEAD row
			|| (!$prevcell.is(':visible')))			//invisible due to colspan
	}

	return $prevcell.get(0)
}

function findNextcell(event, editable, pointing) 
{
	var $nextcell = $(pointing)
	var column = $nextcell.index()

	if ((column = editable[($.inArray(column, editable) + 1)]))
	{
		$nextcell = $nextcell.parent().children("td").eq(column)
	}
	else
	{
		do {//go to next row first editable
			$nextcell = $($nextcell).parent().next("tr")
										.children().eq(editable[0])
			if (!($nextcell.length)) {
				event.preventDefault()
				return false
			}
		}
		while ((!$nextcell.is(':visible'))	//invisible due to colspan
			|| ($nextcell.get(0).nodeName === "TH"))	//TH row
	}

	return $nextcell.get(0)
}

function findNextRow(event, editable, pointing) 
{
	var $nextcell = $(pointing)

	//go to next row first editable
	do {
		$nextcell = $nextcell.parent().next("tr").children().eq(editable[0])
		if (!($nextcell.length)) {
			event.preventDefault()
			return false	
		}
	}
	while ((!$nextcell.is(':visible'))	//invisible due to colspan
		|| ($nextcell.get(0).nodeName === "TH"))	//TH row

	return $nextcell.get(0)
}

function holiday(date)
{
	var HOLIDAY = {
		"2017-02-11" : "url('pic/Magha.jpg')",
		"2017-02-13" : "url('pic/Maghasub.jpg')",	//หยุดชดเชยวันมาฆบูชา
		"2017-05-10" : "url('pic/Vesak.jpg')",
		"2017-05-12" : "url('pic/Ploughing.jpg')",
		"2017-07-08" : "url('pic/Asalha.jpg')",
		"2017-07-09" : "url('pic/Vassa.jpg')",
		"2017-07-10" : "url('pic/Asalhasub.jpg')",	//หยุดชดเชยวันอาสาฬหบูชา
		"2018-03-01" : "url('pic/Magha.jpg')",
		"2018-05-09" : "url('pic/Ploughing.jpg')",
		"2018-05-29" : "url('pic/Vesak.jpg')",
		"2018-07-27" : "url('pic/Asalha.jpg')",
		"2018-07-28" : "url('pic/Vassa.jpg')",
		"2019-02-19" : "url('pic/Magha.jpg')",		//วันมาฆบูชา
		"2019-05-13" : "url('pic/Ploughing.jpg')",	//วันพืชมงคล
		"2019-05-18" : "url('pic/Vesak.jpg')",		//วันวิสาขบูชา
		"2019-05-20" : "url('pic/Vesaksub.jpg')",	//หยุดชดเชยวันวิสาขบูชา
		"2019-07-16" : "url('pic/Asalha.jpg')",		//วันอาสาฬหบูชา
		"2019-07-17" : "url('pic/Vassa.jpg')"		//วันเข้าพรรษา
		}
	var monthdate = date.substring(5)
	var dayofweek = (new Date(date)).getDay()
	var holidayname = ""

	for (var key in HOLIDAY) 
	{
		if (key === date)
			return HOLIDAY[key]	//matched a holiday
		if (key > date)
			break		//Not a listed holiday. Neither a fixed nor a compensation holiday
	}
	switch (monthdate)
	{
	case "12-31":
		holidayname = "url('pic/Yearend.jpg')"
		break
	case "01-01":
		holidayname = "url('pic/Newyear.jpg')"
		break
	case "01-02":
		if ((dayofweek === 1) || (dayofweek === 2))
			holidayname = "url('pic/Yearendsub.jpg')"
		break
	case "01-03":
		if ((dayofweek === 1) || (dayofweek === 2))
			holidayname = "url('pic/Newyearsub.jpg')"
		break
	case "04-06":
		holidayname = "url('pic/Chakri.jpg')"
		break
	case "04-07":
	case "04-08":
		if (dayofweek === 1)
			holidayname = "url('pic/Chakrisub.jpg')"
		break
	case "04-13":
	case "04-14":
	case "04-15":
		holidayname = "url('pic/Songkran.jpg')"
		break
	case "04-16":
	case "04-17":
		if (dayofweek && (dayofweek < 4))
			holidayname = "url('pic/Songkransub.jpg')"
		break
	case "07-28":
		holidayname = "url('pic/King10.jpg')"
		break
	case "07-29":
	case "07-30":
		if (dayofweek === 1)
			holidayname = "url('pic/King10sub.jpg')"
		break
	case "08-12":
		holidayname = "url('pic/Queen.jpg')"
		break
	case "08-13":
	case "08-14":
		if (dayofweek === 1)
			holidayname = "url('pic/Queensub.jpg')"
		break
	case "10-13":
		holidayname = "url('pic/King09.jpg')"
		break
	case "10-14":
	case "10-15":
		if (dayofweek === 1)
			holidayname = "url('pic/King09sub.jpg')"
		break
	case "10-23":
		holidayname = "url('pic/Piya.jpg')"
		break
	case "10-24":
	case "10-25":
		if (dayofweek === 1)
			holidayname = "url('pic/Piyasub.jpg')"
		break
	case "12-05":
		holidayname = "url('pic/King9.jpg')"
		break
	case "12-06":
	case "12-07":
		if (dayofweek === 1)
			holidayname = "url('pic/Kingsub.jpg')"
		break
	case "12-10":
		holidayname = "url('pic/Constitution.jpg')"
		break
	case "12-11":
	case "12-12":
		if (dayofweek === 1)
			holidayname = "url('pic/Constitutionsub.jpg')"
		break
	}
	return holidayname
}


;(function($)
{
	$.fn.fixMe = function($container) {
		var $this = $(this),
			$t_fixed,
			pad = $container.css("paddingLeft")
		init();
		$container.off("scroll").on("scroll", scrollFixed);

		function init() {
			$t_fixed = $this.clone();
			$t_fixed.removeAttr("id")
			$t_fixed.find("tbody").remove().end()
					.addClass("fixed").insertBefore($this);
			$container.scrollTop(0)
			resizeFixed($t_fixed, $this);
			reposition($t_fixed, "left top", "left+" + pad + " top", $container)
			$t_fixed.hide()
		}

		function scrollFixed() {
			var offset = $(this).scrollTop(),
			tableTop = $this[0].offsetTop,
			tableBottom = tableTop + $this.height() - $this.find("thead").height();
			if(offset < tableTop || offset > tableBottom) {
				$t_fixed.hide();
			}
			else if (offset >= tableTop && offset <= tableBottom && $t_fixed.is(":hidden")) {
				$t_fixed.show();
			}
		}
	};
})(jQuery);

function resizeFixed($fix, $this)
{
	$fix.find("th").each(function(index) {
		var wide = $this.find("th").eq(index).width()

		$(this).css("width", wide + "px")
	});
}

function winResizeFix($this, $container)
{
	var $fix = $container.find(".fixed"),
		hide = $fix.css("display") === "none",
		pad = $container.css("paddingLeft")

	resizeFixed($fix, $this)
	reposition($fix, "left top", "left+" + pad + " top", $container)
	hide && $fix.hide()
}

String.prototype.thDate = function () 
{	//MySQL date (2014-05-11) to Thai date (11 พค. 2557) 
	var date = this.split("-")
	if ((date.length === 1) || (date[0] < "1900")) {
		return false
	}

	return [
		date[2],
		THAIMONTH[Number(date[1]) - 1],
		Number(date[0]) + 543
	].join(" ")
} 

String.prototype.numDate = function () 
{	//Thai date (11 พค. 2557) to MySQL date (2014-05-11)
	var date = this.split(" ")
	if ((date.length === 1) || parseInt(date[1])) {
		return ""
	}
	var mm = THAIMONTH.indexOf(date[1]) + 1

    return [
		Number(date[2]) - 543,
		(mm < 10 ? '0' : '') + mm,
		date[0]
	].join("-")
} 
 
Date.prototype.ISOdate = function () 
{	// Javascript Date Object to MySQL date (2014-05-11)
    var yyyy = this.getFullYear();
    var mm = this.getMonth()+1;
	mm = (mm < 10)? "0"+mm : ""+mm;
    var dd = this.getDate();
	dd = (dd < 10)? "0"+dd : ""+dd;
    return yyyy + "-" + mm + "-" + dd;
} 

String.prototype.nextdays = function (days)
{	// ISOdate to be added or substract by days
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

//get 1st date of last month
function getStart()
{
	var start = new Date()

	return new Date(start.getFullYear(), start.getMonth()-1, 1).ISOdate()
}

//change Thai date from table to ISO date
function getOpdate(date)
{
	if ((date === undefined) || (parseInt(date) === NaN)) {
		return ""
	}
	if (date === "") {
		return LARGESTDATE
	}
	return date.numDate()
}

//change date in book to show on table
function putThdate(date)
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

function Ajax(url, params, callback)
{
	var http = new XMLHttpRequest();
	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() 
	{
		if (http.readyState === 4 && http.status === 200) {
			callback(JSON.parse(http.responseText));
		}
		if (/404|500|503|504/.test(http.status)) {
			callback(http.statusText);
		}
	}
	http.send(params);
}

//necessary when post in http, not when export to excel
function URIcomponent(qoute)
{
	if (qoute) {
		qoute = qoute.replace(/\s+$/,'')
		qoute = qoute.replace(/\"/g, "&#34;")	// double quotes
		qoute = qoute.replace(/\'/g, "&#39;")	// single quotes
//		qoute = qoute.replace(/%/g, "&#37;")	// per cent, mysql: like "%...%"
		qoute = qoute.replace(/\\/g, "\\\\")
		qoute = encodeURIComponent(qoute)
	}
	return qoute
}

function getMaxQN(book)
{
	var qn = Math.max.apply(Math, $.map(book, function(row, i) {
			return row.qn
		}))
	return String(qn)
}

function getBOOKrowByQN(book, qn)
{  
	var bookq
	$.each(book, function() {
		bookq = this
		return (this.qn !== qn);
	})
	if (bookq.qn !== qn) {
		return null
	}
	return bookq
}

function getTableRowByQN(tableID, qn)
{
	return $("#" + tableID + " tr:has(td)").filter(function() {
		return this.cells[QN].innerHTML === qn
	})[0]
}

function getWaitingBOOKrowByHN(hn)
{  
	var	todate = new Date().ISOdate()

	return $.grep(gv.BOOK, function(bookq) {
		return bookq.opdate > todate && bookq.hn === hn
	})
}

function getWaitingTableRowByHN(hn)
{
	var	todate = new Date().ISOdate()

	return $("#tbl tr:has(td)").filter(function() {
		return this.cells[OPDATE].innerHTML.numDate() > todate
			&& this.cells[HN].innerHTML === hn
	})
}

// main table (#tbl) only
function getTableRowsByDate(opdateth)
{
	if (!opdateth) { return [] }
	return $("#tbl tr").filter(function() {
		return this.cells[OPDATE].innerHTML === opdateth;
	})
}

function getBOOKrowsByDate(book, opdate)
{
	return book.filter(function(row) {
		return (row.opdate === opdate);
	})
}

function findStartRowInBOOK(book, opdate)
{
	var q = 0
	while ((q < book.length) && (book[q].opdate < opdate)) {
		q++
	}
	return (q < book.length)? q : -1
}

function findLastDateInBOOK(book)
{
	var q = 0
	while ((q < book.length) && (book[q].opdate < LARGESTDATE)) {
		q++
	}
	return book[q-1].opdate
}

// main table (#tbl) only
function sameDateRoomTableQN(opdateth, room, theatre)
{
	if (!room) { return [] }

	var sameRoom = $('#tbl tr').filter(function() {
		return this.cells[OPDATE].innerHTML === opdateth
			&& this.cells[THEATRE].innerHTML === theatre
			&& this.cells[OPROOM].innerHTML === room
	})
	$.each(sameRoom, function(i) {
		sameRoom[i] = this.cells[QN].innerHTML
	})
	return $.makeArray(sameRoom)
}

function sameDateRoomBookQN(book, opdate, room)
{
	if (!room) { return [] }

	var sameRoom = book.filter(function(row) {
		return row.opdate === opdate && row.oproom === room;
	})
	$.each(sameRoom, function(i) {
		sameRoom[i] = this.qn
	})
	return sameRoom
}

// for main table (#tbl) only
function createThisdateTableRow(opdate, opdateth)
{
	if (opdate === LARGESTDATE) { return null }
	var rows = getTableRowsByDate(opdate.nextdays(-1).thDate()),
		$row = $(rows[rows.length-1]),
		$thisrow = $row && $row.clone().insertAfter($row)

	$thisrow && $thisrow.find("td").eq(OPDATE).html(opdateth)

	return $thisrow
}

function isSplited()
{  
	return $("#queuewrapper").css("display") === "block"
}

function isStaffname(staffname)
{  
	return $('#titlename').html() === staffname
}

function isConsults()
{  
	return $('#titlename').html() === "Consults"
}

function ConsultsTbl(tableID)
{  
	var queuetbl = tableID === "queuetbl"
	var consult = $("#titlename").html() === "Consults"

	return queuetbl && consult
}

// waitnum is for ordering where there is no oproom, casenum
function calcWaitnum(thisOpdate, $prevrow, $nextrow)
{
	var prevWaitNum = Number($prevrow.prop("title")),
		nextWaitNum = Number($nextrow.prop("title")),

		$prevRowCell = $prevrow.children("td"),
		$nextRowCell = $nextrow.children("td"),
		prevOpdate = $prevRowCell.eq(OPDATE).html(),
		nextOpdate = $nextRowCell.eq(OPDATE).html(),
		tableID = $prevrow.closest("table").attr("id")
		defaultWaitnum = (ConsultsTbl(tableID))? -1 : 1
	//Consults cases have negative waitnum

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
	}	// nextWaitNum is undefined in case of new blank row
}

function decimalToTime(dec)
{
	if (dec === 0) { return "" }

	var	integer = Math.floor(dec),
		decimal = dec - integer

	return [
		(integer < 10) ? "0" + integer : "" + integer,
		decimal ? String(decimal * 60) : "00"
	].join(".")
}

function strtoTime(value)
{
	var	time = value.split("."),
		hour = time[0],
		min = time[1] || "0",
		val = Number(value)

	if (isNaN(val) || val < 0 || val > 24) {
		Alert("เวลาผ่าตัด", "<br>รูปแบบเวลา ไม่ถูกต้อง<br><br>ใช้<br><br>ตั้งแต่ 00.00 - 08.30 - 09.00 ถึง 24.00")
		return false
	}
	else if (val === 0) {
		return ""
	}
	else {
		min = min.substr(0, 2)
		return [
			(Number(hour) < 10) ? "0" + hour : "" + hour,
			(Number(min) < 10) ? min + "0" : "" + min
		].join(".")
	}
}

function getNextDayOfWeek(date, dayOfWeek)
{
	var resultDate = new Date(date.getTime());

	resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

	return resultDate;
}

function inPicArea(evt, pointing) {
	var $pointing = $(pointing),
		x = evt.pageX,
		y = evt.pageY,
		square = picArea(pointing),
		top = square.top,
		right = square.right,
		bottom = square.bottom,
		left = square.left,
		inX = (left < x) && (x < right),
		inY = (top < y) && (y < bottom)

	return inX && inY
}

function picArea(pointing) {
	var $pointing = $(pointing),
		right = $pointing.offset().left + $pointing.width(),
		bottom = $pointing.offset().top + $pointing.height(),
		left = right - 25,
		top = bottom - 25

	return {
		top: top,
		bottom: bottom,
		left: left,
		right: right
	}
}

function dataforEachCell(cells, data)
{
	data.forEach(function(item, i) {
		cells[i].innerHTML = item
	})
}

function rowDecoration(row, date)
{
	var	cells = row.cells

	row.className = dayName(NAMEOFDAYFULL, date) || "nodate"
	cells[OPDATE].innerHTML = putThdate(date)
	cells[OPDATE].className = dayName(NAMEOFDAYABBR, date)
	cells[DIAGNOSIS].style.backgroundImage = holiday(date)
}

function showEquip(equipString)
{
	if (equipString) {
		return makeEquip(JSON.parse(equipString))
	} else {
		return ""
	}
}

function makeEquip(equipJSON)
{
	var equip = "",
		equipIcons = {
			Fluoroscope: "Fluoroscope",
			Navigator_frameless: "Navigator",
			"Navigator_frame-based": "Navigator",
			Oarm: "Oarm",
			Robotics: "Robotics",
			Microscope: "Microscope",
			ICG: "Microscope",
			Endoscope: "Endoscope",
			Excell: "CUSA",
			Soring: "CUSA",
			Sonar: "CUSA",
			ultrasound: "Ultrasound",
			Doppler: "Ultrasound",
			Duplex: "Ultrasound",
			CN5: "Monitor",
			CN6: "Monitor",
			CN7: "Monitor",
			CN8: "Monitor",
			SSEP: "Monitor",
			EMG: "Monitor",
			MEP: "Monitor"
		},
		equipPics = []

	$.each(equipJSON, function(key, value) {
		var Monitor = /Monitor/.test(equip)
		if (equip) { equip += ", " }
		if (value === "checked") {
			if (key in equipIcons) {
				equipPics.push(equipIcons[key])
				if (!Monitor) {
					equip += "Monitor:"
				}
			}
			equip += key
		} else {
			if (key === "Monitor") {
				if (Monitor) {
					equip += value
				}
			} else {
				equip += key + ":" + value
			}
		}
	})
	// remove duplicated pics
	equipPics = equipPics.filter(function(pic, pos) {
		return equipPics.indexOf(pic) === pos;
	})

	return equip + "<br>" + equipImg(equipPics)
}

function equipImg(equipPics)
{
	var img = ""

	$.each(equipPics, function() {
		img += '<img src="css/pic/equip/' + this + '.jpg" height="24" width="30"> '
	})

	return img
}

function findPrevcell(editable, pointing) 
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
				return false
			}
		}
		while (($prevcell.get(0).nodeName === "TH")
			|| (!$prevcell.is(':visible')))
				//invisible due to colspan in servicetbl
	}

	return $prevcell.get(0)
}

function findNextcell(editable, pointing) 
{
	var $nextcell = $(pointing)
	var column = $nextcell.index()

	if ((column = editable[($.inArray(column, editable) + 1)]))
	{
		$nextcell = $nextcell.parent().children("td").eq(column)
	}
	else
	{
		do {
			$nextcell = $nextcell.parent().next("tr")
										.children().eq(editable[0])
			if (!($nextcell.length)) {
				return false
			}
		}
				//invisible due to colspan in servicetbl
		while ((!$nextcell.is(':visible'))
			|| ($nextcell.get(0).nodeName === "TH"))	//TH row
	}

	return $nextcell.get(0)
}

function findNextRow(editable, pointing) 
{
	var $nextcell = $(pointing)

	//go to next row first editable
	do {
		$nextcell = $nextcell.parent().next("tr").children().eq(editable[0])
		if (!($nextcell.length)) {
			return false	
		}
	}
	while ((!$nextcell.is(':visible'))	//invisible due to colspan
		|| ($nextcell.get(0).nodeName === "TH"))	//TH row

	return $nextcell.get(0)
}

function exportServiceToExcel()
{
	//getting data from our table
	var data_type = 'data:application/vnd.ms-excel';	//Chrome, FF, not IE
	var title = $('#dialogService').dialog( "option", "title" )
	var style = '\
		<style type="text/css">\
			#exceltbl {\
				border-right: solid 1px slategray;\
				border-collapse: collapse;\
			}\
			#exceltbl tr:nth-child(odd) {\
				background-color: #E0FFE0;\
			}\
			#exceltbl th {\
				font-size: 16px;\
				font-weight: bold;\
				height: 40px;\
				background-color: #7799AA;\
				color: white;\
				border: solid 1px silver;\
			}\
			#exceltbl td {\
				font-size: 14px;\
				vertical-align: middle;\
				padding-left: 3px;\
				border-left: solid 1px silver;\
				border-bottom: solid 1px silver;\
			}\
			#excelhead td {\
				height: 30px; \
				vertical-align: middle;\
				font-size: 22px;\
				text-align: center;\
			}\
			#excelhead td.Readmission,\
			#exceltbl tr.Readmission,\
			#exceltbl td.Readmission { background-color: #AACCCC; }\
			#excelhead td.Reoperation,\
			#exceltbl tr.Reoperation,\
			#exceltbl td.Reoperation { background-color: #CCCCAA; }\
			#excelhead td.Infection,\
			#exceltbl tr.Infection,\
			#exceltbl td.Infection { background-color: #CCAAAA; }\
			#excelhead td.Morbidity,\
			#exceltbl tr.Morbidity,\
			#exceltbl td.Morbidity { background-color: #AAAACC; }\
			#excelhead td.Dead,\
			#exceltbl tr.Dead,\
			#exceltbl td.Dead { background-color: #AAAAAA; }\
		</style>'
	var head = '\
		  <table id="excelhead">\
			<tr>\
			  <td></td>\
			  <td></td>\
			  <td colspan="4" style="font-weight:bold;font-size:24px">' + title + '</td>\
			</tr>\
			<tr></tr>\
			<tr></tr>\
			<tr>\
			  <td></td>\
			  <td></td>\
			  <td>Admission : ' + $("#Admission").html() + '</td>\
			  <td>Discharge : ' + $("#Discharge").html() + '</td>\
			  <td>Operation : ' + $("#Operation").html() + '</td>\
			  <td class="Morbidity">Morbidity : ' + $("#Morbidity").html() + '</td>\
			</tr>\
			<tr>\
			  <td></td>\
			  <td></td>\
			  <td class="Readmission">Re-admission : ' + $("#Readmission").html() + '</td>\
			  <td class="Infection">Infection SSI : ' + $("#Infection").html() + '</td>\
			  <td class="Reoperation">Re-operation : ' + $("#Reoperation").html() + '</td>\
			  <td class="Dead">Dead : ' + $("#Dead").html() + '</td>\
			</tr>\
			<tr></tr>\
			<tr></tr>\
		  </table>'
	var month = $("#monthstart").val()
	month = month.substring(0, month.lastIndexOf("-"))	//use yyyy-mm for filename
	var filename = 'Service Neurosurgery ' + month + '.xls'

	exportToExcel("servicetbl", data_type, title, style, head, filename)	  
}

function exportFindToExcel(search)
{
	// getting data from our table
	// data_type is for Chrome, FF
	// IE uses "txt/html", "replace" with blob
	var data_type = 'data:application/vnd.ms-excel'
	var title = $('#dialogFind').dialog( "option", "title" )
	var style = '\
		<style type="text/css">\
			#exceltbl {\
				border-right: solid 1px slategray;\
				border-collapse: collapse;\
			}\
			#exceltbl tr:nth-child(odd) {\
				background-color: #E0FFE0;\
			}\
			#exceltbl th {\
				font-size: 16px;\
				font-weight: bold;\
				height: 40px;\
				background-color: #7799AA;\
				color: white;\
				border: solid 1px silver;\
			}\
			#exceltbl td {\
				font-size: 14px;\
				vertical-align: middle;\
				padding-left: 3px;\
				border-left: solid 1px silver;\
				border-bottom: solid 1px silver;\
			}\
			#excelhead td {\
				height: 30px; \
				vertical-align: middle;\
				font-size: 22px;\
				text-align: center;\
			}\
		</style>'
	var head = '\
		  <table id="excelhead">\
			<tr></tr>\
			<tr>\
			  <td></td>\
			  <td></td>\
			  <td colspan="4" style="font-weight:bold;font-size:24px">' + title + '</td>\
			</tr>\
			<tr></tr>\
		  </table>'
	var filename = 'Search ' + search + '.xls'

	exportToExcel("findtbl", data_type, title, style, head, filename)	  
}

function exportReportToExcel(title)
{
	// getting data from our table
	// data_type is for Chrome, FF
	// IE uses "txt/html", "replace" with blob
	var data_type = 'data:application/vnd.ms-excel'
	var style = '\
		<style type="text/css">\
			#exceltbl {\
				border-right: solid 1px slategray;\
				border-collapse: collapse;\
			}\
			#exceltbl tr:nth-child(odd) {\
				background-color: #E0FFE0;\
			}\
			#exceltbl th {\
				font-size: 16px;\
				font-weight: bold;\
				height: 40px;\
				background-color: #7799AA;\
				color: white;\
				border: solid 1px silver;\
			}\
			#exceltbl td {\
				font-size: 14px;\
				text-align: center;\
				vertical-align: middle;\
				padding-left: 3px;\
				border-left: solid 1px silver;\
				border-bottom: solid 1px silver;\
			}\
			#exceltbl td:first-child {\
				text-align: left;\
			}\
			#exceltbl tr.nonsurgical {\
				background-color: LightGrey;\
			}\
			#exceltbl tr#total {\
				background-color: BurlyWood;\
			}\
			#exceltbl tr#grand {\
				background-color: Turquoise;\
			}\
			#excelhead td {\
				height: 30px; \
				vertical-align: middle;\
				font-size: 22px;\
				text-align: center;\
			}\
		</style>'
	var head = '\
		  <table id="excelhead">\
			<tr></tr>\
			<tr>\
			  <td colspan="9" style="font-weight:bold;font-size:24px">' + title + '</td>\
			</tr>\
			<tr></tr>\
		  </table>'
	var filename = 'Report ' + title + '.xls'

	exportToExcel("reviewtbl", data_type, title, style, head, filename)	  
}

function exportToExcel(id, data_type, title, style, head, filename)
{
	if ($("#exceltbl").length) {
		$("#exceltbl").remove()
	}
	$("#" + id).clone(true).attr("id", "exceltbl").appendTo("body")
	$.each( $("#exceltbl tr"), function() {
		var multiclass = this.className.split(" ")
		if (multiclass.length > 1) {
			this.className = multiclass[multiclass.length-1]
		}	//use only the last class because excel not accept multiple classes
	})
	$.each( $("#exceltbl tr td, #exceltbl tr th"), function() {
		if ($(this).css("display") === "none") {
			$(this).remove()
		}	//remove trailing hidden cells in excel
	})
	var table = $("#exceltbl")[0].outerHTML
	table = table.replace(/<br>/g, " ")	//excel split <br> to another cell inside that cell 

	var tableToExcel = '<!DOCTYPE html><HTML><HEAD><meta charset="utf-8"/>' + style + '</HEAD><BODY>'
	tableToExcel += head + table
	tableToExcel += '</BODY></HTML>'

	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE")
	var edge = ua.indexOf("Edge"); 

	if (msie > 0 || edge > 0 || navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer
	{
	  if (typeof Blob !== "undefined") {
		//use blobs if we can
		tableToExcel = [tableToExcel];
		//convert to array
		var blob1 = new Blob(tableToExcel, {
		  type: "text/html"
		});
		window.navigator.msSaveBlob(blob1, filename);
	  } else {
		txtArea1.document.open("txt/html", "replace");
		txtArea1.document.write(tableToExcel);
		txtArea1.document.close();
		txtArea1.focus();
		sa = txtArea1.document.execCommand("SaveAs", true, filename);
		return (sa);	//not tested
	  }
	} else {
		var a = document.createElement('a');
		document.body.appendChild(a);  // You need to add this line in FF
		a.href = data_type + ', ' + encodeURIComponent(tableToExcel);
		a.download = filename
		a.click();		//tested with Chrome and FF
	}
}


function fillupstart()		
{	//Display all cases in each day of 5 weeks
	var table = document.getElementById("tbl")
	var today = new Date()

	// Find the 1st of last month
	var start = new Date(today.getFullYear(), today.getMonth()-1).ISOdate()

	//fill until 1 year from now
	var nextyear = today.getFullYear() + 2
	var month = today.getMonth()
	var date = today.getDate()
	var until = (new Date(nextyear, month, date)).ISOdate()
	var book = gv.BOOK
	if (book.length === 0) { book.push({"opdate" : today.ISOdate()}) }

	fillall(book, table, start, until)

	//scroll to todate
	var todate = today.ISOdate().thDate()
	var thishead = $("tr:contains(" + todate + ")").eq(0)
	$('#tblcontainer').animate({
		scrollTop: thishead.offset().top
	}, 300);
}

function fillForScrub()
{
	var table = document.getElementById("tbl")
	var start = new Date().ISOdate()
	var until = start.nextdays(6)
	var book = gv.BOOK

	fillall(book, table, start, until)
}

function fillall(book, table, start, until)
{
	var tbody = table.getElementsByTagName("tbody")[0]
	var rows = table.rows
	var head = table.rows[0]
	var date = start
	var madedate
	var q = findStartRowInBOOK(book, start)
	var k = findStartRowInBOOK(book, LARGESTDATE)

	book = book.slice(0, k)

	//i for rows in table (with head as the first row)
	var i = 0
	var booklength = book.length
	for (q; q < booklength; q++)
	{	
		//step over each day that is not in QBOOK
		while (date < book[q].opdate)
		{
			if (date !== madedate)
			{
				//make a blank row for each day which is not in book
				makenextrow(table, date)	//insertRow
				i++
				
				madedate = date
			}
			date = date.nextdays(1)
			if (date > until) {
				return
			}

			//make table head row before every Monday
			if ((new Date(date).getDay())%7 === 1)
			{
				var clone = head.cloneNode(true)
				tbody.appendChild(clone)
 				i++
			}
		}
		makenextrow(table, date)
		i++
		filldata(book[q], rows[i])
		madedate = date
	}

	while (date < until)
	{
		date = date.nextdays(1)

		//make table head row before every Monday
		if (((new Date(date)).getDay())%7 === 1)
		{
			var clone = head.cloneNode(true)
			tbody.appendChild(clone)
		}
		//make a blank row
		makenextrow(table, date)	//insertRow
	}
}

function refillall()
{
	var book = gv.BOOK
	var table = document.getElementById("tbl")
	var tbody = table.getElementsByTagName("tbody")[0]
	var rows = table.rows
	var tlen = rows.length
	var head = rows[0]
	var start = $('#tbl tr:has("td"):first td').eq(OPDATE).html().numDate()
	var date = start
	var madedate
	var q = findStartRowInBOOK(book, start)			//Start row in BOOK
	var k = findStartRowInBOOK(book, LARGESTDATE)	//Stop row in BOOK

	book = book.slice(0, k)

	//i for rows in table (with head as the first row)
	var i = 1
	var booklength = book.length
	while (i < tlen)		//make blank rows till the end of existing table
	{
		if (q < booklength) {
			//step over each day that is not in book
			while (date < book[q].opdate)
			{
				if (date !== madedate)
				{
					fillrowdate(rows, i, date)	//existing row
					fillblank(rows[i])	//clear a row for the day not in book
					i++
					if (i >= tlen) {
						return
					}
					
					madedate = date
				}
				date = date.nextdays(1)
				//make table head row before every Monday
				if ((new Date(date).getDay())%7 === 1)
				{
					if (rows[i].cells[OPDATE].nodeName !== "TH") {
						var rowh = head.cloneNode(true)
						tbody.replaceChild(rowh, rows[i])
					}

					i++
					if (i >= tlen) {
						return
					}
				}
			}
			fillrowdate(rows, i, date)	//existing row
			filldata(book[q], rows[i])	//fill a row for the day in book
			madedate = date
			i++
			if (i >= tlen) {
				return
			}
			q++
		}
		else
		{
			date = date.nextdays(1)

			//make table head row before every Monday
			if (((new Date(date)).getDay())%7 === 1)
			{
				if (rows[i].cells[OPDATE].nodeName !== "TH") {
					var rowh = head.cloneNode(true)
					tbody.replaceChild(rowh, rows[i])
				}

				i++
				if (i >= tlen) {
					return
				}
			}

			//make a blank row
			fillrowdate(rows, i, date)	//existing row
			fillblank(rows[i])
			i++
			if (i >= tlen) {
				return
			}
		}
	}
}

function refillOneDay(opdate)
{
	var getOpdateRows = function (opdate) {
		var opdateth = opdate.thDate()
		return $('#tbl tr').filter(function() {
			return $(this).find("td").eq(OPDATE).html() === opdateth;
		}).closest("tr")
	}
	var book = gv.BOOK
	var opdateBOOKrows = book.filter(function(row) {
			return (row.opdate === opdate);
		})
	var $opdateTblRows = getOpdateRows(opdate)
	var bookRows = opdateBOOKrows.length
	var tblRows = $opdateTblRows.length

	if (!tblRows) {
		return		//Out of tbl range
	}
	if (!bookRows) {
		while ($opdateTblRows.length > 1) {
			$opdateTblRows.eq(0).remove()
			$opdateTblRows = getOpdateRows(opdate)
		}
		var $cells = $opdateTblRows.children("td")
		$cells.eq(OPDATE).siblings().html("")
		$cells.eq(HN).removeClass("pacs")
		$cells.eq(NAME).removeClass("camera")
		$opdateTblRows.attr("title", "")
		showStaffImage(opdate, $cells[STAFFNAME])
	} else {
		if (tblRows > bookRows) {
			while ($opdateTblRows.length > bookRows) {
				$opdateTblRows.eq(0).remove()
				$opdateTblRows = getOpdateRows(opdate)
			}
		}
		else if (tblRows < bookRows) {
			while ($opdateTblRows.length < bookRows) {
				$opdateTblRows.eq(0).clone().insertAfter($opdateTblRows.eq(0))
				$opdateTblRows = getOpdateRows(opdate)
			}
		}
		$.each(opdateBOOKrows, function(key, val) {
			filldata(this, $opdateTblRows[key])
			$opdateTblRows[key].cells[STAFFNAME].style.backgroundImage = ""
		})
	}
}

function makenextrow(table, date)	//create and decorate new row
{
	var tbody = table.getElementsByTagName("tbody")[0]
	var tblcells = document.getElementById("tblcells")
	var row = tblcells.rows[0].cloneNode(true)
	var rowi = tbody.appendChild(row)

	rowi.cells[OPDATE].innerHTML = date.thDate()
	rowi.cells[OPDATE].className = NAMEOFDAYABBR[(new Date(date)).getDay()]
	rowi.cells[DIAGNOSIS].style.backgroundImage = holiday(date)
	rowi.className = NAMEOFDAYFULL[(new Date(date)).getDay()]
}

function fillrowdate(rows, i, date)	//renew and decorate existing row
{
	var tblcells = document.getElementById("tblcells")

	if (rows[i].cells[OPDATE].nodeName !== "TD") {
		var row = tblcells.rows[0].cloneNode(true)
		rows[i].parentNode.replaceChild(row, rows[i])
	}
	rows[i].cells[OPDATE].innerHTML = date.thDate()
	rows[i].cells[OPDATE].className = NAMEOFDAYABBR[(new Date(date)).getDay()]
	rows[i].cells[DIAGNOSIS].style.backgroundImage = holiday(date)
	rows[i].className = NAMEOFDAYFULL[(new Date(date)).getDay()]
}

function fillblank(rowi)
{
	var cells = rowi.cells
	cells[ROOMTIME].innerHTML = ""
	cells[STAFFNAME].innerHTML = ""
	cells[HN].innerHTML = ""
	cells[HN].className = ""
	cells[NAME].innerHTML = ""
	cells[NAME].className = ""
	cells[DIAGNOSIS].innerHTML = ""
	cells[TREATMENT].innerHTML = ""
	cells[CONTACT].innerHTML = ""
	cells[QN].innerHTML = ""
}

function filldata(bookq, rowi)
{
	var cells = rowi.cells

	rowi.title = bookq.waitnum
	if (bookq.hn && gv.isPACS) {
		cells[HN].className = "pacs"
	}
	cells[NAME].className = bookq.patient? "camera" : ""

	cells[ROOMTIME].innerHTML = putRoomTime(bookq)
	cells[STAFFNAME].innerHTML = bookq.staffname
	cells[HN].innerHTML = bookq.hn
	cells[NAME].innerHTML = putNameAge(bookq)
	cells[DIAGNOSIS].innerHTML = bookq.diagnosis
	cells[TREATMENT].innerHTML = bookq.treatment
	cells[CONTACT].innerHTML = bookq.contact
	cells[QN].innerHTML = bookq.qn
}

function staffqueue(staffname)
{
	var today = new Date()
	var todate = today.ISOdate()
	var scrolled = $("#queuecontainer").scrollTop()
	var book = gv.BOOK
	var consult = gv.CONSULT

	if ($("#queuewrapper").css("display") !== "block") {
		splitPane()
	}
	$('#titlename').html(staffname)
	
	//delete previous queuetbl lest it accumulates
	$('#queuetbl tr').slice(1).remove()

	if (staffname === "Consults") {		//Consults cases are not in BOOK
		if (consult.length === 0)
			consult.push({"opdate" : getSunday()})

		var table = document.getElementById("queuetbl")
		var start = (new Date((today).getFullYear(), (today).getMonth() - 1, 1)).ISOdate()

		fillall(consult, table, start, todate)

		var queueh = $("#queuetbl").height()
		$("#queuecontainer").scrollTop(queueh)
	} else {
		$.each( book, function() {	// each === this
			if (( this.staffname === staffname ) && this.opdate >= todate) {
				$('#tblcells tr').clone()
					.appendTo($('#queuetbl'))
						.filldataQueue(this)
			}
		});

		$("#queuecontainer").scrollTop(scrolled)
	}
}

function refillstaffqueue()
{
	var today = new Date()
	var todate = today.ISOdate()
	var staffname = $('#titlename').html()
	var book = gv.BOOK
	var consult = gv.CONSULT

	if (staffname === "Consults") {
		//Consults table is rendered same as fillall
		$('#queuetbl tr').slice(1).remove()
		if (consult.length === 0)
			consult.push({"opdate" : getSunday()})

		var table = document.getElementById("queuetbl")
		var start = (new Date((today).getFullYear(), (today).getMonth() - 1, 1)).ISOdate()

		fillall(consult, table, start, todate)
	} else {
		//render as staffqueue
		var i = 0
		$.each( book, function(q, each) {	// each === this
			if ((this.opdate >= todate) && (this.staffname === staffname)) {
				i++
				if (i >= $('#queuetbl tr').length) {
					$('#tblcells tr').clone()
						.appendTo($('#queuetbl'))
							.filldataQueue(this)
				} else {
					$('#queuetbl tr').eq(i)
						.filldataQueue(this)
				}
			}
		})
		if (i < ($('#queuetbl tr').length - 1))
			$('#queuetbl tr').slice(i+1).remove()
	}
}

jQuery.fn.extend({
	filldataQueue : function(bookq) {
		var cells = this[0].cells
		if  (bookq.opdate === LARGESTDATE) {
			cells[OPDATE].className = ""
		} else {
			cells[OPDATE].className = NAMEOFDAYABBR[(new Date(bookq.opdate)).getDay()]
		}
		cells[OPDATE].innerHTML = putOpdate(bookq.opdate)
		cells[ROOMTIME].innerHTML = putRoomTime(bookq)
		cells[STAFFNAME].innerHTML = bookq.staffname
		cells[HN].innerHTML = bookq.hn
		cells[HN].className = (bookq.hn && gv.isPACS)? "pacs" : ""
		cells[NAME].innerHTML = putNameAge(bookq)
		cells[NAME].className = bookq.patient? "camera" : ""
		cells[DIAGNOSIS].innerHTML = bookq.diagnosis
		cells[TREATMENT].innerHTML = bookq.treatment
		cells[CONTACT].innerHTML = bookq.contact
		cells[QN].innerHTML = bookq.qn
		this[0].title = bookq.waitnum
		addColor(this, bookq.opdate)
	}
})

function putRoomTime(bookq)
{
	return (bookq.oproom? bookq.oproom : "")
		 + (bookq.optime? "<br>" + bookq.optime : "")
}

function putNameAge(bookq)
{
	return bookq.patient
		+ (bookq.dob? ("<br>อายุ " + putAgeOpdate(bookq.dob, bookq.opdate)) : "")
}

function addColor($this, bookqOpdate) 
{
	var prevdate = $this.prev().children("td").eq(OPDATE).html()
	prevdate = prevdate? prevdate.numDate() : ""
	//In LARGESTDATE, prevdate = "" but bookqOpdate = LARGESTDATE
	//So LARGESTDATE cases has alternate colors
	if (((bookqOpdate !== prevdate) && ($this.prev()[0].className.indexOf("odd") < 0))
	|| ((bookqOpdate === prevdate) && ($this.prev()[0].className.indexOf("odd") >= 0))) {
		$this.addClass("odd")
	} else {
		$this.removeClass("odd")	//clear colored row that is moved to non-color opdate
	}
}
 
Date.prototype.ISOdate = function () 
{	//Javascript Date Object to MySQL date (2014-05-11)
    var yyyy = this.getFullYear();
    var mm = this.getMonth()+1;
	mm = (mm < 10)? "0"+mm : ""+mm;
    var dd = this.getDate();
	dd = (dd < 10)? "0"+dd : ""+dd;
    return yyyy + "-" + mm + "-" + dd;
} 

String.prototype.nextdays = function (days)
{	//MySQL date to be added or substract by days
	var morrow = new Date(this);
	morrow.setDate(morrow.getDate()+days);
	return morrow.ISOdate();
}

function findStartRowInBOOK(book, opdate)
{
	var q = 0
	while ((q < book.length) && (book[q].opdate < opdate)) {
		q++
	}
	return (q < book.length)? q : -1
}

function holiday(date)
{
	var HOLIDAY = {
		"2018-03-01" : "url('css/pic/Magha.png')",
		"2018-05-09" : "url('css/pic/Ploughing.png')",
		"2018-05-29" : "url('css/pic/Vesak.png')",
		"2018-07-27" : "url('css/pic/Asalha.png')",
		"2018-07-28" : "url('css/pic/Vassa.png')",
		"2019-02-19" : "url('css/pic/Magha.png')",		//วันมาฆบูชา
		"2019-05-13" : "url('css/pic/Ploughing.png')",	//วันพืชมงคล
		"2019-05-18" : "url('css/pic/Vesak.png')",		//วันวิสาขบูชา
		"2019-05-20" : "url('css/pic/Vesaksub.png')",	//หยุดชดเชยวันวิสาขบูชา
		"2019-07-16" : "url('css/pic/Asalha.png')",		//วันอาสาฬหบูชา
		"2019-07-17" : "url('css/pic/Vassa.png')"		//วันเข้าพรรษา
		}
	var monthdate = date.substring(5)
	var dayofweek = (new Date(date)).getDay()
	var holidayname = ""
	var Mon = (dayofweek === 1)
	var Tue = (dayofweek === 2)
	var Wed = (dayofweek === 3)

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
		holidayname = "url('css/pic/Yearend.png')"
		break
	case "01-01":
		holidayname = "url('css/pic/Newyear.png')"
		break
	case "01-02":
		if (Mon || Tue)
			holidayname = "url('css/pic/Yearendsub.png')"
		break
	case "01-03":
		if (Mon || Tue)
			holidayname = "url('css/pic/Newyearsub.png')"
		break
	case "04-06":
		holidayname = "url('css/pic/Chakri.png')"
		break
	case "04-07":
	case "04-08":
		if (Mon)
			holidayname = "url('css/pic/Chakrisub.png')"
		break
	case "04-13":
	case "04-14":
	case "04-15":
		holidayname = "url('css/pic/Songkran.png')"
		break
	case "04-16":
	case "04-17":
		if (Mon || Tue || Wed)
			holidayname = "url('css/pic/Songkransub.png')"
		break
	case "07-28":
		holidayname = "url('css/pic/King10.png')"
		break
	case "07-29":
	case "07-30":
		if (Mon)
			holidayname = "url('css/pic/King10sub.png')"
		break
	case "08-12":
		holidayname = "url('css/pic/Queen.png')"
		break
	case "08-13":
	case "08-14":
		if (Mon)
			holidayname = "url('css/pic/Queensub.png')"
		break
	case "10-13":
		holidayname = "url('css/pic/King09.png')"
		break
	case "10-14":
	case "10-15":
		if (Mon)
			holidayname = "url('css/pic/King09sub.png')"
		break
	case "10-23":
		holidayname = "url('css/pic/Piya.png')"
		break
	case "10-24":
	case "10-25":
		if (Mon)
			holidayname = "url('css/pic/Piyasub.png')"
		break
	case "12-05":
		holidayname = "url('css/pic/King9.png')"
		break
	case "12-06":
	case "12-07":
		if (Mon)
			holidayname = "url('css/pic/Kingsub.png')"
		break
	case "12-10":
		holidayname = "url('css/pic/Constitution.png')"
		break
	case "12-11":
	case "12-12":
		if (Mon)
			holidayname = "url('css/pic/Constitutionsub.png')"
		break
	}
	return holidayname
}

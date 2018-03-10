
function start(userid)
{
	var sql = "UPDATE staff,(SELECT MAX(dateoncall) AS max FROM staff) as oncall "
			+	"SET staffoncall=staffname,"
			+		"dateoncall=DATE_ADD(oncall.max,INTERVAL 1 WEEK) "
			+	"WHERE dateoncall<=CURDATE();"
			+	"SELECT * FROM staff ORDER BY number;"

	Ajax(MYSQLIPHP, "start=" + sql, loading);

	gv.user = userid
	resetTimer()

	$("#login").remove()
	$("#logo").remove()
	$("#wrapper").show()
	$("#tblhead").show()

	// call sortable before render, otherwise, it renders very slowly
	sortable()

	$(document).contextmenu( function (event) {
		event.preventDefault();
	})

	// Prevent the backspace key from navigating back.
	$(document).off('keydown').on('keydown', function (event) {
		if (event.keyCode === 8) {
			var doPrevent = true;
			var types = ["text", "password", "file", "search", "email", "number",
						"date", "color", "datetime", "datetime-local", "month", "range",
						"search", "tel", "time", "url", "week"];
			var d = $(event.srcElement || event.target);
			var disabled = d.prop("readonly") || d.prop("disabled");
			if (!disabled) {
				if (d[0].isContentEditable) {
					doPrevent = false;
				} else if (d.is("input")) {
					var type = d.attr("type");
					if (type) {
						type = type.toLowerCase();
					}
					if (types.indexOf(type) > -1) {
						doPrevent = false;
					}
				} else if (d.is("textarea")) {
					doPrevent = false;
				}
			}
			if (doPrevent) {
				event.preventDefault();
				return false;
			}
		}
	});

	var $editcell = $("#editcell")
	$editcell.on("keydown", function (event) {
		resetTimer();
		gv.idleCounter = 0
		var keycode = event.which || window.event.keyCode
		var pointing = $editcell.data("pointing")
		if ($('#dialogService').is(':visible')) {
			Skeyin(event, keycode, pointing)
		} else {
			keyin(event, keycode, pointing)
		}
	})

	// for resizing the editing cell
	$editcell.on("keyup", function (event) {
		var keycode = event.which || window.event.keyCode

		$editcell.height($editcell[0].scrollHeight)
	})

	$editcell.on("click", function (event) {
		event.stopPropagation()
		return
	})

	// click on parent of submenu
	$('#menu li > div').on("click", function(event){
		if ($(this).siblings('ul').length > 0){
			event.preventDefault()
			event.stopPropagation()
		}
	});

	$("#wrapper").on("click", function (event) {
		resetTimer();
		gv.idleCounter = 0
		$(".bordergroove").removeClass("bordergroove")
		var target = event.target,
			$menu = $('#menu'),
			$stafflist = $('#stafflist')
		if ($menu.is(":visible")) {
			if (!$(target).closest('#menu').length) {
				$menu.hide();
				clearEditcell()
			}
		}
		if ($stafflist.is(":visible")) {
			if (!$(target).closest('#stafflist').length) {
				$stafflist.hide();
				clearEditcell()
			}
		}
		if (target.nodeName === "P") {
			target = $(target).closest('td')[0]
		}
		if (target.nodeName === "TD") {
			clicktable(event, target)
		} else {
			clearEditcell()
			$menu.hide()
			$stafflist.hide()
			clearMouseoverTR()
		}

		event.stopPropagation()
	})

	// to make table scrollable while dragging
	$("html, body").css( {
		height: "100%",
		overflow: "hidden",
		margin: "0px"
	})
}
		
function loading(response)
{
	if (/BOOK/.test(response)) {
		localStorage.setItem('ALLBOOK', response)
		updateBOOK(response)
		fillupstart();
		setStafflist()
		fillConsults()
	} else {
		response = localStorage.getItem('ALLBOOK')
		var error = "<br><br>Response from server has no data."
		if (/BOOK/.test(response)) {
			Alert("Server Error",
					error
					+ "<br><br>Use localStorage instead."
					+ "<br><br>Read Only. Not editable.");
			updateBOOK(response)
			fillupstart();
			setStafflist()
			fillConsults()
		} else {
			Alert("Server Error", error + "<br><br>No localStorage backup");
		}
	}
}

function updateBOOK(response)
{
	var temp = JSON.parse(response)

	if (temp.BOOK) { gv.BOOK = temp.BOOK }
	if (temp.CONSULT) { gv.CONSULT = temp.CONSULT }
	if (temp.SERVICE) { gv.SERVICE = temp.SERVICE }
	if (temp.STAFF) { gv.STAFF = temp.STAFF }
	if (temp.QTIME) { gv.timestamp = temp.QTIME }
	// datetime of last fetching from server: $mysqli->query ("SELECT now();")
}

// stafflist: menu of Staff column
// staffmenu: submenu of Date column
// gv.STAFF[each].staffname: fixed order
// gv.STAFF[each].staffoncall: no order according to substitution
// gv.STAFF[each].dateoncall: Saturday of the oncall week
function setStafflist()
{
	var stafflist = ''
	var staffmenu = ''

	for (var each = 0; each < gv.STAFF.length; each++)
	{
		stafflist += '<li><div>' + gv.STAFF[each].staffname + '</div></li>'
		staffmenu += '<li id="staffqueue"><div>' + gv.STAFF[each].staffname + '</div></li>'
	}
	staffmenu += '<li id="staffqueue"><div>Consults</div></li>'
	document.getElementById("stafflist").innerHTML = stafflist
	document.getElementById("staffmenu").innerHTML = staffmenu
}

// Only on main table
function fillConsults()
{
	var table = document.getElementById("tbl")
	var rows = table.rows
	var tlen = rows.length
	var slen = gv.STAFF.length
	var oncallRow = {}

	for (var q = 0; q < slen; q++) {
		oncallRow = findOncallRow(rows, tlen, gv.STAFF[q].dateoncall)
		if (oncallRow && !oncallRow.cells[QN].innerHTML) {
			oncallRow.cells[STAFFNAME].innerHTML = htmlwrap(gv.STAFF[q].staffoncall)
		}
	}
}

function findOncallRow(rows, tlen, dateoncall)
{
	
	var opdateth = dateoncall && dateoncall.thDate()

	for (var i = 1; i < tlen; i++) {
		if (rows[i].cells[OPDATE].innerHTML === opdateth) {
			return rows[i]
		}
	}
}

function htmlwrap(staffname)
{
	return '<p style="color:#999999;font-size:14px">' + staffname + '</p>'
}

function showStaffOnCall(opdate)
{
	var i = gv.STAFF.length

	while (i--) {
		if (gv.STAFF[i].dateoncall === opdate) {
			return htmlwrap(gv.STAFF[i].staffoncall)
		}
	}
}

function resetTimer()
{
	// gv.timer is just an id, not the clock
	// poke server every 10 sec.
	clearTimeout(gv.timer)
	gv.timer = setTimeout( updating, 10000)
}

function updating()
{
	// If there is some changes, reset idle time
	// If not, continue counting idle time
	// Both ways get update from server
	if (onChange()) {
		gv.idleCounter = 0
	} else {
		var sql = "sqlReturnData=SELECT MAX(editdatetime) as timestamp from bookhistory;"

		Ajax(MYSQLIPHP, sql, updatingback);

		function updatingback(response)
		{
			// idling (5+1)*10 = 1 minute, clear editing setup
			// editcell may be on first column, on staff, during changeDate
			if (gv.idleCounter === 5) {
				clearEditcell()
				$('#menu').hide()
				$('#stafflist').hide()
				clearMouseoverTR()
			}
			// idling (59+1)*10 = 10 minutes, logout
			else if (gv.idleCounter > 59) {
				window.location = window.location.href
				gv.idleCounter = 0
				// may not successfully access the url address
			}
			gv.idleCounter += 1

			// gv.timestamp is this client last edit
			// timestamp is from server
			if (/timestamp/.test(response)) {
				var timeserver = JSON.parse(response),
					timestamp = timeserver[0].timestamp
				if (gv.timestamp < timestamp) {
					getUpdate()
				}
			}
		}
	}

	resetTimer()
}

// There is some changes in database from other users
function getUpdate()
{
	var fromDate = $('#monthstart').val(),
		toDate = $('#monthpicker').val(),
		sql = "sqlReturnService=" + sqlOneMonth(fromDate, toDate)

	Ajax(MYSQLIPHP, sql, callbackGetUpdate);

	function callbackGetUpdate(response)
	{
		if (/BOOK/.test(response)) {
			updateBOOK(response)
			if ($("#dialogService").hasClass('ui-dialog-content')
				&& $("#dialogService").dialog('isOpen')) {
				gv.SERVE = calcSERVE()
				refillService(fromDate, toDate)
			}
			refillall()
			if (isSplited()) {
				refillstaffqueue()
			}
		} else {
			Alert ("getUpdate", response)
		}
	}
}

function onChange()
{
	// savePreviousCell is for Main and Staffqueue tables
	// When editcell is not seen, there must be no change
	if ($("#editcell").is(":visible")) {
		var whereisEditcell = $($("#editcell").data("pointing")).closest("table").attr("id")
		if (whereisEditcell === "servicetbl") {
			return savePreviousCellService()
		} else {
			return savePreviousCell()
		}
	}
	return false
}
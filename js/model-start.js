function loadtable(userid)
{
	Ajax(MYSQLIPHP, "nosqlReturnbook", loading);

	THISUSER = userid
	$("#login").remove()
	$("html").css("height", "100%")
	$("body").css("height", "100%")
	$("#wrapper").append($("#tblcontainer").show())
	$("#wrapper").append($("#queuecontainer"))

	$(document).click( function (event) {
		countReset();
		var clickedCell = event.target

		if ($(clickedCell).closest("table").attr("id") == "tbl")
			clicktable(clickedCell)
		else if ($(clickedCell).closest("table").attr("id") == "queuetbl")
			Qclicktable(clickedCell)
		return false
	})
	$(document).keydown( function (event) {
		countReset();
		var table = $("#editcell").data("located").closest("table").attr("id")
		if (table == "tbl")
			editing(event)
		else if (table == "queuetbl")
			editingqueue(event)
	})
	$(document).contextmenu( function (event) {
		countReset();
		return false
	})
	$("#tblcontainer").scroll( function (event) {
		countReset();
		if(typeof timeout == "number") {
			window.clearTimeout(timeout);
			delete timeout;
		}
		timeout = window.setTimeout( scrollUpDown, 50);
	})
	TIMER = setTimeout("updating()",10000)		//poke next 10 sec.
}

function loading(response)
{
	if (response && response.indexOf("[") != -1)
	{
		updateBOOK(response)
		fillupstart();
		fillStafflist()
	}
	else
		alert("Cannot load BOOK");
}

function updateBOOK(response)
{
	var temp = JSON.parse(response)

	BOOK = temp.BOOK? temp.BOOK : []
	TIMESTAMP = temp.QTIME? temp.QTIME : ""	//last update time of BOOK in server
	QWAIT = temp.QWAIT? temp.QWAIT : []
	STAFF = temp.STAFF? temp.STAFF : []
}

function fillStafflist()
{
	var stafflist = ''
	var staffqueue = ''
	for (var each=0; each<STAFF.length; each++)
	{
		stafflist += '<li><div>' + STAFF[each].name + '</div></li>'
		staffqueue += '<li><div id="item4">' + STAFF[each].name + '</div></li>'
	}
	$("#stafflist").html(stafflist)
	$("#item40").html(staffqueue)
}

function updating()
{
	if (document.getElementById("editmode") || document.getElementById("movemode"))
	{
		clearTimeout(TIMER);
		TIMER = setTimeout("updating()",10000);	//poke next 10 sec.
		return;
	}
	//poke database if not editmode, not movemode and not adding new case

	Ajax(MYSQLIPHP, "functionName=checkupdate&time="+TIMESTAMP, updatingback);

	function updatingback(response)	//only changed database by checkupdate&time
	{
		if (response && response.indexOf("opdate") != -1)	//there is new entry after TIMESTAMP
		{
			updateBOOK(response);
			filluprefill()
		}
		clearTimeout(TIMER);
		TIMER = setTimeout("updating()",10000);	//poke next 10 sec.
	}
}

function countReset()
{
	clearTimeout(TIMER);
	TIMER = setTimeout("updating()",10000);	//poke after 10 sec.
}

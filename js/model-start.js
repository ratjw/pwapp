function loadtable(userid)
{
	Ajax(MYSQLIPHP, "nosqlReturnbook", loading);

	THISUSER = userid
	document.body.removeChild(document.getElementById("login"))
	document.getElementById("tblcontainer").style.display = "block"

	$(document).click( function (event) {
		countReset();
		var clickedCell = event.target
		if($('#menu').is(":visible")) {	//visible == take up space even can't be seen
			if(!$(clickedCell).closest('#menu').length) {
				$('#menu').hide();
				$("#editcell").hide()
			}
		}
		if($('#stafflist').is(":visible")) {
			if(!$(clickedCell).closest('#stafflist').length) {
				$('#stafflist').hide();
				$("#editcell").hide()
			}
		}
		if (clickedCell.id == "editcell") {
			return
		}
		if($('#delete').is(":visible")) {
			if(!$(clickedCell).closest('#delete').length) {
				$('#delete').hide();
			}
		}
		if ($(clickedCell).closest('table').attr('id') == 'historytbl') {
			if ($(clickedCell).index()) {
				$('#undelete').hide()
				return false
			}
		}
		if  (clickedCell.nodeName != "TD") {
			$("#editcell").hide()
			return	
		}
		if ($(clickedCell).closest('table').attr('id') == 'tbl' ||
			$(clickedCell).closest('table').attr('id') == 'queuetbl' ||
			$(clickedCell).closest('table').attr('id') == 'servicetbl') {

			clicktable(clickedCell)
		}
	})
	$('#menu li > div').click(function(e){
		if($(this).siblings('ul').length > 0){
			e.preventDefault()
			e.stopPropagation()
		}
	});
	$(document).keydown( function (event) {
		countReset();
		if ($('#paperdiv').is(':visible') ||
			$('#datepicker').is(':visible')) {

			return false
		}
		keyin(event)
	})
	$(document).contextmenu( function (event) {
		return false
	})

	$("html, body").css( {
		height: "100%",		//to make table scrollable while dragging
		overflow: "hidden",
		margin: "0px"
	})
	sortable()
	//call sortable before render, if after, it renders very slow
	TIMER = setTimeout("updating()",10000);	//poke next 10 sec.
}

function loading(response)
{
	if (response && response.indexOf("[") != -1)
	{
		updateBOOK(response)
		fillupstart();
		dataStafflist()
	}
	else
		alert("Cannot load BOOK");
}

function updateBOOK(response)
{
	var temp = JSON.parse(response)

	BOOK = temp.BOOK? temp.BOOK : []
	TIMESTAMP = temp.QTIME? temp.QTIME : ""	//last update BOOK in server
	QWAIT = temp.QWAIT? temp.QWAIT : []
	STAFF = temp.STAFF? temp.STAFF : []
}

function dataStafflist()
{
	var stafflist = ''
	var staffmenu = ''
	for (var each=0; each<STAFF.length; each++)
	{
		stafflist += '<li><div>' + STAFF[each].name + '</div></li>'
		staffmenu += '<li><div id="item1">' + STAFF[each].name + '</div></li>'
	}
	document.getElementById("stafflist").innerHTML = stafflist
	document.getElementById("item0").innerHTML = staffmenu
}

function updating()
{
	Ajax(MYSQLIPHP, "functionName=checkupdate&time="+TIMESTAMP, updatingback);

	function updatingback(response)	//only changed database by checkupdate&time
	{
		if (response && response.indexOf("opdate") != -1)
		{								//there is new entry after TIMESTAMP
			updateBOOK(response)
		}
		clearTimeout(TIMER);
		TIMER = setTimeout("updating()",10000);	//poke next 10 sec.
		refillall()
		if ($("#titlecontainer").css('display') == 'block')
			refillstaffqueue()
	}
}

function countReset()
{
	clearTimeout(TIMER);
	TIMER = setTimeout("updating()",10000);	//poke after 10 sec.
}

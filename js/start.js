function loadtable(userid)
{
	Ajax(MYSQLIPHP, "nosqlReturnbook", loading);

	THISUSER = userid
	$("#login").remove()
	$("#tblwrapper").show()
	$("#dialogOplog").dialog()
	$("#dialogOplog").dialog('close')
	$("#dialogDeleted").dialog()
	$("#dialogDeleted").dialog('close')
	$("#dialogFind").dialog()
	$("#dialogFind").dialog('close')
	$("#dialogEquip").dialog()
	$("#dialogEquip").dialog('close')
	$("#dialogService").dialog()
	$("#dialogService").dialog('close')	//prevent updateTables() call 'isOpen' before initialization
	$("#dialogAlert").dialog()
	$("#dialogAlert").dialog('close')
	clearEditcellData()

	if (THISUSER == "000000") {
		$(document).click( function (event) {
			event.stopPropagation()
			var target = event.target
			var rowi = $(target).closest('tr')
			var qn = rowi.children('td').eq(QN).html()
			if ((target.nodeName != "TD") || (!qn)) {
				event.preventDefault()
				event.stopPropagation()
				return false
			}
			fillEquipTable(BOOK, rowi[0], qn)
			showNonEditableEquipForScrub()
		})
		$(document).keydown(function(e) {
			e.preventDefault();
		})
		return
	}

	$(document).click( function (event) {
		countReset();
		updating.timer = 0
		event.stopPropagation()
		var target = event.target
		if ($('#menu').is(":visible")) {//not visible == take up space even can't be seen
			if (!$(target).closest('#menu').length) {
				$('#menu').hide();
				clearEditcellData()
			}
		}
		if ($('#stafflist').is(":visible")) {
			if (!$(target).closest('#stafflist').length) {
				$('#stafflist').hide();
				clearEditcellData()
			}
		}
		if ($('#delete').is(":visible")) {
			if(!$(target).closest('#delete').length) {
				$('#delete').hide();
			}
		}
		if ($('#undelete').is(":visible")) {
			if ($(target).index()) {
				$('#undelete').hide()
				return false
			}
		}
		if (target.id == "editcell") {
			return
		}
		
		if (target.nodeName == "TH") {
			clearEditcellData()
			return	
		}

		if ($(target).closest('table').attr('id') == 'tbl' ||
			$(target).closest('table').attr('id') == 'queuetbl') {

			clicktable(target)
		}
		else if ($(target).closest('table').attr('id') == 'servicetbl') {
			clickservice(target)
		}
	})
	$('#menu li > div').click(function(event){		//click on parent of submenu
		if ($(this).siblings('ul').length > 0){
			event.preventDefault()
			event.stopPropagation()
		}
	});
	$(document).keydown( function (event) {
		countReset();
		updating.timer = 0
		if ($('#monthpicker').is(':focus')) {
			return
		}
		if ($('#dialogEquip').is(':visible')) {
			return
		}
		var keycode = event.which || window.event.keyCode
		var pointing = $("#editcell").data("pointing")
		if ($('#dialogService').is(':visible')) {
			Skeyin(event, keycode, pointing)
		} else {
			keyin(event, keycode, pointing)
		}
	})
	$(document).keyup( function (event) {
		var $editcell = $("#editcell")
		var pointing = $editcell.data("pointing")
		if (pointing.cellIndex < 2) {
			return		//not render in opdate & roomtime cells
		}
		var keycode = event.which || window.event.keyCode
		if (keycode < 32)	{
			return		//not render after non-char was pressed
		}
		pointing.innerHTML = $editcell.html()
		$editcell.css({
			height: $(pointing).height() + "px",
		})
		reposition($editcell, "center", "center", pointing)
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
	//call sortable before render, if after, it renders very slowly
	TIMER = setTimeout("updating()",10000);	//poke server every 10 sec.
	updating.timer = 0
}

function loading(response)
{
	if (response && response.indexOf("[") != -1) {
		localStorage.setItem('ALLBOOK', response)
		updateBOOK(response)
		if (THISUSER == "000000") {
			fillForScrub()
		} else {
			fillupstart();
			fillStafflist()
		}
	} else {
		response = localStorage.getItem('ALLBOOK')
		var error = "<br><br> Response from server has no data <br><br> Using localStorage Backup"
		if (response) {
			alert("Server Error", error);
			updateBOOK(response)
			fillupstart();
			fillStafflist()
		} else {
			alert("Server Error", error);
		}
	}
}

function updateBOOK(response)
{
	var temp = JSON.parse(response)

	BOOK = temp.BOOK? temp.BOOK : []
	CONSULT = temp.CONSULT? temp.CONSULT : []
	TIMESTAMP = temp.QTIME? temp.QTIME : ""	//datetime of last change in server
}

function fillStafflist()
{
	var stafflist = ''
	var staffmenu = ''
	for (var each = 0; each < STAFF.length; each++)
	{
		stafflist += '<li><div>' + STAFF[each] + '</div></li>'
		staffmenu += '<li id="item88"><div>' + STAFF[each] + '</div></li>'
	}
	staffmenu += '<li id="item88"><div>Consults</div></li>'
	document.getElementById("stafflist").innerHTML = stafflist
	document.getElementById("item0").innerHTML = staffmenu
}

function updating()	//updating.timer : local variable
{
	var oldcontent = $("#editcell").data("oldcontent")
	var newcontent = getEditcellHtml()
	var editPoint = $("#editcell").data("pointing")
	if (editPoint && (oldcontent != newcontent)) {

		//making some change
		if ($(editPoint).closest("table").attr("id") == "servicetbl") {
			saveEditPointDataService(editPoint)		//Service table
		} else {
			saveEditPointData(editPoint)		//Main and Staffqueue tables
		}
		updating.timer = 0
	} else {
		//idling
		Ajax(MYSQLIPHP, "functionName=checkupdate&time="+TIMESTAMP, updatingback);

		function updatingback(response)
		{
			//not being editing on screen
			if (updating.timer == 10) {
				//delay 100 seconds and
				//do this only once even if idle for a long time
				clearEditcellData()
				$('#menu').hide()		//editcell may be on first column
				$('#stafflist').hide()	//editcell may be on staff
				$('#datepicker').hide()
				$('#datepicker').datepicker("hide")
			}
			else if (updating.timer > 360) {
				window.location = window.location.href		//logout after 1 hr
			}
			updating.timer++

			//some changes in database from other users
			if (response && response.indexOf("opdate") != -1)
			{
				updateBOOK(response)
				updateTables()
			}
		}
	}

	countReset()
}

function updateTables()
{
	if ($("#dialogService").dialog('isOpen')) {
		var fromDate = $('#monthpicker').data('fromDate')
		var toDate = $('#monthpicker').data('toDate')
		var SERVICE = getfromBOOKCONSULT(fromDate, toDate)
		refillService(SERVICE, fromDate, toDate)
	}
	refillall(BOOK)
	if ($("#queuewrapper").css('display') == 'block') {
		refillstaffqueue()
	}
}

function countReset()
{
	clearTimeout(TIMER);
	TIMER = setTimeout("updating()",10000);	//poke server every 10 sec.
}

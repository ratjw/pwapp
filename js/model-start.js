function loadtable(userid)
{
	Ajax(MYSQLIPHP, "nosqlReturnbook", loading);

	THISUSER = userid
	$("#login").remove()
	$("#tblcontainer").show()
	$("#wrapper").append($("#tblcontainer"))
	$("#wrapper").append($("#queuecontainer"))

	$(document).click( function (event) {
		countReset();
		var clickedCell = event.target
		if (clickedCell) {
			if ($(clickedCell).closest("table").attr("id") == "tbl")
				clicktable(clickedCell)
			else if ($(clickedCell).closest("table").attr("id") == "queuetbl")
				Qclicktable(clickedCell)
		}
	})
	$(document).keydown( function (event) {
		countReset();
		if ($('#paperdiv').css('display') == 'block') {
			return
		}
		var tableID = $("#editcell").data('tableID')
		if (tableID == "tbl")
			editing(event)
		else if (tableID == "queuetbl")
			editingqueue(event)
	})
	$(document).contextmenu( function (event) {
		countReset();
		return false
	})

	TIMER = setTimeout("updating()",10000)		//poke next 10 sec.
/*
	// create dialogs
	$(".dialog").dialog({
		autoOpen: false,
		closeOnEscape: true,
		buttons: {
			"Close": function () {
				$(id).dialog('close');
			}
		}
	});

	$("#historytable").dialog({
		title: rowmain.cells[HN].innerHTML +' '+ rowmain.cells[NAME].innerHTML,
		height: window.innerHeight * 50 / 100,
		width: window.innerWidth * 50 / 100,
	});

	// hook up the click event
	$(".link").bind("click", function () {
		// console.log($(this).parent());
		// open the dialog
		var dialogId = $(this).attr("data-open");
		$("#" + dialogId).dialog("open");

		return false;
	});
*/
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
	TIMESTAMP = temp.QTIME? temp.QTIME : ""	//last update time of BOOK in server
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
	$("#stafflist").html(stafflist)
	$("#item0").html(staffmenu)
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
		if (response && response.indexOf("opdate") != -1)
		{								//there is new entry after TIMESTAMP
			updateBOOK(response)
			refillall()
			DragDrop()
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

function editcell(pointing)
{
	var pos = $(pointing).position()
	var tableID = $(pointing).closest('table').attr('id')
	var rowIndex = $(pointing).closest('tr').index()
	var cellIndex = $(pointing).index()

	$("#editcell").data("location", "#"+ tableID +" tr:eq("+ rowIndex +") td:eq("+ cellIndex +")")
	$("#editcell").data("tableRow", "#"+ tableID +" tr:eq("+ rowIndex +")")
	$("#editcell").data("tableID", tableID)
	$("#editcell").data("rowIndex", rowIndex)
	$("#editcell").data("cellIndex", cellIndex)
	$("#editcell").html(pointing.innerHTML)
	$("#editcell").css({
		top: pos.top + "px",
		left: pos.left + "px",
		height: $(pointing).height() + "px",
		width: $(pointing).width() + "px",
		fontSize: $(pointing).css("fontSize"),
		display: "block"
	})
	$("#editcell").focus()
}

function SplitPane()
{
	var tohead
	var topscroll = $(this).scrollTop()	//this = window

	$.each($('#tbl tr:has(th)'), function() {	//this = each item
		tohead = this
		return ($(this).offset().top < topscroll)
	})

	$("html, body").css( {
		height: "100%",
		overflow: "hidden",
		margin: "0"
	})
	$("#queuecontainer").show()
	$("#tblcontainer").css("width", "60%")
	$("#queuecontainer").css("width", "40%")
	initResize("#tblcontainer")
	$('.ui-resizable-e').css('height', $("#tbl").css("height"))

	$('#tblcontainer').animate({
		scrollTop: $(tohead).offset().top
	}, 300);
	DragDrop()
}

function closequeue()
{
	var tohead
	var topscroll = $(this).scrollTop()

	$.each($('#tbl tr:has(th)'), function() {
		tohead = this
		return ($(this).offset().top < topscroll)
	})
	
	$("html, body").css( {
		height: "",
		overflow: "",
		margin: ""
	})
	$("#tblcontainer").css("width", "100%")
	$("#queuecontainer").css("width", "0%")
	$("#queuecontainer").hide()
	$("#tblcontainer").resizable('destroy');

	$('html body').animate({
		scrollTop: $(tohead).offset().top
	}, 300);
	DragDrop()
}

function initResize(id)
{
	$(id).resizable(
	{
		autoHide: true,
		handles: 'e',
		resize: function(e, ui) 
		{
			var parent = ui.element.parent();
			var remainSpace = parent.width() - ui.element.outerWidth()
			var divTwo = ui.element.next()
			var margin = divTwo.outerWidth() - divTwo.innerWidth()
			var divTwoWidth = (remainSpace-margin)/parent.width()*100+"%";
			divTwo.css("width", divTwoWidth);
		},
		stop: function(e, ui) 
		{
			var parent = ui.element.parent();
			var remainSpace = parent.width() - ui.element.outerWidth()
			var divTwo = ui.element.next()
			ui.element.css(
			{
				width: ui.element.outerWidth()/parent.width()*100+"%",
			});
			ui.element.next().css(
			{
				width: remainSpace/parent.width()*100+"%",
			});
		}
	});
}

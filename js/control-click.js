function clicktable(event)
{
	clickedCell = event.target || window.event.srcElement
	if (clickedCell.id == "editcell")
		return false

	$("#tbl").siblings().hide()
	if ($( "#container" ).dialog("instance"))
		$( "#container" ).dialog( "close" )

	if (clickedCell.nodeName != "TD")
	{
		if ($("#editcell").get(0))
			$("#editcell").attr("id","")
		return
	}

	savePreviouscell()
	storePresentcell(clickedCell)
	event.preventDefault()
	clickedCell.focus()
}

function editing(event)
{
	var keycode = event.which || window.event.keyCode
	var thatcell = $("#editcell").get(0)
	var thiscell

	if ($("#editcell").closest("table").attr("id") != "tbl")
		return

	if (keycode == 9)
	{
		savePreviouscell()
		if (event.shiftKey)
			thiscell = findPrevcell()
		else
			thiscell = findNextcell()
		storePresentcell(thiscell)
		if (thiscell)
			thiscell.focus()
		else
		{
			thatcell.id = "editcell"
			thatcell.focus()
		}
		event.preventDefault()
	}
	else if (keycode == 13)
	{
		if (event.shiftKey || event.ctrlKey)
			return false
		event.preventDefault()
		savePreviouscell()
		thiscell = findNextcell()
		storePresentcell(thiscell)
		if (thiscell)
			thiscell.focus()
		else
		{
			thatcell.id = "editcell"
			thatcell.focus()
		}
		event.preventDefault()
	}
	else if (keycode == 27)
	{
		if ($("#editcell").index() == OPDATE)
		{
			$("editcell").attr("id","")
			$("#tbl").siblings().hide()
		}
		else
		{
			$("#editcell").html($("#editcell").attr("title"))
		}
		event.preventDefault()
		window.focus()
	}
}

function savePreviouscell() 
{
	if (!$("#editcell").get(0))
		return

	if ($("#editcell").closest("table").attr("id") != "tbl")
		return

	var content = $("#editcell").html()

	if (content == $("#editcell").attr("title"))
		return

	var editcindex = $("#editcell").closest("td").index()

	switch(editcindex)
	{
		case OPDATE:
			break
		case STAFFNAME:
			saveContent("staffname", content)
			break
		case HN:
			saveHNinput("hn", content)
			break
		case NAME:
		case AGE:
			break
		case DIAGNOSIS:
			saveContent("diagnosis", content)
			break
		case TREATMENT:
			saveContent("treatment", content)
			break
		case TEL:
			saveContent("tel", content)
			break
	}
}

function saveContent(column, content)
{
	var rowtr = $("#editcell").closest("tr").children("td")
	var opdate = rowtr.eq(OPDATE).html().numDate()
	var qn = rowtr.eq(QN).html()

	$("#tbl").css("cursor", "wait")
	content = URIcomponent(content)			//take care of white space, double qoute, 
											//single qoute, and back slash
	if (qn)
	{
		var sqlstring = "sqlReturnbook=UPDATE book SET "
		sqlstring += column +" = '"+ content
		sqlstring += "', editor='"+ THISUSER
		sqlstring += "' WHERE qn = "+ qn +";"
	}
	else
	{
		var sqlstring = "sqlReturnbook=INSERT INTO book ("
		sqlstring += "opdate, "+ column +", editor) VALUES ('"
		sqlstring += opdate +"', '"+ content +"', '"+ THISUSER +"');"
	}

	Ajax(MYSQLIPHP, sqlstring, callbacksaveContent);

	function callbacksaveContent(response)
	{
		if (!response || response.indexOf("DBfailed") != -1)
		{
			alert("Failed! update database \n\n" + response)
			$("#editcell").attr("title")
		}
		else
		{
			updateBOOK(response);
			updateBOOKFILL()
			fillselect("tbl", opdate)
		}
		$("#tbl").css("cursor", "")
	}
}

function saveHNinput(hn, content)
{
	var rowtr = $("#editcell").closest("tr").children("td")
	var opdate = rowtr.eq(OPDATE).html().numDate()
	var patient = rowtr.eq(NAME).html()
	var qn = rowtr.eq(QN).html()

	if (patient)
	{
		$("#editcell").html($("#editcell").attr("title"))
		return
	}
	content = URIcomponent(content)

	var sqlstring = "hn=" + content
	sqlstring += "&opdate="+ opdate
	sqlstring += "&qn="+ qn
	sqlstring += "&username="+ THISUSER


	Ajax(GETNAMEHN, sqlstring, callbackgetByHN)

	function callbackgetByHN(response)
	{
		if (!response || response.indexOf("patient") == -1)	//no patient
			alert("Error getnamehn : "+ response)
		else if (response.indexOf("DBfailed") != -1)
			alert("Failed! book($mysqli)" + response)
		else if (response.indexOf("{") != -1)
		{	//Only one patient
			updateBOOK(response)
//			updateBOOKFILL()
			fillselect("tbl", opdate)
		}
	}
}

function storePresentcell(pointing)
{  
	var cindex = $(pointing).closest("td").index()
	var rowtr = $(pointing).closest("tr")
	var rindex = $(rowtr).index()
	var qn = $(rowtr).children("td").eq(QN).html()

	$("#editcell").attr("id","")
	pointing.id = "editcell"
	$("#tbl").siblings().hide()

	switch(cindex)
	{
		case OPDATE:
			fillSetTable(rindex, pointing)
			break
		case STAFFNAME:
			stafflist(pointing)
			break
		case NAME:
		case AGE:
			$("#editcell").attr("id","") //disable any editcell
			break
		case HN:
		case DIAGNOSIS:
		case TREATMENT:
		case TEL:	//store value in attribute "title" of editcell
			$("#editcell").attr("title", pointing.innerHTML)
			break
	}
}

function fillSetTable(rownum, pointing)
{
	var table = document.getElementById("tbl")
	var rowmain = table.rows[rownum]
	var tcell = table.rows[rownum].cells
	var opdateth = tcell[OPDATE].innerHTML	//Thai date
	var opdate = opdateth.numDate()		//Thai to mysql date
	var staffname = tcell[STAFFNAME].innerHTML
	var casename = tcell[NAME].innerHTML
	var opday = table.rows[rownum].className
	var hn = tcell[HN].innerHTML
	var qn = tcell[QN].innerHTML
	var disabled = "ui-state-disabled"

	var i = 0
	while (opday.indexOf(NAMEOFDAYFULL[i]) == -1)
		i++
	opday = NAMEOFDAYTHAI[i]

	casename = casename.substring(0, casename.indexOf(' '))
	$("#item1").html("เพิ่ม case วันที่ " + opdateth)
	if (qn)
		$("#item1").removeClass(disabled)
	else
		$("#item1").addClass(disabled)
	$("#item2").html("ลบ case " + casename)
	if (qn)
		$("#item2").removeClass(disabled)
	else
		$("#item2").addClass(disabled)
	$("#item3").html("Delete Blank Row")
	if (checkblank(opdate, qn))
		$("#item3").removeClass(disabled)
	else
		$("#item3").addClass(disabled)
	$("#item4").html("คิวรออาจารย์")
	$("#item5").html("คิวเฉพาะวัน")
	$("#item6").html("การแก้ไขของ " + casename)
	if (qn)
		$("#item6").removeClass(disabled)
	else
		$("#item6").addClass(disabled)
	$("#item7").html("รายชื่อที่ถูกลบ")

	$("#menu").menu({
		select: function( event, ui ) {
			var item = this.getAttribute("aria-activedescendant")
			switch(item)
			{
				case "item1":
					addnewrow(rowmain)
					break
				case "item2":
					deletecase(rowmain, qn)
					break
				case "item3":
					deleteblankrow(rowmain)
				case "item4":
					break
				case "item51":
				case "item52":
				case "item53":
				case "item54":
				case "item55":
				case "item56":
				case "item57":
					fillday($('#'+item).html())
					break
				case "item6":
					edithistory(rowmain, qn)
					break
				case "item7":
					deletehistory(rowmain, qn)
					break
				default :
					staffqueue(item)
			}
			event.stopPropagation()
			event.preventDefault()
			$("#editcell").attr("id","")
			$("#menu").hide()
			$( "#item4" ).removeClass( "ui-state-active" )
			$( "#item4" ).prepend('<span class="ui-menu-icon ui-icon  ui-icon-caret-1-e"></span>')
			$( "#item40" ).hide()
			$( "#item40" ).attr("aria-hidden", "true")
			$( "#item40" ).attr("aria-expanded", "false")
		}
	});

	showup(pointing, '#menu')
}

function stafflist(pointing)
{
	showup(pointing, '#stafflist')

	$("#stafflist").menu({
		select: function( event, ui ) {
			$(pointing).html($(this).attr("aria-activedescendant"));
			$('#stafflist').hide();
		}
	});
}

function showup(pointing, menuID)
{
	var pos = $(pointing).position();
	var height = pos.top + $(pointing).outerHeight();
	var width = pos.left + $(pointing).outerWidth();

	$(menuID).css("box-shadow", "10px 20px 30px slategray")
	if ((height + $(menuID).outerHeight()) > $(window).innerHeight() + document.body.scrollTop)
	{
		height = pos.top - $(menuID).innerHeight()
		$(menuID).css("box-shadow", "10px -10px 30px slategray")
	}
	$(menuID).css({
		position: "absolute",
		top: height + "px",
		left: width + "px",
		display: "block"
	})
}

function showupQueue(pointing, menuID)
{
	var pos = $(pointing).position();
	var height = pos.top + $(pointing).outerHeight()
	var width = pos.left  + $(pointing).outerWidth();

	$(menuID).css("box-shadow", "10px 20px 30px slategray")
	$(menuID).css({
		position: "absolute",
		top: height + "px",
		left: width + "px",
		zIndex: 1000,
		modal:true,
		display: "block"
	})
}

function findPrevcell() 
{
	var prevcell = $("#editcell")

	do {
		if ($(prevcell).index() > 1)
		{
			prevcell = $(prevcell).prev()
		}
		else
		{
			if ($(prevcell).parent().index() > 1)
			{	//go to prev row last editable
				do {
					prevcell = $(prevcell).parent().prev("tr").children().eq(TEL)
				}
				while ($(prevcell).get(0).nodeName == "TH")	//THEAD row
			}
			else
			{	//#tbl tr:1 td:1
				event.preventDefault()
				return false
			}
		}
	} while (!$(prevcell).get(0).isContentEditable)

	return $(prevcell).get(0)
}

function findNextcell() 
{
	var nextcell = $("#editcell")
	var lastrow = $('#tbl tr:last-child').index()
	
	do {
		if ($(nextcell).index() < TEL)
		{
			nextcell = $(nextcell).next()
		}
		else
		{
			if ($(nextcell).parent().index() < lastrow)
			{	//go to next row first editable
				do {
					nextcell = $(nextcell).parent().next("tr").children().eq(STAFFNAME)
				}
				while ($(nextcell).get(0).nodeName == "TH")	//THEAD row
			}
			else
			{	//#tbl tr:last-child td:last-child
				event.preventDefault()
				return false
			}
		}
	} while (!$(nextcell).get(0).isContentEditable)

	return $(nextcell).get(0)
}

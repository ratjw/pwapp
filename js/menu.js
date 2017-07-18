
function fillSetTable(pointing)
{
	var tableID = $(pointing).closest('table').attr('id')
	var rowmain = $(pointing).closest('tr')[0]
	var tcell = rowmain.cells
	var opdateth = tcell[OPDATE].innerHTML
	var opdate = getOpdate(opdateth)		//Thai to ISO date
	var staffname = tcell[STAFFNAME].innerHTML
	var hn = tcell[HN].innerHTML
	var qn = tcell[QN].innerHTML
	var book = BOOK
	if ((tableID == "queuetbl") && ($('#titlename').html() == "Consults")) {
		book = CONSULT
	}

	disable(qn, "#item1")

	var item2 = (tableID == "queuetbl")? true : false
	disable(item2, "#item2")

	disable(qn, "#item3")

	disable(qn, "#item4")

	disable(qn, "#item5")

	disable(qn, "#item6")

	disable(hn, "#item7")

	var unuse = (checkblank(book, opdate, qn))? true : false
	var item8 = (qn || unuse)? true : false
	disable(item8, "#item8")

	var $menu = $("#menu")
	$menu.menu({
		select: function( event, ui ) {

			var item = $(ui.item).attr("id")

			switch(item)
			{
				case "item1":
					addnewrow(tableID, rowmain, qn)
					break
				case "item2":
					noOpdate()
					break
				case "item3":
					changeDate(tableID, opdate, staffname, qn, pointing)
					break
				case "item4":
					fillRoomTime(book, tableID, opdateth, qn)
					break
				case "item5":
					fillEquipTable(book, qn)
					break
				case "item6":
					editHistory(rowmain, qn)
					break
				case "item7":
					PACS(hn)
					break
				case "item8":
					if (unuse) {	//from add new row (check case in this opdate)
						$(rowmain).remove()			//delete blank row
						var caseNum = findBOOKrow(book, "")
						book.splice(caseNum, 1)
					} else {
						deleteCase(rowmain, opdate, qn)
					}
					break
				case "item99":
					staffqueue(ui.item.text())
					if ($("#queuewrapper").css("display") != "block")
						splitPane()
					break
				case "item10":
					serviceReview()
					break
				case "item11":
					deleteHistory()
					break
				case "item12":
					find()
					break
				case "item13":
					readme()
					break
			}

			clearEditcellData()
			$menu.hide()		//to disappear after selection
			event.stopPropagation()
		}
	});

	var width = $menu.outerWidth()

	$menu.appendTo($(pointing).closest('div'))
	reposition($menu, "left top", "left bottom", pointing)
	menustyle($menu, pointing, width)
}


function disable(item, id)
{
	var disabled = "ui-state-disabled"
	if (item) {
		$(id).removeClass(disabled)
	} else {
		$(id).addClass(disabled)
	}
}

function stafflist(pointing)
{
	var $stafflist = $("#stafflist")
	$stafflist.menu({
		select: function( event, ui ) {
			var staffname = ui.item.text()
			$(pointing).html(staffname)
			saveContent(pointing, "staffname", staffname)
			clearEditcellData()
			$stafflist.hide()		//to disappear after selection
			event.stopPropagation()
		}
	});

	var width = $stafflist.outerWidth()

	$stafflist.appendTo($(pointing).closest('div'))
	reposition($stafflist, "left top", "left bottom", pointing)
	menustyle($stafflist, pointing, width)
	reposition($stafflist, "left top", "left bottom", pointing)
}

function menustyle($me, target, width)
{
	if ($me.position().top > $(target).position().top) {
		var shadow = '10px 20px 30px slategray'
	} else {
		var shadow = '10px -20px 30px slategray'
	}

	$me.css({
		width: width,
		boxShadow: shadow
	})
}

function checkblank(book, opdate, qn)
{	//Is this a blank row?
	//If blank, is there a case(s) in this date? 
	var q = 0

	if (qn) {
		return false	//No, this is not a blank row
	}
	//the following is a blank row
	while (opdate > book[q].opdate)	//find this opdate in book
	{
		q++
		if (q >= book.length) {			//not found
			return false	//beyond book, do not delete blank row
		}
	}
	if (opdate == book[q].opdate) {	//found
		return true	//there is a case(s) in this opdate, can delete blank row
	} else {
		return false	//No case in this opdate, do not delete blank row
	}
}

function addnewrow(tableID, rowmain, qn)
{
	var book = BOOK
	if ((tableID == "queuetbl") && ($('#titlename').html() == "Consults")) {
		book = CONSULT
	}
	var caseNum = findBOOKrow(book, qn)
	var bookq = JSON.parse(JSON.stringify(book[caseNum]))	//???
	$.each( bookq, function(key, val) {
		bookq[key] = ""
	})
	bookq.opdate = book[caseNum].opdate
	book.splice(caseNum + 1, 0, bookq)
	
	$(rowmain).clone()
		.insertAfter($(rowmain))
			.find("td").eq(OPDATE)
				.siblings()
					.html("")

	if (tableID == "queuetbl") {
		//change pointing to STAFFNAME
		var staffname = $('#titlename').html()
		var pointing = $(rowmain).next().children("td")[STAFFNAME]
		saveContent(pointing, "staffname", staffname)
	}
}

function noOpdate()
{
	//must use jQuery in order to be recognized
	$("#queuetbl tr:last").clone()
							.appendTo($("#queuetbl tbody"))
								.children("td").html("")

	//change pointing to STAFFNAME
	var staffname = $('#titlename').html()
	var pointing = $("#queuetbl tr:last td")[STAFFNAME]
	var $addedRow = $("#queuetbl tr:last")
	saveContent(pointing, "staffname", staffname)
	addColor($addedRow, LARGESTDATE)
	$addedRow.children("td")[OPDATE].className = NAMEOFDAYABBR[(new Date(LARGESTDATE)).getDay()]

	var $queuecontainer = $("#queuecontainer")
	var queue = $("#queuetbl").height()
	var container = $queuecontainer.height()
	var scrolltop = $queuecontainer.scrollTop()
	var toscroll = queue - container + scrolltop
	$queuecontainer.animate({
		scrollTop: toscroll + 300
	}, 500);
}

function changeDate(tableID, opdate, staffname, qn, pointing)
{
	var $datepicker = $('#datepickertbl')
	if (tableID == "queuetbl") {
		$datepicker = $('#datepickerqueuetbl')
	}
	$datepicker.css({
		height: $(pointing).height(),
		width: $(pointing).width()
	})
	reposition($datepicker, "center", "center", pointing)

	$datepicker.datepicker( {
		dateFormat: "yy-mm-dd",
		minDate: "-1y",
		maxDate: "+1y",
		onClose: function () {
			$('.ui-datepicker').css("fontSize", '')
			$datepicker.hide()
			if (opdate == $datepicker.val()) {
				return
			}
			opdate = $datepicker.val()
			var sql = "sqlReturnbook=UPDATE book SET opdate='" + opdate + "', "
			sql += "editor = '" + THISUSER + "' WHERE qn="+ qn + ";"

			Ajax(MYSQLIPHP, sql, callbackchangeDate)

			function callbackchangeDate(response)
			{
				if (!response || response.indexOf("DBfailed") != -1) {
					alert ("changeDate", response)
				} else {
					updateBOOK(response);
					refillall(BOOK)
					if (($("#queuewrapper").css('display') == 'block') && 
						($('#titlename').html() == staffname)) {
						//changeDate of this staffname's case
						refillstaffqueue()
					}
					scrolltoThisCase(qn)
				}
			}
		}
	})
	$datepicker.datepicker("setDate", new Date(opdate))
	$datepicker.datepicker( 'show' )
	var $uidatepicker = $('.ui-datepicker')
	$uidatepicker.css("fontSize", "12px")
	reposition($uidatepicker, "left top", "left bottom", pointing)
}

function fillRoomTime(book, tableID, opdateth, qn)
{
	var caseNum = findBOOKrow(book, qn)
	var oproom = book[caseNum].oproom
	var optime = book[caseNum].optime
	document.getElementById("orroom").value = oproom? oproom : "4"
	document.getElementById("ortime").value = optime? optime : "09.00"
	$("#roomtime").show()
	$("#roomtime").dialog({
		title: opdateth,
		closeOnEscape: true,
		modal: true,
		buttons: {
			'OK': function () {
				oproom = document.getElementById("orroom").value
				optime = document.getElementById("ortime").value
				var sql = "sqlReturnbook=UPDATE book SET "
				sql += "oproom = '" + oproom + "', "
				sql += "optime = '" + optime + "', "
				sql += "editor = '" + THISUSER + "' WHERE qn="+ qn + ";"

				Ajax(MYSQLIPHP, sql, callbackfillRoomTime)

				$(this).dialog('close')

				function callbackfillRoomTime(response)
				{
					if (!response || response.indexOf("DBfailed") != -1) {
						alert ("fillRoomTime", response)
					} else {
						updateBOOK(response);
						if ($("#queuewrapper").css('display') == 'block') {
							refillstaffqueue()
						}
						refillall(BOOK)
					}
				}
			}
		}
	})

	$( "#orroom" ).spinner({
		min: 1,
		max: 11,
		step: 1
	});

	var time
	$( "#ortime" ).spinner({
		min: 00,
		max: 24,
		step: 0.5,
		spin: function( event, ui ) {
			var val = []
			if (ui.value % 1 == 0) {
				val[0] = String(ui.value)
				val[1] = "00"
			} else {
				val[0] = String(ui.value - 0.5)
				val[1] = "30"
			}
			if (val[0].length == 1) {
				val[0] = "0" + val[0]
			}
			time = val.join(".")
		},
		stop: function( event, ui ) {
			$( "#ortime" ).val(time)
		}
	})
}

function deleteCase(rowmain, opdate, qn)
{
	//not actually delete the case but set waitnum=NULL
	var sql = "sqlReturnbook=UPDATE book SET waitnum=NULL, "
	sql += "editor = '" + THISUSER + "' WHERE qn="+ qn + ";"

	Ajax(MYSQLIPHP, sql, callbackdeleterow)

	function callbackdeleterow(response)
	{
		if (!response || response.indexOf("DBfailed") != -1) {
			alert ("deleteCase", response)
		} else {
			updateBOOK(response);
			deleteRow(rowmain, opdate)
		}
	}
}

function deleteRow(rowmain, opdate)
{
	var prevDate = $(rowmain).prev().children("td").eq(OPDATE).html()
	var nextDate = $(rowmain).next().children("td").eq(OPDATE).html()

	prevDate = getOpdate(prevDate)
	nextDate = getOpdate(nextDate)

	if ((prevDate == opdate)
	|| (nextDate == opdate)
	|| $(rowmain).closest("tr").is(":last-child")) {
		$(rowmain).remove()
	} else {
		$(rowmain).children("td").eq(OPDATE).siblings().html("")
	}
}

function splitPane()
{
	var scrolledTop = document.getElementById("tblcontainer").scrollTop
	var tohead = findVisibleHead('#tbl')
	var width = screen.availWidth
	var height = screen.availHeight

	$("#queuewrapper").show()
	$("#tblwrapper").css({"float":"left", "height":"100%", "width":"50%"})
	$("#queuewrapper").css({"float":"right", "height":"100%", "width":"50%"})
	initResize("#tblwrapper")
	$('.ui-resizable-e').css('height', $("#tbl").css("height"))

	fakeScrollAnimate("tblcontainer", "tbl", scrolledTop, tohead)
}

function closequeue()
{
	var scrolledTop = document.getElementById("tblcontainer").scrollTop
	var tohead = findVisibleHead('#tbl')
	
	$("#queuewrapper").hide()
	$("#tblwrapper").css({
		"height": "100%", "width": "100%"
	})

	fakeScrollAnimate("tblcontainer", "tbl", scrolledTop, tohead)
}

function fakeScrollAnimate(containerID, tableID, scrolledTop, tohead)
{
	var $container = $('#' + containerID)
	var $table = $('#' + tableID)
	var pixel = 300
	if ((scrolledTop > tohead.offsetTop) || (tohead.offsetTop < 300)) {
		pixel = -300
	}
	if ((tohead.offsetTop + $container.height()) < $table.height()) {
		$container.scrollTop(tohead.offsetTop - pixel)
		$container.animate({
			scrollTop: $container.scrollTop() + pixel
		}, 500);
	} else {
		$container.scrollTop(tohead.offsetTop)
	}	//table end
}


function mainMenu(pointing)
{
	var $pointing = $(pointing),
		tableID = $pointing.closest('table').attr('id'),
		$row = $pointing.closest('tr'),
		$cell = $row.find("td"),
		opdateth = $cell.eq(OPDATE).html(),
		opdate = getOpdate(opdateth),
		staffname = $cell.eq(STAFFNAME).html(),
		qn = $cell.eq(QN).html(),
		book = ConsultsTbl(tableID)? gv.CONSULT : gv.BOOK,
		notLARGE = (opdate !== LARGESTDATE)

	disable(qn, "#addrow")

	var itempost = !!(qn && staffname && notLARGE)
	if (itempost) {
		itemtext("#postpone", "<b>Confirm เลื่อน ไม่กำหนดวัน  </b>", $cell)
	}
	disable(itempost, "#itempost")
	disable(itempost, "#postpone")

	disable(qn, "#changedate")

	disable(qn, "#equip")

	disable(qn, "#history")

	var unuse = !!checkblank(book, opdate, qn),
		del = !!(qn || unuse)
	if (del) {
		itemtext("#del", "<b>Confirm Delete </b>", $cell)
	}
	disable(del, "#itemdel")
	disable(del, "#del")

	var $menu = $("#menu")
	$menu.menu({
		select: function( event, ui ) {

			var item = $(ui.item).attr("id")

			switch(item)
			{
				case "addrow":
					addnewrow(tableID, $row, qn)
					break
				case "postpone":
					postpone(tableID, $row, opdateth, opdate, staffname, qn)
					break
				case "changedate":
					changeDate($row, opdateth, opdate, staffname, qn)
					break
				case "equip":
					fillEquipTable(book, $row, qn)
					break
				case "history":
					editHistory($row[0], qn)
					break
				case "del":
					delCase(unuse, tableID, $row, opdateth, opdate, staffname, qn)
					break
				case "staffqueue":
					staffqueue(ui.item.text())
					break
				case "service":
					serviceReview()
					break
				case "deleted":
					deletedCases()
					break
				case "notdeleted":
					allCases()
					break
				case "search":
					find()
					break
				case "readme":
					readme()
					break
			}
			// clear after selection
			clearEditcell()
			$menu.hide()
			event.stopPropagation()
		}
	});

	var $container = $pointing.closest('div')

	$menu.appendTo($container)
	reposition($menu, "left top", "left bottom", $pointing, $container)
	menustyle($menu, $pointing)
}

function itemtext(id, item, $cell)
{
	var $itemdiv = $(id).find("div"),
		itemtext = item,
		itemname = $cell.eq(NAME).html()
	$itemdiv.html(itemtext + "<br>" + itemname)
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

function menustyle($me, $target)
{
	if ($me.position().top > $target.position().top) {
		var shadow = '10px 20px 30px slategray'
	} else {
		var shadow = '10px -20px 30px slategray'
	}

	$me.css({
		boxShadow: shadow
	})
}

// Is this a blank row?
// If blank, is there a case(s) in this date? 
function checkblank(book, opdate, qn)
{	var q = 0

	// No, this is not a blank row
	if (qn) {
		return false
	}
	// the following is a blank row
	// find this opdate in book
	while (opdate > book[q].opdate)
	{
		q++
		if (q >= book.length) {
			// beyond book, do not delete blank row
			return false
		}
	}
	// found
	// if there is a case(s) in this opdate, can delete blank row
	// if no case in this opdate, do not delete blank row
	if (opdate === book[q].opdate) {
		return true
	} else {
		return false
	}
}

function addnewrow(tableID, $row)
{
	if (tableID === "tbl") {
		$row.clone()
			.insertAfter($row)
				.find("td").eq(HN).removeClass("pacs")
				.parent().find("td").eq(NAME).removeClass("camera")
				.parent().find("td").eq(OPDATE)
					.nextAll()
						.html("")
	}
	else if (tableID === "queuetbl") {
		$row.clone()
			.insertAfter($row)
				.find("td").eq(HN).removeClass("pacs")
				.parent().find("td").eq(NAME).removeClass("camera")
				.parent().find("td").eq(STAFFNAME)
					.nextAll()
						.html("")
	}
}

function postpone(tableID, $row, opdateth, opdate, staffname, qn)
{
	var oproom = $row.find("td").eq(ROOM).html(),
		allCases, index,

		sql = "sqlReturnbook=UPDATE book SET opdate='" + LARGESTDATE
			+ "', editor='" + gv.user
			+ "' WHERE qn="+ qn + ";"

	if (oproom) {
		allCases = sameDateRoomTableQN(opdateth, oproom)
		index = allCases.indexOf(qn)
		allCases.splice(index, 1)

		for (var i=0; i<allCases.length; i++) {
			sql += sqlCaseNum(i + 1, allCases[i])
		}
	}

	Ajax(MYSQLIPHP, sql, callbackpostpone)

	function callbackpostpone(response)
	{
		if (/BOOK/.test(response)) {
			updateBOOK(response)
			refillOneDay(opdate)
			if ((isSplited()) && 
				(isStaffname(staffname))) {
				// changeDate of this staffname's case
				refillstaffqueue()
			}
			scrolltoThisCase(qn)
		} else {
			Alert ("postpone", response)
		}
	}
}

function changeDate($row)
{
	var $allRows = $("#tbl tr:has('td'), #queuetbl tr:has('td')")
	$allRows.on("mouseover", overDate)
	$allRows.on("mouseout", outDate)
	$allRows.on("click", arguments, clickDate)

	$row.addClass("changeDate")
	$(document).on("keydown", clearOnEscape)
}

function overDate() { $(this).addClass("pasteDate") }

function outDate() { $(this).removeClass("pasteDate") }

// changeDate arguments = ($row, opdateth, opdate, staffname, qn)
function clickDate(event)
{
	var args = event.data,
		$moverow = args[0],
		moveOpdateth = args[1],
		moveOpdate = args[2],
		staffname = args[3],
		moveQN = args[4],
		moveroom = $moverow.find("td").eq(ROOM).html(),

		$thisrow = $(this),
		$thiscell = $thisrow.children("td"),
		thisOpdateth = $thiscell.eq(OPDATE).html(),
		thisOpdate = getOpdate(thisOpdateth),
		thisroom = $thiscell.eq(ROOM).html(),
		thisqn = $thiscell.eq(QN).html(),
		thisWaitnum = calcWaitnum(thisOpdateth, $thisrow, $thisrow.next()),
		allSameDate,
		allOldCases, moveindex,
		allNewCases, index, thisindex, casenum,
		sql = ""

	allOldCases = sameDateRoomTableQN(moveOpdateth, moveroom)
	moveindex = allOldCases.indexOf(moveQN)
	// remove itself from old sameDateRoom
	if (moveindex >= 0) {
		allOldCases.splice(moveindex, 1)
	}

	allNewCases = sameDateRoomTableQN(thisOpdateth, thisroom)
	sameroomindex = allNewCases.indexOf(moveQN)
	// remove itself in new sameDateRoom, in case new === old
	if (sameroomindex >= 0) {
		allNewCases.splice(sameroomindex, 1)
	}
	thisindex = allNewCases.indexOf(thisqn)

	allNewCases.splice(thisindex + 1, 0, moveQN)

	event.stopPropagation()
	clearMouseoverTR()
	// click the same case
	if (thisqn === moveQN) { return }

	for (var i=0; i<allOldCases.length; i++) {
		sql += sqlCaseNum(i + 1, allOldCases[i])
	}

	for (var i=0; i<allNewCases.length; i++) {
		if (allNewCases[i] === moveQN) {
			casenum = thisroom? (i + 1) : null
			sql += sqlMover(thisWaitnum, thisOpdate, thisroom || null, casenum, moveQN)
		} else {
			sql += sqlCaseNum(i + 1, allNewCases[i])
		}
	}

	if (!sql) { return }
	sql = "sqlReturnbook=" + sql

	Ajax(MYSQLIPHP, sql, callbackClickDate)

	function callbackClickDate(response)
	{
		if (/BOOK/.test(response)) {
			updateBOOK(response);
			if (moveOpdateth) {
				refillOneDay(moveOpdate)
			}
			if (moveOpdate !== thisOpdate) {
				refillOneDay(thisOpdate)
			}
			if (isSplited()) {
				var titlename = $('#titlename').html()
				if ((titlename === staffname) ||
					(titlename === "Consults")) {
					// changeDate of this staffname's case
					refillstaffqueue()
				}
			} 
			scrolltoThisCase(moveQN)
		} else {
			Alert ("changeDate", response)
		}
	}
}

function clearOnEscape(event) {
	var keycode = event.which || window.event.keyCode

	if (keycode === 27)	{
		clearMouseoverTR()
	}
}

function clearMouseoverTR()
{
	$("#tbl tr:has('td'), #queuetbl tr:has('td')").off({
		"mouseover": overDate,
		"mouseout": outDate,
		"click": clickDate
	})
	$(".pasteDate").removeClass("pasteDate")
	$(".changeDate").removeClass("changeDate")
	$(document).off("keydown", clearOnEscape)
}

function delCase(unuse, tableID, $row, opdateth, opdate, staffname, qn)
{
	// blank from add new row
	if (unuse) {
		$row.remove()
	} else {
		deleteCase(tableID, $row, opdateth, opdate, staffname, qn)
	}
}

function deleteCase(tableID, $row, opdateth, opdate, staffname, qn)
{
	var oproom = $row.find("td").eq(ROOM).html(),
		allCases, index,

		// not actually delete the case but set deleted = 1
		sql = "sqlReturnbook=UPDATE book SET "
			+ "deleted=1, "
			+ "editor = '" + gv.user
			+ "' WHERE qn="+ qn + ";"

	if (oproom) {
		allCases = sameDateRoomTableQN(opdateth, oproom)
		index = allCases.indexOf(qn)
		allCases.splice(index, 1)

		for (var i=0; i<allCases.length; i++) {
			sql += sqlCaseNum(i + 1, allCases[i])
		}
	}

	Ajax(MYSQLIPHP, sql, callbackdeleterow)

	function callbackdeleterow(response)
	{
		if (/BOOK/.test(response)) {
			updateBOOK(response)
			if (tableID === "tbl") {
				refillOneDay(opdate)
				if ((isSplited()) && 
					(isStaffname(staffname))) {
					refillstaffqueue()
				}
			} else {
				if (isConsults()) {
					deleteRow($row, opdate)
				} else {
					$row.remove()
				}
				refillOneDay(opdate)
			}
		} else {
			Alert ("deleteCase", response)
		}
	}
}

function deleteRow($row, opdate)
{
	var prevDate = $row.prev().children("td").eq(OPDATE).html()
	var nextDate = $row.next().children("td").eq(OPDATE).html()

	prevDate = getOpdate(prevDate)
	nextDate = getOpdate(nextDate)

	if ((prevDate === opdate)
	|| (nextDate === opdate)
	|| $row.closest("tr").is(":last-child")) {
		$row.remove()
	} else {
		$row.children("td").eq(OPDATE).siblings().html("")
		$row.children("td").eq(HN).removeClass("pacs")
		$row.children("td").eq(NAME).removeClass("camera")
		$row.children('td').eq(STAFFNAME).html(showStaffOnCall(opdate))
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
	initResize($("#tblwrapper"))
	$('.ui-resizable-e').css('height', $("#tbl").css("height"))

	fakeScrollAnimate("tblcontainer", "tbl", scrolledTop, tohead.offsetTop)
}

function initResize($wrapper)
{
	$wrapper.resizable(
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
			var margin = divTwo.outerWidth() - divTwo.innerWidth()
			ui.element.css(
			{
				width: ui.element.outerWidth()/parent.width()*100+"%",
			});
			ui.element.next().css(
			{
				width: (remainSpace-margin)/parent.width()*100+"%",
			});
		}
	});
}

function closequeue()
{
	var scrolledTop = document.getElementById("tblcontainer").scrollTop
	var tohead = findVisibleHead('#tbl')
	
	$("#queuewrapper").hide()
	$("#tblwrapper").css({
		"height": "100%", "width": "100%"
	})

	fakeScrollAnimate("tblcontainer", "tbl", scrolledTop, tohead.offsetTop)
}

function fakeScrollAnimate(containerID, tableID, scrolledTop, offsetTop)
{
	var $container = $('#' + containerID)
	var $table = $('#' + tableID)
	var pixel = 300
	if ((scrolledTop > offsetTop) || (offsetTop < 300)) {
		pixel = -300
	}
	if ((offsetTop + $container.height()) < $table.height()) {
		$container.scrollTop(offsetTop - pixel)
		$container.animate({
			scrollTop: $container.scrollTop() + pixel
		}, 500);
	} else {
		$container.scrollTop(offsetTop)
	}	// table end
}

function findVisibleHead(table)
{
	var tohead

	$.each($(table + ' tr'), function(i, tr) {
		tohead = tr
		return ($(tohead).offset().top < 0)
	})
	return tohead
}
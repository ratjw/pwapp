
function serviceReview()
{
	resetcountService()
	$('#servicehead').hide()
	$('#servicetbl').hide()
	$('#exportService').hide()
	$('#reportService').hide()
	$('#dialogService').dialog({
		title: 'Service Neurosurgery',
		closeOnEscape: true,
		modal: true,
		width: window.innerWidth * 95 / 100,
		height: window.innerHeight * 95 / 100
	})

	$('#monthpicker').show()
	$('#monthpicker').datepicker( {
		altField: $('#monthstart'),
		altFormat: "yy-mm-dd",
		autoSize: true,
		dateFormat: "MM yy",
		monthNames: [ "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
					  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม" ],
		onChangeMonthYear: function (year, month, inst) {
			$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1))
		},
		beforeShow: function (input, obj) {
			$('.ui-datepicker-calendar').hide()
		}
	}).datepicker("setDate", new Date(new Date().getFullYear(), new Date().getMonth(), 1))

	$(document).on("click", '.ui-datepicker-title', function() {
		entireMonth($('#monthstart').val())
	})
}

function entireMonth(fromDate)
{
	var date = new Date(fromDate),
		toDate = new Date(date.getFullYear(), date.getMonth()+1, 0),
		$monthpicker = $('#monthpicker'),
		$exportService = $("#exportService"),
		$reportService = $("#reportService"),
		title = 'Service Neurosurgery เดือน ' + $monthpicker.val()

	// show month name before change $monthpicker.val to last date of this month
	$('#dialogService').dialog({
		title: title
	})
	toDate = $.datepicker.formatDate('yy-mm-dd', toDate)
	$monthpicker.val(toDate)

	getServiceOneMonth(fromDate, toDate).then( function (SERVICE) {
		gv.SERVICE = SERVICE
		showService(fromDate, toDate)
	}, function (title, message) {
		Alert(title, message)
	})

	$(document).off("click", '.ui-datepicker-title')
	$exportService.show()
	$exportService.on("click", function(e) {
		e.preventDefault()
		exportServiceToExcel()
	})
	$reportService.show()
	$reportService.on("click", function(e) {
		e.preventDefault()
		showReportToDept(title)
	})
}

//Retrieve the specified month from server
function getServiceOneMonth(fromDate, toDate)
{
	var defer = $.Deferred(),
		sql = "sqlReturnData=SELECT * FROM book "
			  + "WHERE opdate BETWEEN '" + fromDate + "' AND '" + toDate
			  + "' AND deleted=0 "
			  + "AND waitnum<>0 "
			  + "ORDER BY opdate, oproom, casenum, waitnum;";

	Ajax(MYSQLIPHP, sql, callbackGetService)

	return defer.promise()

	function callbackGetService(response)
	{
		/dob/.test(response)
			? defer.resolve( JSON.parse(response) )
			: defer.reject("getServiceOneMonth", response)
	}
}

function showService(fromDate, toDate)
{
	//delete previous servicetbl lest it accumulates
	var $servicetbl = $('#servicetbl'),
		$servicecells = $("#servicecells")

	$servicetbl.find('tr').slice(1).remove()
	$servicetbl.show()
	$servicetbl.on("click", function (event) {
		resetTimer();
		gv.idleCounter = 0
		event.stopPropagation()
		var target = event.target
		var editable = fromDate >= getStart()
		if (target.nodeName === "TH") {
			clearEditcell()
			return	
		} else {
			clickservice(event, target, editable)
		}
	})

	$.each( gv.STAFF, function() {
		var staffname = this.staffname
		$servicecells.find('tr').clone()
			.appendTo($servicetbl.find('tbody'))
				.children("td").eq(OPDATE)
					.prop("colSpan", 9)
						.addClass("serviceStaff")
							.html(staffname)
								.siblings().hide()
		var scase = 0
		$.each( gv.SERVICE, function() {
			if (this.staffname === staffname) {
				var classname = countService(this, fromDate, toDate)
				scase++
				$servicecells.find('tr').clone()
					.appendTo($servicetbl.find('tbody'))
						.filldataService(this, scase, classname)
			}
		});
	})

	var $monthpicker = $('#monthpicker')
	$monthpicker.hide()
	$('#servicehead').show()
	var $dialogService = $('#dialogService')
	$dialogService.dialog({
		hide: 200,
		width: window.innerWidth * 95 / 100,
		height: window.innerHeight * 95 / 100,
		close: function() {
			clearEditcell()
			refillstaffqueue()
			refillall()
			$(".ui-dialog:visible").find(".ui-dialog-content").dialog("close");
			$(".fixed").remove()
			$(window).off("resize", resizeDialog)
		}
	})
	getAdmitDischargeDate(gv.SERVICE, fromDate, toDate)
	countAllServices()
	$servicetbl.fixMe($dialogService)
	hoverService()

	//for resizing dialogs in landscape / portrait view
	$(window).on("resize", resizeDialog)
}

function resizeDialog()
{
	$dialogService.dialog({
		width: window.innerWidth * 95 / 100,
		height: window.innerHeight * 95 / 100
	})
	winResizeFix($servicetbl, $dialogService)
}

function refillService(fromDate, toDate)
{
	var i = 0
	$.each( gv.STAFF, function() {
		var staffname = this.staffname
		i++
		var $thisCase = $('#servicetbl tr').eq(i).children("td").eq(CASENUMSV)
		if ($thisCase.prop("colSpan") === 1) {
			$thisCase.prop("colSpan", 9)
				.addClass("serviceStaff")
					.siblings().hide()
		}
		$thisCase.html(staffname)

		var scase = 0
		$.each( gv.SERVICE, function() {
			if (this.staffname === staffname) {
				var classes = countService(this, fromDate, toDate)
				i++
				scase++
				var $cells = $('#servicetbl tr').eq(i).children("td")
				if ($cells.eq(CASENUMSV).prop("colSpan") > 1) {
					$cells.eq(CASENUMSV).prop("colSpan", 1)
						.nextUntil($cells.eq(QNSV)).show()
				}
				$('#servicetbl tr').eq(i)
						.filldataService(this, scase, classes)
			}
		});
	})
	if (i < ($('#servicetbl tr').length - 1)) {
		$('#servicetbl tr').slice(i+1).remove()
	}
	countAllServices()
}

jQuery.fn.extend({
	filldataService : function(bookq, scase, classes) {
		var cells = this[0].cells
		if (bookq.hn && gv.isPACS) { cells[HNSV].className = "pacs" }
		cells[NAMESV].className = "camera"
		cells[TREATMENTSV].className = putReoperate(classes)
		cells[ADMISSIONSV].className = putReadmit(classes)
		cells[FINALSV].className = "record"
		updateRowClasses(this, classes)

		cells[CASENUMSV].innerHTML = scase
		cells[HNSV].innerHTML = bookq.hn
		cells[NAMESV].innerHTML = putNameAge(bookq)
		cells[DIAGNOSISSV].innerHTML = bookq.diagnosis
		cells[TREATMENTSV].innerHTML = bookq.treatment
		cells[ADMISSIONSV].innerHTML = bookq.admission
		cells[FINALSV].innerHTML = bookq.final
		cells[ADMITSV].innerHTML = (bookq.admit? bookq.admit : "")
		cells[DISCHARGESV].innerHTML = (bookq.discharge? bookq.discharge : "")
		cells[QNSV].innerHTML = bookq.qn
	}
})

// Simulate hover on icon by changing background pics
function hoverService()
{
	var	paleClasses = ["pacs", "camera", "record", "Operation",
						"Admit", "Reoperation", "Readmission"
		],
		boldClasses = ["pacs2", "camera2", "record2", "Operation2",
						"Admit2", "Reoperation2", "Readmission2"
		]

	$("td.pacs, td.camera, td.record, td.Operation, td.Admit,\
		td.Reoperation, td.Readmission")
	.mousemove(function(event) {
		if (inPicArea(event, this)) {
			getClass(this, paleClasses, boldClasses)
		} else {
			getClass(this, boldClasses, paleClasses)
		}
	})
	.mouseout(function (event) {
		getClass(this, boldClasses, paleClasses)
	})
}

function putReoperate(classes)
{
	if (/Reoperation/.test(classes)) {
		return "Reoperation"
	}
	else if (/Operation/.test(classes)) {
		return "Operation"
	}

	return ""
}

function putReadmit(classes)
{
	if (/Readmission/.test(classes)) {
		return "Readmission"
	}
	else if (/Admit/.test(classes)) {
		return "Admit"
	}

	return ""
}

function updateRowClasses($this, classname)
{
	if (classname) {
		$this[0].className = classname
		var $cell = $this.children("td"),
			$admit = $cell.eq(ADMISSIONSV),
			$treat = $cell.eq(TREATMENTSV),
			$final = $cell.eq(FINALSV)

		// delete cell classes except "record"
		$admit[0].className = ""
		$treat[0].className = ""
		$final[0].className = "record"

		if (/Readmission/.test(classname)) {
			$admit.addClass("Readmission")
		}
		else if (/Admit/.test(classname)) {
			$admit.addClass("Admit")
		}
		if (/Reoperation/.test(classname)) {
			$treat.addClass("Reoperation")
		}
		else if (/Operation/.test(classname)) {
			$treat.addClass("Operation")
		}
		if (/Infection/.test(classname)) {
			$final.addClass("Infection")
		}
	}
}

function getAdmitDischargeDate(fromDate, toDate)
{
	Ajax(GETIPD, "from=" + fromDate + "&to=" + toDate, callbackgetipd)

	function callbackgetipd(response)
	{
		if (/BOOK/.test(response)) {
			updateBOOK(response)
			fillAdmitDischargeDate()
		}
//		else {
//			Alert("getAdmitDischargeDate", response)
//		}
	}
}

function fillAdmitDischargeDate()
{
	var i = 0
	$.each( gv.STAFF, function() {
		var staffname = this.staffname
		i++
		$.each( gv.SERVICE, function() {
			if (this.staffname === staffname) {
				i++
				var $thisRow = $('#servicetbl tr').eq(i),
					$cells = $thisRow.children("td")

				if (this.admit && 
					this.admit !== $cells.eq(ADMITSV).html()) {
					$cells.eq(ADMITSV).html(this.admit)
					if (!$cells.eq(ADMITSV).html()) {
						$cells.eq(ADMISSIONSV).addClass("Admit")
						$thisRow.addClass("Admit")
					}
				}
				if (this.discharge && 
					this.discharge !== $cells.eq(DISCHARGESV).html()) {
					$cells.eq(DISCHARGESV).html(this.discharge)
					$thisRow.addClass("Discharge")
				}
			}
		});
	})
}

function countAllServices()
{
	resetcountService()

	$.each( $('#servicetbl tr'), function() {
		var counter = this.className.split(" ")
		$.each(counter, function() {
			if (document.getElementById(this)) {
				document.getElementById(this).innerHTML++
			}
		})
	})
}

function clickservice(evt, clickedCell, editable)
{
	savePreviousCellService()
	storePresentCellService(evt, clickedCell, editable)
}

function Skeyin(event, keycode, pointing)
{
	var SEDITABLE	= [DIAGNOSISSV, TREATMENTSV, ADMISSIONSV, FINALSV],
		fromDate = $('#monthstart').val(),
		start = getStart(),
		editable = (fromDate >= start),
		thiscell

	if (keycode === 27) {
		pointing.innerHTML = $("#editcell").data("oldcontent")
		clearEditcell()
		window.focus()
		event.preventDefault()
		return false
	}
	if (!pointing) {
		return
	}
	if (keycode === 9) {
		savePreviousCellService()
		if (event.shiftKey)
			thiscell = findPrevcell(event, SEDITABLE, pointing)
		else
			thiscell = findNextcell(event, SEDITABLE, pointing)
		if (thiscell) {
			storePresentCellService(event, thiscell, editable)
		} else {
			clearEditcell()
			window.focus()
		}
		event.preventDefault()
		return false
	}
	if (keycode === 13) {
		if (event.shiftKey || event.ctrlKey) {
			return
		}
		savePreviousCellService()
		thiscell = findNextRow(event, SEDITABLE, pointing)
		if (thiscell) {
			storePresentCellService(event, thiscell, editable)
		} else {
			clearEditcell()
			window.focus()
		}
		event.preventDefault()
		return false
	}
}

function savePreviousCellService()
{
	var $editcell = $("#editcell"),
		oldcontent = $editcell.data("oldcontent"),
		newcontent = getText($editcell),
		pointed = $editcell.data("pointing")

	if (!pointed || (oldcontent === newcontent)) {
		return false
	}

	switch(pointed.cellIndex)
	{
		case CASENUMSV:
		case HNSV:
		case NAMESV:
			return false
		case DIAGNOSISSV:
			saveContentService(pointed, "diagnosis", newcontent)
			return true
		case TREATMENTSV:
			saveContentService(pointed, "treatment", newcontent)
			return true
		case ADMISSIONSV:
			saveContentService(pointed, "admission", newcontent)
			return true
		case FINALSV:
			saveContentService(pointed, "final", newcontent)
			return true
		case ADMITSV:
		case DISCHARGESV:
			return false
	}
}

//column matches column name in MYSQL
function saveContentService(pointed, column, content)
{
	var qn = $(pointed).closest('tr').find('td').eq(QNSV).html()

	// Not refillService because it may make next cell back to old value
	// when fast entry, due to slow return from Ajax of previous input
	pointed.innerHTML = content? content : ''

	//take care of white space, double qoute, single qoute, and back slash
	if (/\W/.test(content)) {
		content = URIcomponent(content)
	}
	var sql = "sqlReturnService=UPDATE book SET "
			+ column + "='" + content
			+ "', editor='" + gv.user
			+ "' WHERE qn=" + qn + ";"

	saveService(pointed, sql)
}

function saveService(pointed, sql)
{
	var $row = $(pointed).closest('tr'),
		rowi = $row[0],
		qn = rowi.cells[QNSV].innerHTML,
		oldcontent = $("#editcell").data("oldcontent"),
		fromDate = $('#monthstart').val(),
		toDate = $('#monthpicker').val()

	sql	+= "SELECT * FROM book "
		+ "WHERE opdate BETWEEN '" + fromDate + "' AND '" + toDate
		+ "' AND deleted=0 "
		+ "AND waitnum<>0 "
		+ "ORDER BY opdate, oproom, casenum, waitnum;";

	Ajax(MYSQLIPHP, sql, callbacksaveScontent);

	function callbacksaveScontent(response)
	{
		if (/BOOK/.test(response)) {
			updateBOOK(response)

			// Calc countService of this case only
			var oldclass = rowi.className
			var bookq = getBOOKrowByQN(gv.SERVICE, qn)
			var newclass = countService(bookq, fromDate, toDate)
			var oldclassArray = oldclass.split(" ")
			var newclassArray = newclass.split(" ")
			var counter
			var newcounter

			if (oldclass !== newclass) {
				updateCounter(oldclassArray, -1)
				updateCounter(newclassArray, 1)
				updateRowClasses($row, newclass)
			}
		} else {
			Alert("saveContentService", response)
			pointed.innerHTML = oldcontent
			//return to previous content
		}
	}
}

function updateCounter(classArray, one)
{
	var counter

	$.each( classArray, function(i, each) {
		if (counter = document.getElementById(each)) {
			counter.innerHTML = Number(counter.innerHTML) + one
		}
	})
}

function storePresentCellService(evt, pointing, editable)
{
	var cindex = pointing.cellIndex

	switch(cindex)
	{
		case CASENUMSV:
			break
		case HNSV:
			getHNSV(evt, pointing)
			break
		case NAMESV:
			getNAMESV(evt, pointing)
			break
		case DIAGNOSISSV:
			editable && createEditcell(pointing)
			break
		case TREATMENTSV:
			getTREATMENTSV(evt, pointing, editable)
			break
		case ADMISSIONSV:
			getADMISSIONSV(evt, pointing, editable)
			break
		case FINALSV:
			getFINALSV(evt, pointing, editable)
			break
		case ADMITSV:
		case DISCHARGESV:
			clearEditcell()
			break
	}
}

function getHNSV(evt, pointing)
{
	clearEditcell()
	if (gv.isPACS) {
		if (inPicArea(evt, pointing)) {
			PACS(pointing.innerHTML)
		}
	}
}

function getNAMESV(evt, pointing)
{
	var hn = $(pointing).closest('tr').children("td").eq(HNSV).html()
	var patient = pointing.innerHTML

	clearEditcell()
	if (inPicArea(evt, pointing)) {
		showUpload(hn, patient)
	}
}

function getTREATMENTSV(evt, pointing, editable)
{
	if (editable) {
		var operated = sql = ""

		if (inPicArea(evt, pointing)) {
			clearEditcell()
			// click toggle Operation, Reoperation
			if (/Reoperation/.test(pointing.className)) {
				operated = "Operation"
			} else if (/Operation/.test(pointing.className)) {
				operated = "Reoperation"
			}
			sql = sqlItemService(pointing, "operated", operated)
			saveService(pointing, sql)
		} else {
			createEditcell(pointing)
		}
	}
}

// readmit = null => no admission
// readmit = 0 => Admit but no Readmission
// readmit = 1 => Readmission
function getADMISSIONSV(evt, pointing, editable)
{
	if (editable) {
		var admitted = sql = ""

		if (inPicArea(evt, pointing)) {
			clearEditcell()
			// click toggle Admit, Readmission
			if (/Readmission/.test(pointing.className)) {
				admitted = "Admit"
			} else if (/Admit/.test(pointing.className)) {
				admitted = "Readmission"
			}
			sql = sqlItemService(pointing, "admitted", admitted)
			saveService(pointing, sql)
		} else {
			createEditcell(pointing)
		}
	}
}

function getFINALSV(evt, pointing, editable)
{
	if (inPicArea(evt, pointing)) {
		clearEditcell()
		showRecord(pointing, editable)
	} else {
		if (editable) { createEditcell(pointing) }
	}
}

function showRecord(pointing, editable)
{
	$('#doneday').datepicker({
		dateFormat: "yy-mm-dd"
	})
	var $pointing = $(pointing),
		oldRecord = setRecord($pointing),
		$dialogRecord = $("#dialogRecord"),
		$instanceRecord = $dialogRecord.dialog({
			title: "Operation Detail",
			closeOnEscape: true,
			width: 570,
			position: {
				'my': 'right top',
				'at': 'right bottom',
				'of': $pointing
			},
			buttons: [{
				text: "OK",
				click: function() {
					if (editable) { saveRecord($pointing, oldRecord) }
					$( this ).dialog( "close" );
				}
			}],
			dislogClass: "dialogRecord"
		}),
		keycode,
		buttons,
		shadow

	$dialogRecord.on("keydown", function(event) {
		keycode = event.which || window.event.keyCode
		if (keycode === 13) {
			buttons = $instanceRecord.dialog('option', 'buttons')
			buttons[0].click.apply($instanceRecord)
		}
	})

	shadow = ($instanceRecord.offset().top > ($pointing.offset().top)) ? 1 : -1
	$(".ui-dialog").css({
		boxShadow: '10px ' + 20*shadow + 'px 30px slategray'
	})

	if (editable) {
		$('#dialogRecord input').off("click", returnFalse)
		$('#dialogRecord input[type=text]').prop('disabled', false)
	} else {
		$('#dialogRecord input').on("click", returnFalse)
		$('#dialogRecord input[type=text]').prop('disabled', true)
	}
}

function setRecord($pointing)
{
	var	$row = $pointing.closest("tr"),
		allClasses = $row.prop("class"),
		qn = $row.find("td").eq(QNSV).html(),
		book = gv.SERVICE,
		bookq = getBOOKrowByQN(book, qn),
		$dialogRecord = $("#dialogRecord"),
		setDefault

	$dialogRecord.find('input[type=text]').val('')
	$dialogRecord.find('input').prop('checked', false)
	$("#doneday").val(bookq.doneday ? bookq.doneday : bookq.opdate)
	
	$.each($("#manner input"), function() {
		setDefault = bookq.manner ? bookq.manner : "Elective"
		this.checked = this.title === setDefault
	})
	$.each($("#doneby input"), function() {
		setDefault = bookq.doneby ? bookq.doneby : "Staff"
		this.checked = this.title === setDefault
	})
	$.each($("#scale input"), function() {
		setDefault = bookq.scale ? bookq.scale : "Major"
		this.checked = this.title === setDefault
	})
	$.each($("#disease input"), function() {
		this.checked = new RegExp(this.title).test(bookq.disease)
	})
	$.each($("#admitted input"), function() {
		this.checked = this.title === bookq.admitted
	})
	$.each($("#operated input"), function() {
		this.checked = this.title === bookq.operated
	})
	$.each($("#nonsurgical input"), function() {
		this.checked = new RegExp(this.title).test(bookq.nonsurgical)
	})
	document.getElementById("infect").checked = /Infection/.test(allClasses)
	document.getElementById("morbidity").checked = /Morbidity/.test(allClasses)
	document.getElementById("mortal").checked = /Dead/.test(allClasses)

	return getRecord()
}

function getRecord()
{
	var $dialogRecord = $('#dialogRecord'),
		record = {},
		input

	record.doneday = document.getElementById("doneday").value
	$.each($dialogRecord.find(".datacolumn"), function() {
		input = $(this).find("input").filter(function() {
			return this.checked
		})
		if (input.length) {
			var item = ""
			input.each(function() {
				item += this.title + " "
			})
			record[this.id] = $.trim(item)
		} else {
			record[this.id] = ""
		}
	})
	return record
}

function saveRecord($pointing, oldRecord)
{
	var newrecord = getRecord(),
		sql

	$.each(newrecord, function(key, val) {
		if (val === oldRecord[key]) {
			delete newrecord[key]
		}
	})
	if ( Object.keys(newrecord).length ) {
		sql = sqlRecord($pointing, newrecord)
		saveService($pointing[0], sql)
	}
}

function sqlRecord($pointing, newrecord)
{
	var qn = $pointing.closest("tr").find("td").eq(QNSV).html(),
		sql = "sqlReturnService="

	$.each(newrecord, function(column, content) {
		sql += sqlItem(column, content, qn)
	})

	return sql
}

function sqlItemService(pointing, column, content)
{
	var qn = $(pointing).closest("tr").find("td").eq(QNSV).html()

	return "sqlReturnService=" + sqlItem(column, content, qn)
}

function sqlItem(column, content, qn) {
	return "UPDATE book SET "
		+ column + "='" + content
		+ "',editor='" + gv.user
		+ "' WHERE qn=" + qn + ";"
}

function showReportToDept(title)
{
	var sumColumn = [0, 0, 0, 0, 0, 0, 0, 0]

	$("#dialogReview").dialog({
		title: title,
		closeOnEscape: true,
		modal: true,
		width: 550,
		buttons: [{
			text: "Export to Excel",
			click: function() {
				exportReportToExcel(title)
				$( this ).dialog( "close" );
			}
		}]
	})

	$("#reviewtbl tr:not('th')").each(function() {
		$.each($(this).find("td:not(:first-child)"), function() {
			this.innerHTML = 0
		})
	})
	$.each(gv.SERVICE, function() {
		fillCaseCount(this, this.disease)
		fillCaseCount(this, this.nonsurgical)
	})
	$("#reviewtbl tr:not('th, .notcount')").each(function(i) {
		$.each($(this).find("td:not(:first-child)"), function(j) {
			sumColumn[j] += Number(this.innerHTML)
		})
	})
	$("#Total").find("td:not(:first-child)").each(function(i) {
		this.innerHTML = sumColumn[i]
	})
	$("#Grand").find("td:not(:first-child)").each(function(i) {
		i = i * 2
		this.innerHTML = sumColumn[i] + sumColumn[i+1]
	})
}

function fillCaseCount(thisrow, thisitem)
{
	var row = ROWREPORT[thisitem],
		column = COLUMNREPORT[thisrow.doneby]
			   + COLUMNREPORT[thisrow.scale]
			   + COLUMNREPORT[thisrow.manner]

	if (row && column) {
		$("#reviewtbl tr")[row].cells[column].innerHTML++
	}
}

function resetcountService()
{
	document.getElementById("Admit").innerHTML = 0
	document.getElementById("Discharge").innerHTML = 0
	document.getElementById("Operation").innerHTML = 0
	document.getElementById("Readmission").innerHTML = 0
	document.getElementById("Reoperation").innerHTML = 0
	document.getElementById("Infection").innerHTML = 0
	document.getElementById("Morbidity").innerHTML = 0
	document.getElementById("Dead").innerHTML = 0
}

function countService(thiscase, fromDate, toDate)
{
	var classname = ""

	if (thiscase.admitted) {
		classname += thiscase.admitted + " "
	}
	if (thiscase.operated) {
		classname += thiscase.operated + " "
	}
	if (thiscase.infection) {
		classname += thiscase.infection + " "
	}
	if (thiscase.morbid) {
		classname += thiscase.morbid + " "
	}
	if (thiscase.dead) {
		classname += thiscase.dead + " "
	}
	// Consult cases (waitnum < 0) are admitted in another service
	if ((thiscase.waitnum > 0)
		&& (thiscase.admit >= fromDate)
		&& (thiscase.admit <= toDate)) {
		if (!/Admit/.test(classname)) {
			classname += "Admit "
		}
	}
	if ((thiscase.discharge >= fromDate)
		&& (thiscase.discharge <= toDate)
		&& (thiscase.waitnum > 0)) {
		classname += "Discharge "
	}
	if (isOperation(thiscase)) {
		if (!/Operation/.test(classname)) {
			classname += "Operation"
		}
	}

	return $.trim(classname)
}

function isOperation(thiscase)
{
	var neuroSxOp = [
		/ACDF/, /ALIF/, /[Aa]nast/, /[Aa]pproa/, /[Aa]spirat/, /[Aa]dvance/,
		/[Bb]iop/, /[Bb]lock/, /[Bb]urr/, /[Bb]x/, /[Bb]ypass/, /[Bb]alloon/,
		/[Cc]lip/, 
		/[Dd]ecom/, /DBS/, /[Dd]rain/, /[Dd]isconnect/,
		/[Ee]ctomy/, /[Ee]ndo/, /ESI/, /ETS/, /ETV/, /EVD/, /[Ee]xcis/, /ECOG/,
		/[Ff]ix/, /[Ff]usion/,
		/[Gg]rid/,
		/[Ii]nsert/,
		/[Ll]esion/, /[Ll]ysis/, 
		/MIDLIF/, /MVD/,
		/[Nn]eurot/, /Navigator/,
		/OLIF/, /[Oo]cclu/, /[Oo]perat/, /ostom/, /otom/,
		/plast/, /PLF/, /PLIF/,
		/[Rr]econs/, /[Rr]emov/, /[Rr]epa/, /[Rr]evis/, /[Rr]obot/,
		/scope/, /[Ss]crew/, /[Ss]hunt/, /[Ss]tim/, /SNRB/,
		/TSP/, /TLIF/, /[Tt]rans/,
		/[Uu]ntether/,
		/VNS/
	]
	var Operation = false
	$.each( neuroSxOp, function(i, each) {
		return !(Operation = each.test(thiscase.treatment))
	})
	return Operation
}

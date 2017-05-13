
function serviceReview()
{
	$('#monthpicker').show()
	$('#servicehead').hide()
	$('#monthpicker').datepicker( {
		altField: $( "#monthpicking" ),
		altFormat: "yy-mm-dd",
		autoSize: true,
		dateFormat: "MM yy",
		minDate: "-1y",
		maxDate: "+1y",
		monthNames: [ "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
					  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม" ],
		onChangeMonthYear: function (year, month, inst) {
			$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1))
		},
		beforeShow: function () {
			$('.ui-datepicker-calendar').css('display', 'none')
		}
	}).datepicker("setDate", new Date(new Date().getFullYear(), new Date().getMonth(), 1))

	$('#dialogService').dialog({
		title: 'Service Neurosurgery เดือน : ',
		closeOnEscape: true,
		modal: true,
		width: window.innerWidth * 95 / 100,
		height: window.innerHeight * 95 / 100
	})
	$('.ui-datepicker').click(function() {
		if (!$('#monthpicker').is(":focus")) {	//click on month name
			entireMonth($('#monthpicking').val())
			$('#monthpicker').datepicker( "hide" )
		} else {
			$('.ui-datepicker-calendar').css('display', 'none')
			//click on <prev next> month
			//display the month without date
		}
	})
	$('#monthpicker').click(function() { //setDate follows input box
		$('#monthpicker').datepicker(
			"setDate", $('#monthpicking').val()
						? new Date($('#monthpicking').val())
						: new Date()
		)
		$('.ui-datepicker').show()
		$('.ui-datepicker-calendar').css('display', 'none')
	})
	$( "#monthpicker" ).datepicker('setDate', new Date($('#monthpicking').val()))
	$('.ui-datepicker-calendar').css('display', 'none')
	$('#servicetbl').hide()
	resetcountService()
	reposition('.ui-datepicker', 'left center', 'left center', $('#monthpicker'))
}

function entireMonth(fromDate)
{
	var from = new Date(fromDate)
	var toDate = new Date(from.getFullYear(), from.getMonth()+1, 0)
	toDate = $.datepicker.formatDate('yy-mm-dd', toDate);	//end of this month
	$('#dialogService input[type=button]').hide()
	$('#monthpicker').data({
		fromDate: fromDate,
		toDate: toDate
	})

	var SERVICE = getfromBOOK(fromDate, toDate)
	showService(SERVICE, fromDate, toDate)
}

function getfromBOOK(fromDate, toDate)
{
	var SERV = []
	var i = 0
	for (var q = 0; q < BOOK.length; q++) {
		if ((BOOK[q].opdate >= fromDate) && (BOOK[q].opdate <= toDate)) {
			SERV[i] = BOOK[q]
			i++
		}
		if (BOOK[q].opdate > toDate) {
			break
		}
	}
	return SERV
}

function showService(SERVICE, fromDate, toDate)
{
	resetcountService()

	//delete previous servicetbl lest it accumulates
	$('#servicetbl tr').slice(1).remove()
	$('#servicetbl').show()

	$.each( STAFF, function() {
		var staffname = this
		$('#sdatatitle tr').clone()
			.insertAfter($('#servicetbl tr:last'))
				.children().eq(OPDATE)
					.prop("colSpan", 8)
						.css({
							height: "40",
							fontWeight: "bold",
							fontSize: "14px",
							textAlign: "left",
							paddingLeft: "10px"
						})
						.html(staffname)
							.siblings().hide()
		var scase = 0
		$.each( SERVICE, function() {
			if (this.staffname == staffname) {
				var color = countService(this, fromDate, toDate)
				scase++
				$('#sdatatitle tr').clone()
					.insertAfter($('#servicetbl tr:last'))
						.filldataService(this, scase, color)
			}
		});
	})

	$('#monthpicker').hide()
	$('#servicehead').show()
	$('.ui-datepicker').off("click")
	$('#dialogService').dialog({
		title: 'Service Neurosurgery เดือน : ' + $('#monthpicker').val(),
		close: function() {
			$('#datepicker').hide()
		}
	})
	getAdmitDischargeDate(SERVICE, fromDate, toDate)
}

function refillService(SERVICE, fromDate, toDate)
{
	resetcountService()

	var i = 0
	$.each( STAFF, function() {
		var staffname = this
		i++
		var $thisCase = $('#servicetbl tr').eq(i).children().eq(CASE)
		if ($thisCase.prop("colSpan") == 1) {
			$thisCase.prop("colSpan", 8)
				.css({
					height: "40",
					fontWeight: "bold",
					fontSize: "14px",
					textAlign: "left",
					paddingLeft: "10px"
				})
				.siblings().hide()
		}
		$thisCase.html(staffname)

		var scase = 0
		$.each( SERVICE, function() {
			if (this.staffname == staffname) {
				var color = countService(this, fromDate, toDate)
				i++
				scase++
				var $thisRow = $('#servicetbl tr').eq(i).children()
				if ($thisRow.eq(CASE).prop("colSpan") > 1) {
					$thisRow.eq(CASE).prop("colSpan", 1)
						.nextUntil($thisRow.eq(SQN)).show()
				}
				$('#servicetbl tr').eq(i)
						.filldataService(this, scase, color)
			}
		});
	})
	if (i < ($('#servicetbl tr').length - 1))
		$('#servicetbl tr').slice(i+1).remove()
}

jQuery.fn.extend({
	filldataService : function(bookq, scase, color) {
		this[0].className = color
		var rowcell = this[0].cells
		rowcell[CASE].innerHTML = scase
		rowcell[PATIENT].innerHTML = bookq.hn
			+ " " + bookq.patient
			+ " " + (bookq.dob? bookq.dob.getAge(bookq.opdate) : "")
		rowcell[SDIAGNOSIS].innerHTML = bookq.diagnosis
		rowcell[STREATMENT].innerHTML = bookq.treatment
		rowcell[ADMISSION].innerHTML = bookq.admission
		rowcell[FINAL].innerHTML = bookq.final
		rowcell[ADMIT].innerHTML = (bookq.admit? bookq.admit : "")
		rowcell[DISCHARGE].innerHTML = (bookq.discharge? bookq.discharge : "")
		rowcell[SQN].innerHTML = bookq.qn
	}
})

function resetcountService()
{
	document.getElementById("Admit").innerHTML = 0
	document.getElementById("Discharge").innerHTML = 0
	document.getElementById("Operation").innerHTML = 0
	document.getElementById("Morbidity").innerHTML = 0
	document.getElementById("Readmission").innerHTML = 0
	document.getElementById("Infection").innerHTML = 0
	document.getElementById("Reoperation").innerHTML = 0
	document.getElementById("Dead").innerHTML = 0
}

function getAdmitDischargeDate(SERVICE, fromDate, toDate)
{
	var i = 0
	$.each( STAFF, function() {
		var staffname = this
		i++
		$.each( SERVICE, function() {
			if (this.staffname == staffname) {
				i++
				var $thisRow = $('#servicetbl tr').eq(i).children()
				var opdate = this.opdate
				var hn = this.hn
				var qn = this.qn
				var admit = this.admit
				var discharge = this.discharge
				var that = this

				if (!admit || !discharge) {

					Ajax(GETIPDAJAX, "opdate=" + opdate + "hn=" + hn + "&qn="+ qn, callbackgetipdajax)

					function callbackgetipdajax(response)
					{
						if (!response) {
							return
						}
						if (response.indexOf("{") == -1) {
							alert(response)
						} else {
							var ipd = JSONparse(response)
							$thisRow.eq(ADMIT).html(ipd.admission_date)
							$thisRow.eq(DISCHARGE).html(ipd.discharge_date)
							that.admit = ipd.admission_date
							that.discharge = ipd.discharge_date
						}
					}
				}
			}
		});
	})
}

function clickservice(clickedCell)
{
	savePreviousScell()
	storePresentScell(clickedCell)
}

function Skeyin(event)
{
	var keycode = event.which || window.event.keyCode
	var pointing = $("#editcell").data("pointing")
	var thiscell

	if (!pointing) {
		return
	}
		
	switch(keycode)
	{
		case 9:
			savePreviousScell()
			if (event.shiftKey)
				thiscell = findPrevcell(event, SEDITABLE, pointing)
			else
				thiscell = findNextcell(event, SEDITABLE, pointing)
			if (thiscell) {
				storePresentScell(thiscell)
			} else {
				clearEditcellData("hide")
				window.focus()
			}
			break
		case 13:
			if (event.shiftKey || event.ctrlKey) {
				return
			}
			savePreviousScell()
			thiscell = findNextRow(event, SEDITABLE, pointing)
			if (thiscell) {
				storePresentScell(thiscell)
			} else {
				clearEditcellData("hide")
				window.focus()
			}
			break
		case 27:
			clearEditcellData("hide")
			window.focus()
			break
		default:
			return
	}
	event.preventDefault()
	return false
}

function savePreviousScell()
{
	if (!$("#editcell").data("pointing"))
		return

	var content = ""
	switch($("#editcell").data("cellIndex"))
	{
		case CASE:
		case PATIENT:
			break
		case SDIAGNOSIS:
			content = getData()
			saveSContent("diagnosis", content)
			break
		case STREATMENT:
			content = getData()
			saveSContent("treatment", content)
			break
		case ADMISSION:
			content = getData()
			saveSContent("admission", content)
			break
		case FINAL:
			content = getData()
			saveSContent("final", content)
			break
		case ADMIT:
			content = $('#datepicker').val()
			if (content != $("#editcell").data("content")) {
				if (!content) {
					content = null
					saveSContent("admit", content)
				}
				if (ISODATE.test(content)) {
					saveSContent("admit", content)
				}
			}
			$('#datepicker').hide()
			break
		case DISCHARGE:
			content = $('#datepicker').val()
			if (content != $("#editcell").data("content")) {
				if (!content) {
					content = null
					saveSContent("discharge", content)
				}
				if (ISODATE.test(content)) {
					saveSContent("discharge", content)
				}
			}
			$('#datepicker').hide()
			break
	}
}

function saveSContent(column, content)	//column name in MYSQL
{
	var $editTR = $($("#editcell").data("editRow"))
	var qn = $editTR.children("td").eq(SQN).html()
	var fromDate = $('#monthpicker').data('fromDate')
	var toDate = $('#monthpicker').data('toDate')
	var pointing = $("#editcell").data("pointing")

	if (content == $("#editcell").data("content")) {
		return
	}
	pointing.innerHTML = content? content : ''	//just for show instantly

	if (content) {
		content = URIcomponent(content)	//take care of white space, double qoute, 
										//single qoute, and back slash
	}
	var sql = "sqlReturnData=UPDATE book SET "
	if (content === null) {	//mysql date field accept null not ""
		sql += column +" = null, editor='"+ THISUSER
	} else {
		sql += column +" = '"+ content + "', editor='"+ THISUSER
	}
	sql += "' WHERE qn = "+ qn +";"
	sql += "SELECT * FROM book WHERE qn = "+ qn +";"

	Ajax(MYSQLIPHP, sql, callbacksaveSContent);

	function callbacksaveSContent(response)
	{
		if (!response || response.indexOf("DBfailed") != -1)
		{
			alert("Failed! update database \n\n" + response)
			pointing.innerHTML = $("#editcell").data("content")
			//return to previous content
		}
		else
		{
			var fromDate = $('#monthpicker').data('fromDate')
			var toDate = $('#monthpicker').data('toDate')
			var thisrow = JSON.parse(response)

			$editTR[0].className = countService(thisrow[0], fromDate, toDate)

			//No refill because it may make next editTD return to old value
			//when fast entry, due to slow return from Ajax
		}
	}
}

function storePresentScell(pointing)
{
	var cindex = pointing.cellIndex

	switch(cindex)
	{
		case CASE:
		case PATIENT:
			$('#datepicker').hide()
			$('#datepicker').datepicker( 'hide' )
			clearEditcellData("hide")
			break
		case SDIAGNOSIS:
		case STREATMENT:
		case ADMISSION:
		case FINAL:
			$('#datepicker').hide()
			$('#datepicker').datepicker( 'hide' )
			createEditcell(pointing)
			saveDataPoint("#editcell", pointing)
			break
		case ADMIT:
		case DISCHARGE:
			$('#editcell').hide()
			saveDataPoint("#editcell", pointing)
			selectDate(pointing)
			break
	}
}

function selectDate(pointing)
{
	$('#datepicker').css({
		height: $(pointing).height(),
		width: $(pointing).width()
	})
	reposition("#datepicker", "center", "center", pointing)

	$('#datepicker').datepicker( {
		dateFormat: "yy-mm-dd",
		minDate: "-1y",
		maxDate: "+1y",
		onClose: function () {
			$('.ui-datepicker').css( {
				fontSize: ''
			})//.hide()
//			$(pointing).html($('#datepicker').val())
			savePreviousScell() 
		}
	})
	$('#datepicker').datepicker("setDate", $(pointing).html()
												? new Date($(pointing).html()) 
												: $('#monthpicking').val())
	$('.ui-datepicker').css( {
		fontSize: '12px'
	})
	$('#datepicker').datepicker( 'show' )
}

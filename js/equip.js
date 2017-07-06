
function fillEquipTableToday()
{
	var opdate = (new Date()).ISOdate()
	var q = findOpdateBOOKrow(opdate)
	var i = 1

	while (q < BOOK.length || BOOK[q].opdate == opdate) {
		fillEquipToday(q, i)
		q++
		i++
	}
}

function fillEquipToday(q, i)
{
	var bookq = BOOK[q]
	var bookqEquip = bookq.equipment

	document.getElementById("opdate").innerHTML = putOpdate(bookq.opdate)
	document.getElementById("staffname").innerHTML = bookq.staffname
	document.getElementById("hn").innerHTML = bookq.hn
	document.getElementById("patientname").innerHTML = bookq.patient
	document.getElementById("age").innerHTML = putAgeOpdate(bookq.dob, bookq.opdate)
	document.getElementById("diagnosis").innerHTML = bookq.diagnosis
	document.getElementById("treatment").innerHTML = bookq.treatment

	$('#dialogEquip input').prop('checked', false)
	$('#dialogEquip input').val('')
	$('#dialogEquip input[type=text]').prop('disabled', false)//make it easier to see

	if ( bookqEquip ) {			// If any, fill checked & others
		$.each(JSON.parse(bookqEquip), function(key, val) {
			if (val == 'checked') {
				$("#"+ key).prop("checked", true)	//radio and checkbox
			} else {
				$("#"+ key).val(val)	//Other1...8
			}
		});
		showNonEditableEquip(qn, bookqEquip)
		getEditedby(qn)
 	} else {
		showEditableEquip(qn, bookqEquip)
		document.getElementById("editedby").innerHTML = ""
	}

	var dialogEquip + "i" = document.createElement("div").html($('#dialogEquip').html())
	var dialogEquip = dialogEquip + "i"
	dialogEquip.getElementById("opdate").id = ""
	dialogEquip.getElementById("staffname").id = ""
	dialogEquip.getElementById("hn").id = ""
	dialogEquip.getElementById("patientname").id = ""
	dialogEquip.getElementById("age").innerHTML = id = ""
	dialogEquip.getElementById("diagnosis").id = ""
	dialogEquip.getElementById("treatment").id = ""
	$(dialogEquip).dialog({
		title: "เครื่องมือผ่าตัด",
		closeOnEscape: true,
		modal: true,
		width: 800,
		height: window.innerHeight,
		open: function(event, ui) {
			$("input").blur();	//disable default autofocus on text input
		}
	})
}

function fillEquipTable(qn)
{
	var q = findBOOKrow(qn)
	var bookq = BOOK[q]
	var bookqEquip = bookq.equipment

	document.getElementById("opdate").innerHTML = putOpdate(bookq.opdate)
	document.getElementById("staffname").innerHTML = bookq.staffname
	document.getElementById("hn").innerHTML = bookq.hn
	document.getElementById("patientname").innerHTML = bookq.patient
	document.getElementById("age").innerHTML = putAgeOpdate(bookq.dob, bookq.opdate)
	document.getElementById("diagnosis").innerHTML = bookq.diagnosis
	document.getElementById("treatment").innerHTML = bookq.treatment

	$('#dialogEquip').show()
	$('#dialogEquip input').prop('checked', false)
	$('#dialogEquip input').val('')
	$('#dialogEquip input[type=text]').prop('disabled', false)//make it easier to see
	$('#clearPosition').click(function() {	//uncheck radio button of all Positions
		$('#dialogEquip input[name=pose]').prop('checked', false)
	})
	$('#clearShunt').click(function() {	//uncheck radio button of all Shunts
		$('#dialogEquip input[name=head]').prop('checked', false)
		$('#dialogEquip input[name=peritoneum]').prop('checked', false)
		$('#dialogEquip input[name=program]').prop('checked', false)
	})

	if ( bookqEquip ) {			// If any, fill checked & others
		$.each(JSON.parse(bookqEquip), function(key, val) {
			if (val == 'checked') {
				$("#"+ key).prop("checked", true)	//radio and checkbox
			} else {
				$("#"+ key).val(val)	//Other1...8
			}
		});
		showNonEditableEquip(qn, bookqEquip)
		getEditedby(qn)
 	} else {
		showEditableEquip(qn, bookqEquip)
		document.getElementById("editedby").innerHTML = ""
	}
	var height = window.innerHeight
	if (height > 800) {
		height = 800
	}
	$('#dialogEquip').dialog({
		title: "เครื่องมือผ่าตัด",
		closeOnEscape: true,
		modal: true,
		width: 750,
		height: height,
		open: function(event, ui) {
			$("input").blur();	//disable default autofocus on text input
		}
	})
}

function showNonEditableEquip(qn, bookqEquip)
{
	$('#dialogEquip').dialog("option", "buttons", [
		{
			text: "แก้ไข",
			width: "100",
			click: function () {
				showEditableEquip(qn, bookqEquip)
			}
		},
		{
			text: "Print",
			width: "100",
			click: function () {
				printpaper(qn);
			}
		}
	]);
	$('#dialogEquip input[type=radio]').prop("disabled", true)
	$('#dialogEquip input[type=text]').click(function() {
		$(this).prop('disabled', true)
	})
	$('#dialogEquip input').click(function() {
		return false
	})
}

function showEditableEquip(qn, bookqEquip)
{
	$('#dialogEquip').dialog("option", "buttons", [
		{
			text: "Save",
			width: "100",
			click: function () {
				Checklistequip(qn, bookqEquip)
				showNonEditableEquip(qn, bookqEquip)
			}
		},
		{
			text: "Print",
			width: "100",
			click: function () {
				printpaper(qn);
			}
		}
	]);
	$('#dialogEquip input').prop('disabled', false)
	$('#dialogEquip input').off("click")
}

function getEditedby(qn)
{
	var sql = "sqlReturnData=SELECT editor, editdatetime FROM bookhistory "
	sql += "WHERE qn="+ qn + " AND equipment <> '';"

	Ajax(MYSQLIPHP, sql, callbackgetEditedby)

	function callbackgetEditedby(response)
		{
			if (!response || response.indexOf("DBfailed") != -1) {
				alert("getEditedby", response)
			} else {
				var Editedby = ""
				$.each(JSON.parse(response), function(key, val) {
					Editedby += (val.editor + " : " + val.editdatetime + "<br>")
				});
				document.getElementById("editedby").innerHTML = Editedby
			}
		}
}

function Checklistequip(qn, bookqEquip) 
{
	var equipment = {}
	$( "#dialogEquip input:checked" ).each( function() {
		equipment[this.id] = "checked"
	})
	$("#dialogEquip input[type=text]").each(function() {
		if (this.value) {
			equipment[this.id] = this.value
		}
	})
	equipment = JSON.stringify(equipment)
	if (equipment == bookqEquip) {
		return
	}
	var sql = "UPDATE book SET ";
	sql += "equipment='"+ equipment +"' ,";
	sql += "editor='"+ THISUSER +"' ";
	sql += "WHERE qn="+ qn +";"

	Ajax(MYSQLIPHP, "sqlReturnbook="+ sql, callbackEq);

	function callbackEq(response)
	{
		if (!response || response.indexOf("QTIME") == -1)
		{
			alert("Checklistequip", response)
		}
		else	//there is some change
		{
			updateBOOK(response)
		}
	}
}

function printpaper(qn)	//*** have to set equip padding to top:70px; bottom:70px
{
	if (/Edge|MS/.test(navigator.userAgent)) {
		var orgEquip = document.getElementById('dialogEquip');
		orgEquip.style.paddingLeft = 0 + "px"
		orgEquip.style.marginLeft = 0 + "px"
		var win = window.open();
		win.document.open();
		win.document.write('<LINK type="text/css" rel="stylesheet" href="css/print.css">');
		win.document.writeln(orgEquip.outerHTML);
		win.document.getElementById('dialogEquip').id = "printEquip" 

		var newEquip = orgEquip.getElementsByTagName("INPUT");
		var winEquip = win.document.getElementById('printEquip').getElementsByTagName("INPUT");
		for (var i = 0; i < newEquip.length; i++) 
		{
			if (newEquip[i].checked) {
				winEquip[i].checked = newEquip[i].checked
			}
			else if (newEquip[i].value) {
				winEquip[i].value = newEquip[i].value
			}
			else {	//pale color for no input items
				temp = winEquip[i]
				while (temp.nodeName != "SPAN")
					temp = temp.parentNode
				temp.className = "pale"
			}
		}

		win.document.close();
		win.focus();
		win.print();
		win.close();
	}
	else {
		var original = document.body.innerHTML;
		var orgEquip = document.getElementById('dialogEquip');
		orgEquip.style.height = orgEquip.offsetHeight + 200 + "px"
		orgEquip.style.width = orgEquip.offsetWidth + 100 + "px"
		orgEquip.style.paddingLeft = 0 + "px"
		orgEquip.style.marginLeft = 0 + "px"
		document.body.innerHTML = orgEquip.outerHTML;
		var dialogEquip = document.getElementById('dialogEquip');

		var newEquip = orgEquip.getElementsByTagName("INPUT");
		var winEquip = dialogEquip.getElementsByTagName("INPUT");

		for (var i = 0; i < newEquip.length; i++) 
		{
			if (newEquip[i].checked) {
				winEquip[i].checked = newEquip[i].checked
			}
			else if (newEquip[i].value) {
				winEquip[i].value = newEquip[i].value
			}
			else {	//pale color for no input items
				temp = winEquip[i]
				while (temp.nodeName != "SPAN")
					temp = temp.parentNode
				temp.className = "pale"
			}
		}

		window.print();
		document.body.innerHTML = original;
		document.getElementById('dialogEquip').scrollIntoView(true);
		location.reload();
	}
}

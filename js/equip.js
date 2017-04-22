
function fillEquipTable(rownum, qn)
{
	var table = document.getElementById("tbl")
	var rowmain = table.rows[rownum]
	var opdate = rowmain.cells[OPDATE].innerHTML
	var staffname = rowmain.cells[STAFFNAME].innerHTML
	var hn = rowmain.cells[HN].innerHTML
	var patientname = rowmain.cells[NAME].innerHTML
	var age = rowmain.cells[AGE].innerHTML
	var diagnosis = rowmain.cells[DIAGNOSIS].innerHTML
	var treatment = rowmain.cells[TREATMENT].innerHTML
	var equipOR = document.getElementById("paperdiv")

	var txt = "<div id='equip'>";
	txt += "<span style='width:250px;'></span>วันที่ ";
	txt += "<span style='width:120px; font-size: 14px; font-weight: bold;'); >"+ opdate +"</span>";
	txt += "<span style='width:20px;'></span>Surgeon "+ staffname;
	txt += "<br>";
	txt += "<span style='width:100px;'>ชื่อ-นามสกุล</span>"+ patientname;
	txt += "<span style='width:20px;'></span>อายุ "+ age;
	txt += "<span style='width:20px;'></span>HN "+ hn;
	txt += "<br>";
	txt += "<span style='width:100px;'>Diagnosis</span>"+ diagnosis;
	txt += "<br>";
	txt += "<span style='width:100px;'>Operation</span>"+ treatment;
	txt += "<br>";
	txt += "<span style='width:120px;'>Position </span>";
	txt += "<span style='width:60px;'><label><input type='radio' name='pose' id='prone'>คว่ำ</label></span>";
	txt += "<span style='width:60px;'><label><input type='radio' name='pose' id='supine'>หงาย</label></span>";
	txt += "<span style='width:120px;'><label><input type='radio' name='pose' id='rightLateral'>ตะแคงขวาลง</label></span>";
	txt += "<span style='width:120px;'><label><input type='radio' name='pose' id='leftLateral'>ตะแคงซ้ายลง</label></span>";
	txt += "<span>อื่นๆ<input type='text' size='7' id='position'></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'></span>";
	txt += "<span><label><input type='radio' name='pay' id='selfpay'><i>**ผู้ป่วยและญาติสามารถ<b><u>จ่ายส่วนเกินได้ </b></u>(เบิกไม่ได้)</i>**</label></span>";
	txt += "<span style='width:10px;'></span>";
	txt += "<span><label><input type='radio' name='pay' id='nopay'><i>จ่ายไม่ได้ </i></label></span>";
	txt += "<br>";
	txt += "<br>";
	txt += "<span style='width:120px;'>1.Imaging</span>";
	txt += "<span style='width:60px;'><label><input type='checkbox' id='iMRI'>iMRI</label></span>";
	txt += "<span style='width:60px;'><label><input type='checkbox' id='iCT'>iCT</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Navigator'>Navigator</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Fluoroscope'>Fluoroscope</label></span>";
	txt += "<span>อื่นๆ<input type='text' size='7' id='Other1'></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'>2.อุปกรณ์ยึดศีรษะ</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Mayfield'>Mayfield</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Horseshoe'>Horseshoe</label></span>";
	txt += "<span>อื่นๆ<input type='text' size='7' id='Other2'></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'>3.เครื่องตัดกระดูก</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='HighSpeedDrill'>High Speed Drill</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='SagittalSaw'>Sagittal Saw</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Osteotome'>Osteotome</label></span>";
	txt += "<span>อื่นๆ<input type='text' size='7' id='Other3'></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'>4.กล้อง</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Microscope'>Microscope</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='ICG'>ICG</label></span>";
	txt += "<span><label><input type='checkbox' id='Endoscope'>Endoscope</label></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'>5.CUSA</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Excell'>Excell</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Soring'>Soring</label></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'>6.Retractor</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Leylar'>Leylar</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Halo'>Halo</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Greenberg'>Greenberg</label></span>";
	txt += "<span>อื่นๆ<input type='text' size='7' id='Other4'></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'>7.U/S</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='Ultrasound'>Ultrasound</label></span>";
	txt += "<span><label><input type='checkbox' id='Doppler'>Doppler</label></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'>8.Shunt</span>";
	txt += "<span style='width:80px;'>Pudenz</span>";
	txt += "<span style='width:40px;'>หัว</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='proximalLow'>low</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='proximalMedium'>medium</label></span>";
	txt += "<span><label><input type='checkbox' id='proximalHigh'>high</label></span>";
	txt += "<br>";
	txt += "<span style='width:200px;'></span>";
	txt += "<span style='width:40px;'>ท้อง</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='distalLow'>low</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='distalMedium'>medium</label></span>";
	txt += "<span><label><input type='checkbox' id='distalHigh'>high</label></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'></span>";
	txt += "<span style='width:120px;'>Programmable</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='shuntMedtronic'>Medtronic</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='shuntCodman'>Codman</label></span>";
	txt += "<span>อื่นๆ<input type='text' size='7' id='Other5'></span>";
	txt += "<br>";
	txt += "<span style='width:160px;'>9.เครื่องมือของบริษัท </span>เวลาส่งเครื่อง ";
	txt += "<span><input type='text' size='4' id='equiptime'></span>น ";
	txt += "<span style='width:20px;'></span>";
	txt += "<span><input type='text' size='25' id='Other6'></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'>10.อุปกรณ์อื่นๆ</span>";
	txt += "<span style='width:150px;'><label><input type='checkbox' id='CranioplasticCement'>Cranioplastic cement</label></span>";
	txt += "<span style='width:150px;'><label><input type='checkbox' id='artificialSkull'>MTEC artificial skull</label></span>";
	txt += "<span>อื่นๆ<input type='text' size='7' id='Other7'></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'>11.Monitor</span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='CN5'>CN5</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='CN6'>CN6</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='CN7'>CN7</label></span>";
	txt += "<span><label><input type='checkbox' id='CN8-BAER'>CN8 (BAER)</label></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='CN9'>CN9</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='CN10'>CN10</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='SSEP'>SSEP</label></span>";
	txt += "<span><label><input type='checkbox' id='MEP'>MEP</label></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='DirectStim'>Direct Stim</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='PhaseReversal'>Phase Reversal</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='ECOG'>ECoG</label></span>";
	txt += "<span><label><input type='checkbox' id='EEG'>EEG</label></span>";
	txt += "<br>";
	txt += "<span style='width:120px;'></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='EMG'>EMG</label></span>";
	txt += "<span style='width:120px;'><label><input type='checkbox' id='D-wave'>D-wave</label></span>";
	txt += "<span>อื่นๆ<input type='text' size='7' id='Other8'></span>";
	txt += "<br>";
	txt += "<br>";
	txt += "<button onclick=saveequip("+ qn +")> SAVE </button>";
	txt += "<span style='width:20px;'></span>";
	txt += "<button onclick=printpaper("+ qn +")> Print </button>";
	txt += "<span style='width:20px;'></span>";
	txt += "<button onClick=cancelset()> Close </button>";
	txt += "<br>";
	txt += "<br>";
	txt += "</div>";

	equipOR.innerHTML = txt;
	equipOR.style.display = "block"
	equipOR.style.top = "0px"
	equipOR.style.left = rowmain.cells[OPDATE].offsetWidth +"px"	//show first column
	equipOR.style.overflowY = "auto"
	equipOR.style.fontSize = "12px"
	if (equipOR.offsetHeight > window.innerHeight)
		equipOR.style.height = window.innerHeight - 60 +"px"

	var q = 0

	while (BOOK[q].qn != qn)	//find the case
		q++

	if ( BOOK[q].equipment )
	{								//fill checked equip if any
		$.each(JSON.parse(BOOK[q].equipment), function(key, val){
			if (val == 'checked')
				$("#"+ key).prop("checked", true)
			else
				$("#"+ key).val(val)
		});

 	}
}

function saveequip(qn) 
{
	Checklistequip(qn)
	$("#paperdiv").hide()
}

function cancelset()
{
	$("#paperdiv").hide()
}

function Checklistequip(qn) 
{
	var equipment = {}
	$( "input:checked" ).each( function() {
		equipment[this.id] = "checked"
	})
	$('input[type=text]').each(function() {
		if (this.value)
			equipment[this.id] = this.value
	})
	equipment = JSON.stringify(equipment)

	var sql = "UPDATE book SET ";
	sql += "equipment='"+ equipment +"' ,";
	sql += "editor='"+ THISUSER +"' ";
	sql += "WHERE qn="+ qn +";"

	Ajax(MYSQLIPHP, "sqlReturnbook="+ sql, callbackEq);

	function callbackEq(response)
	{
		if (!response || response.indexOf("QTIME") == -1)
		{
			alert("Failed! update database \n\n" + response)
		}
		else	//there is some change
		{
			updateBOOK(response)
		}
	}
}

function printpaper(qn)	//*** have to set paperdiv padding to top:70px; bottom:70px
{
	if (/Edge | MS/.test(navigator.userAgent)) {
		var equip = document.getElementById('equip');
		var win = window.open();
		win.document.open();
		win.document.write('<LINK type="text/css" rel="stylesheet" href="print.css">');
		win.document.writeln(equip.outerHTML);

		var newequip = equip.getElementsByTagName("INPUT");
		var winequip = win.equip.getElementsByTagName("INPUT");
		for (var i = 0; i < newequip.length; i++) 
		{
			winequip[i].checked = newequip[i].checked
			winequip[i].value = newequip[i].value
			if (!winequip[i].checked || !winequip[i].value)
			{	//pale color for no input items
				temp = winequip[i]
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
		var orgequip = document.getElementById('equip');
		document.body.innerHTML = orgequip.outerHTML;
		var equip = document.getElementById('equip');

		var newequip = orgequip.getElementsByTagName("INPUT");
		var winequip = equip.getElementsByTagName("INPUT");
		for (var i = 0; i < newequip.length; i++) 
		{
			winequip[i].checked = newequip[i].checked
			winequip[i].value = newequip[i].value
			if (!winequip[i].checked || !winequip[i].value)
			{	//pale color for no input items
				temp = winequip[i]
				while (temp.nodeName != "SPAN")
					temp = temp.parentNode
				temp.className = "pale"
			}
		}

		window.print();
		document.body.innerHTML = original;
		document.getElementById('equip').scrollIntoView(true);
		location.reload();
	}
}
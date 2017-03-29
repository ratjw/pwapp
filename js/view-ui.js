
function DragDrop()
{
	$("#tbl tr:has(td)").draggable({
		revert: "true",
		helper: function(){
					var copy = $(this).clone();
					copy.find("td").css({
						"fontSize": "14px",
						"border": "solid 1px silver",
					})
					return copy;
				},
		appendTo: 'body',
		stack: ".ui-draggable",
		zIndex: 1000,
		start : function (event) {
			$("#editcell").hide()
			$(".ui-menu").hide()
		}
	});

	$("#tbl tr:has(td)").droppable({
		accept: "tr:has(td)",

		over: function (event, ui){
			if ($(ui.helper).position().top < 50) {
				$('#tblcontainer').animate({
					scrollTop: $('#tblcontainer').scrollTop() - 200
				}, 200);
			}
			if ($(ui.helper).position().top > $('#tblcontainer').innerHeight() - 50) {
				$('#tblcontainer').animate({
					scrollTop: $('#tblcontainer').scrollTop() + 200
				}, 200);
			}
		},

		drop: function (event, ui) {
			
			var dragTable = $(ui.draggable).closest("table").attr("id")
			var dragcell = $(ui.draggable).children("td")
			var dropcell = $(this).children("td")
			var prevcell = $(this).prev().children("td")
			var staffname = dragcell.eq(STAFFNAME).html()
			var dragqn = dragcell.eq(QN).html()
			var dropDate = dropcell.eq(OPDATE).html().numDate()
			var dropqn = dropcell.eq(QN).html()

			if (!dragqn)
				return false

			var finalWaitnum = getfinalWaitnum(prevcell, dropqn, dropDate)

			var sql = "sqlReturnbook=UPDATE book SET Waitnum = "+ finalWaitnum
			sql += ", opdate='" + dropDate
			sql += "', editor='"+ THISUSER
			sql += "' WHERE qn="+ dragqn +";"

			Ajax(MYSQLIPHP, sql, callbackDragDrop);

			function callbackDragDrop(response)
			{
				if (!response || response.indexOf("DBfailed") != -1)
				{
					alert ("Move failed!\n" + response)
				}
				else
				{
					updateBOOK(response)
					refillall()
					DragDrop()
					if (dragTable == "queuetbl")
						staffqueue(staffname)
				}
			}
		}
	});
}

function sortable(id)
{
	var fixHelperModified = function(e, tr) {
		var original = tr.children();
		var helper = tr.clone();
		helper.children().each(function(index)
		{
		  $(this).width(original.eq(index).width())
		});
		return helper;
	};
//	var prevplaceholder
//	var thisplaceholder

	$(id + " tbody").sortable({
		items: "> tr:has(td)",
		start: function(e, ui){
			ui.placeholder.height(ui.item.height());
		},
		forceHelperSize: true,
		forcePlaceholderSize: true,
		helper: fixHelperModified
//		change: function(e, ui){
//			prevplaceholder = thisplaceholder
//			thisplaceholder = ui.placeholder.index()
//		},
	}).droppable({
		accept: "tr:has(td)",
/*
		over: function (event, ui){
			if ($(ui.helper).position().top < 50) {
				$('#tblcontainer').animate({
					scrollTop: $('#tblcontainer').scrollTop() - 200
				}, 200);
			}
			if ($(ui.helper).position().top > $('#tblcontainer').innerHeight() - 50) {
				$('#tblcontainer').animate({
					scrollTop: $('#tblcontainer').scrollTop() + 200
				}, 200);
			}
		},
*/
		drop: function (event, ui) {
			
			var dragTable = ui.item.closest("table").attr("id")
			var dragcell = ui.item.children("td")
			var dropcell = $(this).children("td")
			var prevcell = $(this).prev().children("td")
			var staffname = dragcell.eq(STAFFNAME).html()
			var dragqn = dragcell.eq(QN).html()
			var dropDate = dropcell.eq(OPDATE).html().numDate()
			var dropqn = dropcell.eq(QN).html()

			if (!dragqn)
				return false

			var finalWaitnum = getfinalWaitnum(prevcell, dropqn, dropDate)

			var sql = "sqlReturnbook=UPDATE book SET Waitnum = "+ finalWaitnum
			sql += ", opdate='" + opdate
			sql += "', editor='"+ THISUSER
			sql += "' WHERE qn="+ dragqn +";"

			Ajax(MYSQLIPHP, sql, callbackDragDropStaff);

			function callbackDragDropStaff(response)
			{
				if (!response || response.indexOf("DBfailed") != -1)
				{
					alert ("Move failed!\n" + response)
					$( id + " tbody" ).sortable( "cancel" )
				}
				else
				{
					updateBOOK(response);
					$( id + " tbody" ).sortable( "refreshPositions" )
				}
			}
		}
	})
}

function getfinalWaitnum(prevcell, dropDate)
{  
	var prevDate
	if (!(prevDate = prevcell.eq(OPDATE).html()))	//undefined
		return 1		//no case in this date
	if (prevDate != dropDate) {
		return 1		//no case in this date
	} else {
		var prevqn = prevcell.eq(QN).html()	//case in this date
		caseNum = findcaseNum(prevqn)	//look in BOOK
		return finalWaitnum(caseNum, dropDate)
	}
}

function findcaseNum(qn)
{  
	var i = 0
	while (i < BOOK.length && BOOK[i].qn != qn)
		i++

	return i
}

function finalWaitnum(caseNum, dropDate)
{  
	var dropWaitnum = Number(BOOK[caseNum].waitnum)
	caseNum++
	if ((caseNum > BOOK.length - 1) ||
		(BOOK[caseNum].opdate != dropDate)) {
		return dropWaitnum + 1
	} else {
		var nextWaitnum = Number(BOOK[caseNum].waitnum)
		return (nextWaitnum + dropWaitnum) / 2
	}
}

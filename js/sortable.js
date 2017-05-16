function sortable()
{
	$("#tbl tbody, #queuetbl tbody").sortable({
		items: "tr",
		connectWith: "#tbl tbody, #queuetbl tbody",
		start: function(e, ui){
			clearTimeout(TIMER);
			$('#menu').hide();
			$('#stafflist').hide();
			clearEditcellData("hide");
			ui.placeholder.innerHeight(ui.item.outerHeight())
			ui.placeholder.attr('data-thisindex', ui.placeholder.index());
			ui.item.attr("data-sender", ui.item.closest('table').attr('id'))
		},
		forceHelperSize: true,
		forcePlaceholderSize: true,
		change: function(e, ui){
			ui.placeholder.attr('data-previndex', ui.placeholder.attr('data-thisindex'));
			ui.placeholder.attr('data-thisindex', ui.placeholder.index());
		},
		delay: 150,
		revert: true,
		stop: function(e, ui){
			var receiver = ui.item.closest('table').attr('id')
				
			if (!ui.item.children().eq(QN).html()) {
				return false
			}

			if (receiver == "queuetbl") {
				if (ui.item.children().eq(STAFFNAME).html() != $('#titlename').html()) {
					return false
				}
				if (ui.item.attr("data-sender") == "tbl") {
					ui.item.children().eq(STAFFNAME).css("display", "none")
				}
			} else {	//receiver == "tbl"
				if (ui.item.attr("data-sender") == "queuetbl") {
					ui.item.children().eq(STAFFNAME).css("display", "block")
				}
			}

			var thisdrop
			var previtem = ui.item.prev()
			var thisitem = ui.item
			var nextitem = ui.item.next()
			if (!previtem.length || previtem.has('th').length) {
				thisdrop = nextitem
			} else {
				if (!nextitem.length || nextitem.has('th').length) {
					thisdrop = previtem
				} else {
					var helperpos = ui.offset.top	//ui.offset (no '()') = helper position
					var prevpos = previtem.offset().top
					var thispos = thisitem.offset().top
					var nextpos = nextitem.offset().top
					var nearprev = Math.abs(helperpos - prevpos)
					var nearplace = Math.abs(helperpos - thispos)
					var nearnext = Math.abs(helperpos - nextpos)
					var nearest = Math.min(nearprev, nearplace, nearnext)
					if (nearest == nearprev) 
						thisdrop = previtem
					if (nearest == nearnext) 
						thisdrop = nextitem
					if (nearest == nearplace) 
						if (ui.placeholder.attr('data-previndex') < 
							ui.placeholder.attr('data-thisindex'))
							thisdrop = previtem
						else
							thisdrop = nextitem
				}
			}

			var thisopdate = getOpdate(thisdrop.children("td").eq(OPDATE).html())
			var staffname = thisitem.children("td").eq(STAFFNAME).html()
			var finalWaitnum = getWaitnum(thisopdate, staffname)
			var thisqn = thisitem.children("td").eq(QN).html()

			var sql = "sqlReturnbook=UPDATE book SET Waitnum = "+ finalWaitnum
			sql += ", opdate='" + thisopdate
			sql += "', editor='"+ THISUSER
			sql += "' WHERE qn="+ thisqn +";"

			Ajax(MYSQLIPHP, sql, callbacksortable);

			thisitem[0].title = finalWaitnum
			ui.item.children().eq(STAFFNAME).css("height", thisdrop.height())

			function callbacksortable(response)
			{
				if (!response || response.indexOf("DBfailed") != -1)
				{
					alert ("Move failed!\n" + response)
					$("#tbl tbody" ).sortable( "cancel" )
				}
				else
				{
					updateBOOK(response)
					if (receiver == "tbl") {
//						requestAnimationFrame(refillall())
						refillall()
						if (($("#titlecontainer").css('display') == 'block') && 
							($('#titlename').html() == staffname)) {

//						requestAnimationFrame(refillstaffqueue())								
						refillstaffqueue()
						}
					} else {
//						requestAnimationFrame(refillstaffqueue())
						refillstaffqueue()
//						requestAnimationFrame(refillall())
						refillall()
					}
				}
			}
			TIMER = setTimeout("updating()",10000);	//poke next 10 sec.
			$('#editcell').hide()
			//after sorting, sometimes editcell is placed at row 0 column 1
			//but display at placeholder position in entire width
		}
	})
}

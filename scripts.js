$(document).ready(function() {
  	$.getJSON("dane.json", function(data) {

		// Add JSON data to table
		var employeeList = "";
		$.each(data, function(key, value) {
			employeeList += "<tr>";
			employeeList += "<td>"+value.id+"</td>";
			employeeList += "<td>"+value.firstName+"</td>";
			employeeList += "<td>"+value.lastName+"</td>";
			employeeList += "<td>"+value.dateOfBirth+"</td>";
			employeeList += "<td>"+value.company+"</td>";
			employeeList += "<td>"+value.note+"</td>";
			employeeList += "</tr>";
		})
		
		$("tbody").append(employeeList);
		
		var myTable = "#myTable";
		var myTableBody = myTable + " tbody";
		var myTableRows = myTableBody + " tr";
		var myTableColumn = myTable + " th";

		function initTable() {
			$(myTableBody).attr("data-pageSize", 5);
			$(myTableBody).attr("data-firstRecord", 0);
			$(myTableColumn).eq(0).addClass("sorted-asc");

			sortTable($(myTable), 0, "asc");

			paginate(parseInt($(myTableBody).attr("data-firstRecord"), 10),
					parseInt($(myTableBody).attr("data-pageSize"), 10));
		}


		// Table sorting function
		function sortTable(table, column, order) {
			var asc = order === 'asc';
			var tbody = table.find('tbody');

			tbody.find('tr').sort(function (a, b) {
				if (asc) {
					return $('td:eq(' + column + ')', a).text()
						.localeCompare($('td:eq(' + column + ')', b).text());
				} else {
					return $('td:eq(' + column + ')', b).text()
						.localeCompare($('td:eq(' + column + ')', a).text());
				}
			}).appendTo(tbody);
		}

		// Heading click
		$(myTableColumn).click(function () {
			$(myTableColumn).not($(this)).removeClass("sorted-asc sorted-desc");

			if ($(this).hasClass("sorted-asc") || $(this).hasClass("sorted-desc")) {
				$(this).toggleClass("sorted-asc sorted-desc");
			} else {
				$(this).addClass("sorted-asc");
			}

			$(myTableRows).show();

			sortTable($(myTable), $(this).index(), $(this).hasClass("sorted-asc") ? "asc" : "desc");

			paginate(parseInt($(myTableBody).attr("data-firstRecord"), 10),
					parseInt($(myTableBody).attr("data-pageSize"), 10));
		});

		// Pager click
		$("a.paginate").click(function (e) {
			e.preventDefault();
			var tableRows = $(myTableRows);
			var tmpRec = parseInt($(myTableBody).attr("data-firstRecord"), 10);
			var pageSize = parseInt($(myTableBody).attr("data-pageSize"), 10);

			if ($(this).attr("id") == "next") {
				tmpRec += pageSize;
			} else {
				tmpRec -= pageSize;
			}

			if (tmpRec < 0 || tmpRec > tableRows.length) return

			$(myTableBody).attr("data-firstRecord", tmpRec);
			paginate(tmpRec, pageSize);
		});

		// Paging function
		var paginate = function (start, size) {
			var tableRows = $(myTableRows);
			var end = start + size;

			tableRows.hide();

			tableRows.slice(start, end).show();

			$(".paginate").show();

			if (tableRows.eq(0).is(":visible")) {
				$('#previous').addClass('disabled');
				$('#next').removeClass('disabled');
			};

			if (tableRows.eq(tableRows.length - 1).is(":visible")) {
				$('#next').addClass('disabled');
				$('#previous').removeClass('disabled');
			};
		}		

		initTable();
	});
});
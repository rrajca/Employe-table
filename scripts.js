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
		

		// Selectors for future use
		var myTable = "#myTable";
		var myTableBody = myTable + " tbody";
		var myTableRows = myTableBody + " tr";
		var myTableColumn = myTable + " th";

		// Starting table state
		function initTable() {
			$(myTableBody).attr("data-pageSize", 5);
			$(myTableBody).attr("data-firstRecord", 0);

			// Set the first column as sorted ascending
			$(myTableColumn).eq(0).addClass("sorted-asc");

			//Sort the table using the current sorting order
			sortTable($(myTable), 0, "asc");

			// Start the pagination
			paginate(parseInt($(myTableBody).attr("data-firstRecord"), 10),
					parseInt($(myTableBody).attr("data-pageSize"), 10));
		}


		// Table sorting function
		function sortTable(table, column, order) {
			var asc = order === 'asc';
			var tbody = table.find('tbody');

			// Sort the table using a custom sorting function by switching 
			// the rows order, then append them to the table body
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

			// Remove the sort classes for all the column, but not the first
			$(myTableColumn).not($(this)).removeClass("sorted-asc sorted-desc");

			// Set or change the sort direction
			if ($(this).hasClass("sorted-asc") || $(this).hasClass("sorted-desc")) {
				$(this).toggleClass("sorted-asc sorted-desc");
			} else {
				$(this).addClass("sorted-asc");
			}

			// Set the complete list of rows as visible
			$(myTableRows).show();

			//Sort the table using the current sorting order
			sortTable($(myTable), $(this).index(), $(this).hasClass("sorted-asc") ? "asc" : "desc");

			// Start the pagination
			paginate(parseInt($(myTableBody).attr("data-firstRecord"), 10),
					parseInt($(myTableBody).attr("data-pageSize"), 10));
		});

		// Pager click
		$("a.paginate").click(function (e) {
			e.preventDefault();
			var tableRows = $(myTableRows);
			var tmpRec = parseInt($(myTableBody).attr("data-firstRecord"), 10);
			var pageSize = parseInt($(myTableBody).attr("data-pageSize"), 10);

			// Define the new first record
			if ($(this).attr("id") == "next") {
				tmpRec += pageSize;
			} else {
				tmpRec -= pageSize;
			}
			// The first record is < of 0 or > of total rows
			if (tmpRec < 0 || tmpRec > tableRows.length) return

			$(myTableBody).attr("data-firstRecord", tmpRec);
			paginate(tmpRec, pageSize);
		});

		// Paging function
		var paginate = function (start, size) {
			var tableRows = $(myTableRows);
			var end = start + size;
			// Hide all the rows
			tableRows.hide();
			// Show a reduced set of rows using a range of indices.
			tableRows.slice(start, end).show();
			// Show the pager
			$(".paginate").show();
			// If the first row is visible hide prev
			if (tableRows.eq(0).is(":visible")) {
				$('#previous').addClass('disabled');
				$('#next').removeClass('disabled');
			};
			// If the last row is visible hide next 
			if (tableRows.eq(tableRows.length - 1).is(":visible")) {
				$('#next').addClass('disabled');
				$('#previous').removeClass('disabled');
			};
		}		

		// Table starting state
		initTable();
	});
});
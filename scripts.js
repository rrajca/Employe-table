$(document).ready(function() {
  	$.getJSON("dane.json", function(data) {

// Sort on load by ID
		var sortedList = data.sort(function(a, b) {
			return a.id - b.id;
		});

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
	$('#previous').hide();
	$('#next').show();

	// Increment the table width for sort icon support
	$(myTableColumn).each(function () {
		var width = $(this).width();
		$(this).width(width + 40);
	});

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


















/* // Pagination
$('#myTable').after('<div id="nav"></div>');
var rowsShown = 5;
var rowsTotal = $('#myTable tbody tr').length;
var numPages = rowsTotal/rowsShown;
for(i = 0;i < numPages;i++) {
	var pageNum = i + 1;
	$('#nav').append('<a href="#" rel="'+i+'">'+pageNum+'</a> ');
};
$('#myTable tbody tr').hide();
$('#myTable tbody tr').slice(0, rowsShown).show();
$('#nav a:first').addClass('active');
$('#nav a').on('click', function() {
	$('#nav a').removeClass('active');
	$(this).addClass('active');
	var currPage = $(this).attr('rel');
	var startItem = currPage * rowsShown;
	var endItem = startItem + rowsShown;
	$('#myTable tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
	css('display','table-row').animate({opacity:1}, 300);
});
})
var compare = {                           // Declare compare object
name: function(a, b) {                  // Add a method called name
  a = a.replace(/^the /i, '');          // Remove The from start of parameter
  b = b.replace(/^the /i, '');          // Remove The from start of parameter
  if(parseInt(a) == +a) {
	a = +a;
	b = +b;            
  }     
  return a > b 
},
date: function(a, b) {                  // Add a method called date
  a = new Date(a);                      // New Date object to hold the date
  b = new Date(b);                      // New Date object to hold the date

  return a - b;                         // Return a minus b
}
};

$('.sortable').each(function() {
var $table = $(this);                     // This sortable table
var $tbody = $table.find('tbody');        // Store table body
var $controls = $table.find('th');        // Store table headers
   // Store array containing rows

$controls.on('click', function() {        // When user clicks on a header
  var $header = $(this);
  var $sortIcon = $header.find('i');                  // Get the header
  var order = $header.data('sort');       // Get value of data-sort attribute
  var rows = $tbody.find('tr').toArray();
  var column;                             // Declare variable called column

  // If selected item has ascending or descending class, reverse contents
  if ($header.is('.ascending') || $header.is('.descending')) {  
	$header.toggleClass('ascending descending');    // Toggle to other class
	$tbody.append(rows.reverse());                // Reverse the array
  } else {                                        // Otherwise perform a sort                            
	$header.addClass('ascending');                // Add class to header
	// Remove asc or desc from all other headers
	$header.siblings().removeClass('ascending descending'); 
	if (compare.hasOwnProperty(order)) {  // If compare object has method
	  column = $controls.index(this);         // Search for columnâ€™s index no

	  rows.sort(function(a, b) {               // Call sort() on rows array
		a = $(a).find('td').eq(column).text(); // Get text of column in row a
		b = $(b).find('td').eq(column).text(); // Get text of column in row b
		return compare[order](a, b);           // Call compare method
	  });

	  $tbody.append(rows);
	}
  }
});
}); */
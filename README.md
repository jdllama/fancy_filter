# fancy_filter 

Use:
	<input type="text" id="test" />
	$("#test").fancyFilter();
	Then, when the user clicks the input box "test", the Fancy Filter will open.

Advanced uses:
	Doing it this way makes it a static array. This array will not be updated upon filter generation.
	$("#test").fancyFilter({
		array: [1,2,3,4,5]
	});
	
	The below use lets you run a function to build the array; the function runs whenever the filter is shown.
	$("#test").fancyFilter({
		array: function() {
			return [1,2,3,4,5];
		}
	});
	
	The "complete" function is called after the user clicks the OK button. It passes an array of all the values the user selected.
	$("#test").fancyFilter({
		array: [1,2,3],
		complete: function(arr) {
			console.log(arr);
		}
	});
	
	The "joiner" string is what will join the array in the text box afterward.
	$("#test").fancyFilter({
		array: [1,2,3],
		joiner: "+"
	});
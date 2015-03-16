/*
	Fancy Filter by J.D. Lowe
	Use:
		<input type="text" id="test" />
		$("#test").fancyFilter();
		Then, when the user double clicks the input box "test", the Fancy Filter will open.
	
	Advanced uses:
		doing it this way makes it a static array. This array will not be updated upon filter generation.
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
*/
(function($) {
	$.fn.fancyFilterAll = function() {
		return this.each(function() {
			var obj = $(this);
			obj.triggerHandler("focus");
			var all = obj.parent().find("[data-all=true]");
			var OK = obj.parent().find("[data-OK=true]");
			if(all.length > 0) {
				all.triggerHandler("forceAll");
				OK.triggerHandler("click");
			}
		});
	}
	$.fn.fancyFilter = function(options) {
		var settings = $.extend({
			complete: 	null,
			array: 		null,
			joiner:		","
		}, options);
		return this.each(function() {
			var obj = $(this);
			obj.unbind("focus");
			if(settings.array === null) return;
			obj.focus(function(obj) {
				return function() {
					$("input, select, button").prop("disabled", "disabled");
					//$(this).parentsUntil("[data-label]").find("input, select, button").prop("disabled", "disabled");
					
					if ($(this).width() <= 150) { var xWidth = '150%'; } else { var xWidth = "100%"; }
					var container = $("<container>").appendTo($(this).parent());
					container.css({
						"position": "absolute",
						"top": 				$(this).position().top + "px",
						"left": 			$(this).position().left + "px",
						"width":			xWidth,
						"height":			"250px",
						"background-color":	"#A32638",
						"z-index":			"2",
						"user-select": 		"none",
						"border":			"1px solid black",
						"box-shadow":		"4px 4px 2px 0px rgba(50, 50, 50, 0.75)",
						"-webkit-app-region":	"no-drag"
					});
					if($(this).offset().top >= (window.pageYOffset + window.innerHeight) / 2) {
						container.css("top", "auto").css("bottom", "0px")
					}
					var currVal = $(this).val().split(settings.joiner);
					var arr = [];
					if($.isFunction(settings.array)) arr = settings.array();
					else if(settings.array !== null) arr = settings.array;
					else arr = [];
					for(var i = 0;i<currVal.length;i++) {
						if(arr.indexOf(currVal[i]) === -1) {
							currVal.splice(i--, 1);
						}
					}
					$(this).val(currVal.join(settings.joiner));
					var list = $("<div>").appendTo(container);
					list.css({
						"height": "217px",
						"width": "100%",
						"overflow-y": "auto",
						"background-color": "white"
					});
					var xBreak=$("<div style='width:" + xWidth + "px;background-color:#A32638;margin-bottom:5px;'><center><input type='text' /></center></div>").appendTo(list);
					var inp = $($(xBreak).find("input")[0]);
					inp.focus();
					inp.keyup(function(e) {
						var checkboxes = $(this).parent().parent().parent().find("[type=checkbox]");
						for(var i = 1;i<checkboxes.length;i++) {	//keep i = 1; this will skip over the first checkbox, which is [All]
							var text = $($(checkboxes[i]).parent().find("span")[0]).html();
							if(text.toUpperCase().indexOf($(this).val().toUpperCase()) !== -1) {
								$(checkboxes[i]).parent().show();
							}
							else $(checkboxes[i]).parent().hide();
						}
					});
					var allLine = $("<div>").appendTo(list);
					var myAll = $("<input />", {type: "checkbox"}).css("width", "20px").css("cursor","pointer").appendTo(allLine).attr("data-all", true);
					myAll.click(function(e) {
						var parent = $(this).parent().parent();
						var boxes = parent.find("[type=checkbox]");
						for(var i = 1;i<boxes.length;i++) {	//keep i = 1; this will skip over the first checkbox, which is [All]
							if($(this).is(":checked")) $(boxes[i]).prop("checked", "true");
							else $(boxes[i]).prop("checked", false);
						}
					});
					myAll.on("forceAll", function() {
						var parent = $(this).parent().parent();
						var boxes = parent.find("[type=checkbox]");
						for(var i = 1;i<boxes.length;i++) {	//keep i = 1; this will skip over the first checkbox, which is [All]
							$(boxes[i]).prop("checked", "true");
						}
					});
					$("<span>[All]</span>").css("margin-top","-15px").css("cursor","pointer").appendTo(allLine).click(function(e) {myAll.click();});
					var liner = $("<div>").appendTo(list);
					for(var i = 0;i<arr.length;i++) {
						var linerX = $("<div>").appendTo(liner);
						var line = $("<span>").appendTo(linerX);
						var box = $("<input />", {type: "checkbox", value: arr[i]}).css("width", "20px").css("cursor","pointer").appendTo(line);
						if(currVal.indexOf(arr[i]) !== -1) box.prop("checked", true);
						$("<span style='margin-top:-10px;'>" + arr[i] + "</span>").css("cursor","pointer").appendTo(line).click(function(myBox) {
							return function() {
								myBox.click();
							}
						}(box));
					}
					
					var buttons = $("<div>").appendTo(container);
					buttons.css({
						"height": "30px",
						"width": "100%",
						"position": "relative",
						"border-radius": "0",
						"-webkit-app-region":	"no-drag"
					});
					
					var OK = $('<button type="button" class="btn btn-default btn-xs">').appendTo(buttons).attr("data-OK", true);
					OK.html("OK");
					OK.css({
						"position": "absolute",
						"left": "0px",
						"bottom": "0px",
						"height": "100%",
						"width": "50px",
						"border-radius": "0",
						"-webkit-app-region":	"no-drag"
					});
					
					OK.click(function(obj) {
						return function() {
							var o = $(obj);
							var val = [];
							var parent = $(this).parent().parent();
							var boxes = parent.find("[type=checkbox]");
							for(var i = 1;i<boxes.length;i++) {	//keep i = 1; this will skip over the first checkbox, which is [All]
								if($(boxes[i]).is(":checked")) val.push($(boxes[i]).val());
							}
							var val2 = val;
							
							//$(this).parentsUntil("[data-label]").find("input, select, button").prop("disabled", false);
							$("input, select, button").prop("disabled", false);

							$('.locked').prop("disabled", true);

							if($.isFunction(settings.complete)) {
								settings.complete.call(o, val2);	//settings.complete(val2);
							}
							
							$(this).parent().parent().remove();
							$("input, select, button").blur();
							o.val(val.join(settings.joiner));							
						}
					}(obj));
					
					var Cancel = $('<button type="button" class="btn btn-default btn-xs">').appendTo(buttons);
					Cancel.html("Cancel");
					Cancel.css({
						"position": "absolute",
						"right": "0px",
						"bottom": "0px",
						"height": "100%",
						"border-radius": "0",
						"-webkit-app-region":	"no-drag"
					});
					Cancel.click(function(e) {
						//$(this).parentsUntil("[data-label]").find("input, select, button").prop("disabled", false);
						$("input, select, button").prop("disabled", false);
						$('.locked').prop("disabled", true);
						$(this).parent().parent().remove();
						$("input, select, button").blur();
					});
				}
			}(obj));
		});
	}
}(jQuery));
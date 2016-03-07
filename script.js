$(document).ready(function() {
    var interval = 1000;   // 1sec
    var nums = [1, 2, 3,
                4, 5, 6, 
                7, 8, 9];  // all possible numbers
    var order = ['#a', '#b', '#c', 
                 '#d', '#e', '#f', 
                 '#g', '#h', '#i']; // which div showed first
    var sqlen = $(window).height();
    if ($(window).width() < sqlen) sqlen = $(window).width();
    $('#boundary').css('margin-top', sqlen/8);
    $('#boundary').css('height', sqlen*3/4);
    $('#boundary').css('width', sqlen*3/4);
    $('.num').css('font-size', sqlen/5);
    
    alert("Start Short Term Memory Test");
    /**
    var e = $('div').length;
    if (e)
	alert(e);
    */
    shufflePos();

    startTest();
    //showEdit();


    
    function shuffle(a) {
        a.sort(function() { return 0.5 - Math.random() });
    }
    
    function shufflePos() {
        order.sort();  // mix order
        shuffle(nums); // mix number
        
        for (var i = 0; i < nums.length; i++) {
            $(order[i]).html(nums[i]);
        }
        shuffle(order);
    }
    
    function startTest() {
	$('button').remove();
        $('body').css('cursor', 'none');
	count = -1;
        tid = setInterval(test, interval);
    }

    function test() {
        if(count < order.length) {
            if (count != -1) $(order[count]).css('opacity', 0);
	    $(order[++count]).css('opacity', 1);
//            $(order[++count]).addClass('shown');
	} else {
	    showEdit();
	    $('body').css('cursor', 'pointer');
            clearInterval(tid);
        }
    }
	
    function showEdit() {
	$('#buttons').append("<button id='replay'>Replay</button>");
	$('#buttons').append("<button id='replaydiff'>Replay in different order</button>");
	$('#buttons').append("<button id='reset'>Reset</button>");
        $('#buttons').append("<button id='submit'>Submit</button>");

	$('#replay').click(function() {
	    startTest();
	});
	$('#replaydiff').click(function() {
	    if (confirm("Are you sure you want to re-order the numbers and replay?")) {
		shuffle(order);
		startTest();
	    } else
		return;
	});
	$('#reset').click(function() {
	    if (confirm("Are you sure you want to reset the numbers and order?")) {
		shufflePos();
		$('#replay').html('Start');
	    } else
		return;
	});
	$('#submit').click(function() {
	    if (confirm("Are you sure you want to submit?")) {
		$('.num').css('opacity', '1');
	    }
	    else
		return;
	});
    }
});

$(document).ready(function() {
    var interval = 1000;   // 1sec
    var nums = [1, 2, 3,
		4, 5, 6, 
		7, 8, 9];  // all possible numbers
    var order = ['#a', '#b', '#c', 
		 '#d', '#e', '#f', 
		 '#g', '#h', '#i']; // which div showed first
    var inputs = [];
    var score = 0;

    var sqlen = 0;
    var anisize = 0;
    initCss();

    $(window).resize(function() {
	initCss();
    });
    
    $('#starttest').click(function() {
	shufflePos();
	startTest();
    });
    
    $('#userinput').keydown(function(event) {
	return checkIfNumber(event);
    });
    
    $('#userinput').keyup(function(event) {
	removeChar(event);
	showInput();
    });
    
    $('#submit').click(function() {
	var str = $("input[id='userinput']").val();
	if (str.length < 9) {
	    alert("Please complete the sequence");
	    return;
	}
	inputs = [];
	var allnums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	var duplicate = "";
	for (var i = 0; i < str.length; i++) {
	    var curinp = parseInt(str[i]);
	    inputs[i] = curinp;
	    if (allnums[curinp-1] == curinp) {
		allnums[curinp-1] = 0;
	    } else if (allnums[curinp-1] == 0) {
		if (duplicate.length)
		    duplicate = duplicate + ", ";
		duplicate = duplicate + curinp;
		allnums[curinp-1] = -1;
	    }
	}
	var notused = "";
	for (var i = 0; i < allnums.length; i++) {
	    if (allnums[i] > 0) {
		if (notused.length)
		    notused = notused + ", ";
		notused = notused + allnums[i];
	    }
	}

	if (duplicate.length > 1)
	    duplicate = "s(" + duplicate + ") are";
	else if (duplicate.length)
	    duplicate = "(" + duplicate + ") is";
	
	if (notused.length > 1)
	    notused = "(" + notused + ") are";
	else if (notused.length)
	    notused = "(" + notused + ") is";
	
	/**
	   for (var j = 0; j < i; j++) {
	       if (inputs[i] == inputs[j]) {
		   if (msg.length) msg = msg + ",";
		   msg = msg + inputs[i];
	       }
	   }
	*/
    
	if (duplicate.length) {
	    alert("Duplicate number" + duplicate + " found.\nPlease check if " + notused + " in the sequence.");
	    return;
	} else
	    submitAnswer();
    });
    
    /**
    $('#answeragain').click(function() {
	submitAnswer();
    });
    */
    
    $('#restart').click(function() {
	$('#animation').children().html('');
	$('#animation').children().removeClass('currect');
	$('#animation').children().removeClass('wrong');
	$('#buttons').children().addClass('hide');
	$('#buttons').children().children().addClass('hide');
	shufflePos();
	startTest();
    });
    
    $(document).keydown(function(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if (keyID == 13) {
	    $('button').not('.hide').click();
	}
    });

    
    function initCss() {
	sqlen = $(window).height();
	if ($(window).width() < sqlen) sqlen = $(window).width();
	
	$('#animation').css('height', sqlen/9.5);
	anisize = $(window).width()/9;
	$('#animation').children().css('width', anisize*.95);
	$('#animation').children().css('height', sqlen/19);
	if (sqlen/19 < anisize) anisize = sqlen/19;
	$('#animation').children().css('float', 'left');
	$('#animation').children().css('text-align', 'center');
	$('#animation').children().css('font-size', anisize*.9);
	
	$('#sqr').css('height', sqlen*3/4);
	$('#sqr').css('width', sqlen*3/4);
	$('.num').css('font-size', sqlen/5);
	
	$('#buttons').css('height', sqlen/10);
	$('#buttons').children().css('font-size', sqlen/12);
	$('#buttons').children().children().css('font-size', sqlen/12);
    }
		  
    function checkIfNumber(event){
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ((keyID >= 49 && keyID <= 57) || (keyID >= 97 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 || keyID == 116 || keyID == 13) 
	    return;
	else
	    return false;
    }
    
    function removeChar(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 || keyID == 116 || keyID == 13) 
	    return;
	else
	    event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
    
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
	$('#buttons').children().addClass('hide');
	$('#buttons').children().children().addClass('hide');
	$('#sqr').removeClass('hide');
        $('body').css('cursor', 'none');
	count = -1;
        tid = setInterval(test, interval);
    }

    function test() {
        if(count < order.length) {
            if (count != -1) $(order[count]).css('opacity', 0);
	    $(order[++count]).css('opacity', 1);
	} else {
	    showEdit();
	    $('body').css('cursor', 'pointer');
            clearInterval(tid);
        }
    }
    	
    function showEdit() {
	$('#sqr').addClass('hide');
	$('#subdiv').removeClass('hide');
	$('#submittext').removeClass('hide');
	$('br').removeClass('hide');
	$('#userinput').val('');
	$('#userinput').removeClass('hide');
	$('#submit').removeClass('hide');
	$('#userinput').focus();
    }

    function showInput() {
	$('#animation').children().html('');
	var str = $("input[id='userinput']").val();
	for (var i = 0; i < str.length; i++)
	    $('#1'+(i+1)).html(str.charAt(i));
    }
    
    function submitAnswer() {
	$('body').css('cursor', 'none');
	$('#buttons').children().addClass('hide');
	$('#buttons').children().children().addClass('hide');
	$('#sqr').removeClass('hide');
	$('#animation').children().html('');
	$('#userinput').blur();
	count = -1;
	score = 0;
	tid = setInterval(animation, interval/2);
    }

    function animation() {
	if (count < order.length) {
	    if (count != -1) $(order[count]).css('opacity', 0);
	    $(order[++count]).css('opacity', 1);
	    var currect = parseInt($(order[count]).text());
	    var answer = inputs[count];
	    if (currect == answer) {
		$('#1' + (count+1)).addClass('currect');
		score++;
	    } else {
		$('#1' + (count+1)).addClass('wrong');
	    }
	    $('#0' + (count+1)).html(currect);
	    $('#1' + (count+1)).html(answer);
	} else {
	    $('body').css('cursor', 'pointer');
	    showScore();
	    clearInterval(tid);
	}
    }

    function showScore() {
	$('#sqr').addClass('hide');
	$('#scoretext').html("Your score is\n" + score + "/9");
	$('#scoretext').removeClass('hide');
	// $('#answeragain').removeClass('hide');
	$('#restart').removeClass('hide');
    }
});

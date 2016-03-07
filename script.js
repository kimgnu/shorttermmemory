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
    var States = Object.freeze({init:0, test:1, edit:2, wait:3, next:4, result:5});
    var state = States.init;
    var testNum = 0;
    
    setGui(States.next);

    $(window).resize(function() {
	setGui(state);
    });
    
    $('#init-start-btn').click(function() {
	startTest();
    });
    
    $('#edit-input').keydown(function(event) {
	return checkIfNumber(event);
    });
    
    $('#edit-input').keyup(function(event) {
	removeChar(event);
	showInput();
    });
    
    $('#edit-submit-btn').click(function() {
	var str = $("input[id='edit-input']").val();
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

    $('#next-btn').click(function() {
	startResult();
    });
    
    /**
    $('#answeragain').click(function() {
	submitAnswer();
    });
    
    $('#restart').click(function() {
	//$('#animation').children().html('');
	//$('#animation').children().removeClass('currect');
	//$('#animation').children().removeClass('wrong');
	$('#buttons').children().addClass('hide');
	$('#buttons').children().children().addClass('hide');
	shufflePos();
	startTest();
    });
    */
    
    $(document).keydown(function(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if (keyID == 13) {
	    // need to be changed
	    $('button').not('.hide').click();
	}
    });

    
    function setGui(currentState) {
	state = currentState;
	sqlen = $(window).height();
	if ($(window).width() < sqlen) sqlen = $(window).width();

	if (state == States.init) {
	    $('div').not('.init').addClass('hide');
	    $('.init').removeClass('hide');
	    //$('.init').children().removeClass('hide');
	    $('#init-top').css('height', sqlen/8.5);
	    $('#init-main').css('height', sqlen*3/4);
	    $('.init').css('font-size', sqlen/12);
	    $('.init').css('text-align', 'center');
	    $('#init-bottom').css('height', sqlen/9);
	} else if (state == States.test) {
	    $('div').not('.test').addClass('hide');
	    $('.test').removeClass('hide');
	    $('#test-top').css('height', sqlen/8.5);
	    $('#test-sqr').css('height', sqlen*3/4);
	    $('#test-sqr').css('width', sqlen*3/4);
	    $('.num').css('font-size', sqlen/5);
	    $('#test-bottom').css('height', sqlen/9);
	    $('body').css('cursor', 'none');
	} else if (state == States.edit) {
	    $('div').not('.edit').addClass('hide');
	    $('.edit').removeClass('hide');
	    $('#edit-top').css('height', sqlen/9.5);
	    anisize = $(window).width()/9;
	    $('#edit-top').children().css('width', anisize*.95);
	    $('#edit-top').children().css('height', sqlen/19);
	    if (sqlen/19 < anisize) anisize = sqlen/19;
	    $('#edit-top').children().css('float', 'left');
	    $('#edit-top').children().css('text-align', 'center');
	    $('#edit-top').children().css('font-size', anisize*.9);
	    $('#edit-main').css('height', sqlen/2);
	    $('.edit').css('font-size', sqlen/12);
	    $('.edit').css('text-align', 'center');
	    
	    $('#edit-bottom').css('float', 'right');
	    $('#edit-count').css('font-size', sqlen/5);
	    $('#edit-count').css('padding-right', sqlen/5);
	} else if (state == States.wait) {
	    $('div').not('.wait').addClass('hide');
	    $('.wait').removeClass('hide');
	    $('#wait-top').css('height', sqlen/3);
	    $('#wait-sqr').css('height', sqlen/3);
	    $('#wait-sqr').css('width', sqlen/3);
	    $('#wait-sqr').css('font-size', sqlen/3.5);
	    $('#wait-sqr').css('text-align', 'center');
	    $('#wait-sqr').css('align', 'center');
	} else if (state == States.next) {
	    $('div').not('.next').addClass('hide');
	    $('.next').removeClass('hide');
	    $('#next-top').css('height', sqlen/2.5);
	    $('#next-main').css('height', sqlen/3);
	    $('.next').css('font-size', sqlen/12);
	    $('.next').css('text-align', 'center');
	} else if (state == States.result) {
	    $('div').not('.result').addClass('hide');
	    $('.result').removeClass('hide');
	    $('.result').css('font-size', sqlen/12);
	}
	/**
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
*/
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

    /**
    function startTest() {
	$('#buttons').children().addClass('hide');
	$('#buttons').children().children().addClass('hide');
	$('#sqr').removeClass('hide');
        $('body').css('cursor', 'none');
	count = -1;
        tid = setInterval(test, interval);
    }
    */
    
    function startTest() {
	shufflePos();
	setGui(States.test);
	count = -1;
	tid1 = setInterval(test, interval);
    }
    
    function test() {
        if(count < order.length) {
            if (count != -1) $(order[count]).css('opacity', 0);
	    $(order[++count]).css('opacity', 1);
	} else {
	    startEdit();
	    clearInterval(tid1);
        }
    }
    
    function startEdit() {
	setGui(States.edit);
	$('#edit-input').val('');
	$('#edit-input').focus();
	$('body').css('cursor', 'pointer');
	
	count = 15;
	$('#edit-count').html(count--);
	tid2 = setInterval(editCountdown, interval);
    }
    
    function editCountdown() {
	if (count > 0) {
	    $('#edit-count').html(count--);
	} else {
	    startWait();
	    clearInterval(tid2);
	}
    }
    
    function startWait() {
	if (testNum >= 3) {
	    startNext();
	} else {
	    testNum++;
	    storeResult();
	    setGui(States.wait);
	    
	    count = 5;
	    $('#wait-sqr').html(count--);
	    tid3 = setInterval(waitCountdown, interval);
	}
    }

    function storeResult() {
    }
	
    function waitCountdown() {
	if (count > 0) {
	    $('#wait-sqr').html(count--);
	} else {
	    startTest();
	    clearInterval(tid3);
	}
    }
    
    function startNext() {
	setGui(States.next);
    }
	    
    function startResult() {
	setGui(States.result);
	showResult();
    }

    function showResult() {
    }
    
    /**
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
    */

    function showInput() {
	var str = $("input[id='edit-input']").val();
	for (var i = 0; i < str.length; i++)
	    $('#1'+(i+1)).html(str.charAt(i));
    }

    /**
    function submitAnswer() {
	$('body').css('cursor', 'none');
	$('#buttons').children().addClass('hide');
	$('#buttons').children().children().addClass('hide');
	$('#sqr').removeClass('hide');
	//$('#animation').children().html('');
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
		//$('#1' + (count+1)).addClass('currect');
		score++;
	    } else {
		//$('#1' + (count+1)).addClass('wrong');
	    }
	    //$('#0' + (count+1)).html(currect);
	    //$('#1' + (count+1)).html(answer);
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
    */
});

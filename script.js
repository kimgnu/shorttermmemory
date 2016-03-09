$(document).ready(function() {
    var onesec = 1000;   // 1sec
    var interval = 1000;
    var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];  // all possible numbers
    var order = ['#a', '#b', '#c', 
		 '#d', '#e', '#f', 
		 '#g', '#h', '#i']; // which div showed first

    var sqlen = 0; // store smaller number: window.height || window.width
    var States = Object.freeze({init:0, test:1, edit:2, wait:3, next:4, result:5});
    var state;
    var testNum = 0;
    var results = [null, null, null, null];

/**
    results = [{quiz: '123456789', answer: '123458769'},
	       {quiz: '234567891', answer: '234587691'},
	       {quiz: '345678912', answer: '345876912'},
	       {quiz: '456789123', answer: '458769123'}];
*/
    setGui(States.init);

/**
    for (; testNum < 4; testNum++) {
	showResult();
    }
*/

    
    $(window).resize(function() {
	setGui(state);
    });
    
    $('#init-start-btn').click(function() {
	$('body').css('cursor', 'none');
	startTest();
    });

    $('#edit-input').keydown(function(event) {
	return validateInput(event);
    });


    $('#edit-input').keyup(function(event) {
	removeChar(event);
	showInput();
    });

    $('#next-btn').click(function() {
	startResult();
    });

    $('#result-main-btn').click(function() {
	if (confirm("Did you record the data?\nYou will go back to the main page."))
	    location.reload(true);
    });

    $(document).keydown(function(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;

	// ESC key or F5 key
	if (keyID == 27 || keyID == 116) {
	    if (state == States.init) return;
	    event.preventDefault(); 
	    if (confirm("Do you want to go back to the main page?\nData of entire tests will be discarded.")) {
		// need to be changed
		if (state == States.test) clearInterval(tid1);
		else if (state == States.edit) clearInterval(tid2);
		else if (state == States.wait) clearInterval(tid3);
		//setGui(States.init);
		location.reload(true);
	    } else return;
	}
	// Return key
	else if (keyID == 13) {
	    // need to be changed
	    if (state == States.init) $('#init-start-btn').click();
	    else if (state == States.next) $('#next-btn').click();
	    else if(state == States.result) $('#result-main-btn').click();
	}
    });
		  
    function validateInput(event){
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	// only numbers and some function keys are valid input 
	if ((keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105)
	    || keyID == 8 // backspace
	    || keyID == 27 // ESC
	    || keyID == 37 || keyID == 39  // left & right arrows
	    || keyID == 46 // delete
	    || keyID == 116 // F5
	    || keyID == 122) // F11 
	    return;
	else
	    return false;
    }
    
    function removeChar(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( keyID == 8 // backspace
	     || keyID == 27 // ESC
	     || keyID == 37 || keyID == 39 // left & right arrows
	     || keyID == 46 // delete
	     || keyID == 116 // F5
	     || keyID == 122) // F11 
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
	setGui(States.test);
	$('.num').css('opacity', 0);
	shufflePos();
	count = -1;
	tid1 = setInterval(test, interval);
    }
    
    function test() {
        if(count < order.length) {
            if (count != -1) $(order[count]).css('opacity', 0);
	    $(order[++count]).css('opacity', 1);
	} else {
	    $('body').css('cursor', 'pointer');
	    startEdit();
	    clearInterval(tid1);
        }
    }
    
    function startEdit() {
	setGui(States.edit);
	$('.dash').css('opacity', 0);
	for (var i = 0; i < 9; i++)
	    $('#1'+(i+1)).html('');
	$('#edit-input').val('');
	$('#edit-input').focus();
		
	count = 15;
	$('#edit-count').html(count--);
	tid2 = setInterval(editCountdown, onesec);
    }
    
    function editCountdown() {
	if (count > 5) {
	    $('#edit-count').html(count--);
	} else if (count > 0) {
	    $('#edit-count').html('<span class="wrong">' + count-- + '</span>');	    
	} else {
	    startWait();
	    clearInterval(tid2);
	}
    }
    
    function startWait() {
	$('body').focus();
	storeResult();
	testNum++;
	if (testNum >= 4) {
	    $('body').css('cursor', 'pointer');
	    startNext();
	} else {
	    $('body').css('cursor', 'none');
	    setGui(States.wait);
	    
	    count = 5;
	    $('#wait-sqr').html(count--);
	    tid3 = setInterval(waitCountdown, onesec);
	}
    }

    function storeResult() {
	var quiz = "";
	for (var i = 0; i < order.length; i++)
	    quiz = quiz + $(order[i]).text();
	var answer = $("input[id='edit-input']").val();
	//for (var i = 0; i < (quiz.length - answer.length); i++)
	//    answer = answer + " ";
	if (results[testNum] != null) {
	    alert("results[" + testNum + "] is not null!");
	} else {
	    results[testNum] = {
		quiz: quiz,
		answer: answer
	    };
	}
	//alert(results[testNum].quiz + "\n" + results[testNum].answer);
    }
	
    function waitCountdown() {
	if (count > 0) {
	    $('#wait-sqr').html(count--);
	} else {
	    $('body').css('cursor', 'none');
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
	for (var i = 0; i < 4; i++) {
	    var parent = '.part:nth-child('+ (i+1) +')';
	    //$(parent+' .quiz').html(results[i].quiz);
	    //$(parent+' .answer').html(results[i].answer);
	    var qval = results[i].quiz;
	    var aval = results[i].answer;
	    var qstr = 'Q: ';
	    var astr = 'A: ';
	    var score = 0;
	    for (var j = 0; j < qval.length; j++) {
		var q = qval.charAt(j);
		if (j > 0) qstr = qstr + '-';
		qstr = qstr + q;

		if (j >= aval.length) {
		    console.log('different length in test' + (i+1) + ': ' + qval.length + ',' + aval.length);
		    continue;
		}
		var a = aval.charAt(j);
		if (j > 0) astr = astr + '-';		    
		if (q == a) {
		    astr = astr + '<span class="currect">' + a + '</span>';			
		    score++;
		} else {
		    astr = astr + '<span class="wrong">' + a + '</span>';
		}
	    }
	    $(parent+' .quiz').html(qstr);
	    $(parent+' .answer').html(astr);
	    $(parent+' .score').html("Score: " + score + "/9");
	}
    }

    function showInput() {
	for (var i = 0; i < 9; i++)
	    $('#1'+(i+1)).html('');
	var str = $("input[id='edit-input']").val();
	if (str.length) $('.dash').css('opacity', 1);
	else $('.dash').css('opacity', 0);
	for (var i = 0; i < str.length; i++)
	    $('#1'+(i+1)).html(str.charAt(i));
    }

    function setGui(currentState) {
	state = currentState;
	sqlen = Math.min($(window).height(), $(window).width());

	if (state == States.init) {
	    $('div').not('.init').addClass('hide');
	    $('.init').removeClass('hide');
	    $('#init-top').css('height', sqlen/8.5);
	    $('#init-main').css('height', sqlen*3/4);
	    $('.init').css('font-size', sqlen/12);
	    //$('.init').css('text-align', 'center');
	    $('#init-bottom').css('height', sqlen/9);
	}
	else if (state == States.test) {
	    $('.test').removeClass('hide');
	    $('div').not('.test').addClass('hide');
	    
	    
	    $('#test-top').css('height', sqlen/8.5);
	    $('#test-sqr').css('height', sqlen*3/4);
	    $('#test-sqr').css('width', sqlen*3/4);
	    $('.num').css('font-size', sqlen/5);
	    $('#test-bottom').css('height', sqlen/12);
	}
	else if (state == States.edit) {
	    $('div').not('.edit').addClass('hide');
	    $('.edit').removeClass('hide');
	    /**
	    $('#edit-top').css('height', sqlen/9.5);
	    anisize = $(window).width()/9;
	    $('#edit-top').children().css('width', anisize*.95);
	    $('#edit-top').children().css('height', sqlen/19);
	    if (sqlen/19 < anisize) anisize = sqlen/19;
	    $('#edit-top').children().css('float', 'left');
	    //$('#edit-top').children().css('text-align', 'center');
	    $('#edit-top').children().css('font-size', anisize*.9);
	    */
	    
	    /**
	    $('#edit-top').css('height', sqlen/8);
	    anisize = $(window).width()/17;
	    $('#edit-top').children().css('width', anisize*.95);
	    $('#edit-top').children().css('height', sqlen/19);
	    if (sqlen/19 < anisize) anisize = sqlen/19;
	    $('#edit-top').children().css('float', 'left');
	    $('#edit-top').children().css('font-size', anisize*.9);

	    
	    $('#edit-main').css('height', sqlen/2);
	    $('.edit').css('font-size', sqlen/12);
	    //$('.edit').css('text-align', 'center');
	    */

	    $('#edit-top').css('height', sqlen/8);
	    $('#edit-main').css('height', sqlen/2);
	    $('.edit').css('font-size', sqlen/12);
	    $('#edit-display').css('height', sqlen/4);
	    $('#edit-display').children().css('width', $(window).width()/17.5);
	    $('#edit-display').children().css('height', sqlen/19);
	    $('#edit-display').css('align', 'center');
	    $('#edit-display').children().css('float', 'left');
	    $('#edit-display').children().css('font-size', $(window).width()/18);
	    
	    $('#edit-bottom').css('float', 'right');
	    $('#edit-count').css('font-size', sqlen/5);
	    $('#edit-count').css('padding-right', sqlen/5);
	    
	}
	else if (state == States.wait) {
	    $('div').not('.wait').addClass('hide');
	    $('.wait').removeClass('hide');
	    $('#wait-top').css('height', $(window).height()/3);
	    $('#wait-sqr').css('height', $(window).height()/3);
	    $('#wait-sqr').css('width', $(window).width()*0.9);
	    $('#wait-bottom').css('height', $(window).height()/4);
	    $('.wait').css('font-size', sqlen/3.5);
	    $('.wait').css('margin', 'auto');
	    
	    //$('.wait').css('text-align', 'center');
	    //$('.wait').css('align', 'center');
	}
	else if (state == States.next) {
	    $('div').not('.next').addClass('hide');
	    $('.next').removeClass('hide');
	    $('#next-top').css('height', sqlen/2.5);
	    $('#next-main').css('height', sqlen/3);
	    $('.next').css('font-size', sqlen/12);

	    //$('.next').css('text-align', 'center');
	} else if (state == States.result) {
	    $('div').not('.result').addClass('hide');
	    $('.result').removeClass('hide');
	    $('.result').css('font-size', $(window).width()/30);
	    $('.part').css('height', sqlen/2.5);
	    //$('.title').css('padding-left', $(window).width()/22);
	    $('.title').css('padding-top', $(window).width()/180);
	    //$('.quiz, .answer').css('padding-left', $(window).width()/15);
	    $('#result-bottom').css('height', sqlen/15);
	    $('#result-main-btn').css('margin-top', sqlen/20);

	}
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

        /**
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
*/	
	/**
	   for (var j = 0; j < i; j++) {
	       if (inputs[i] == inputs[j]) {
		   if (msg.length) msg = msg + ",";
		   msg = msg + inputs[i];
	       }
	   }
	*/
/**    
	if (duplicate.length) {
	    alert("Duplicate number" + duplicate + " found.\nPlease check if " + notused + " in the sequence.");
	    return;
	} else
	    submitAnswer();
    });
*/
});

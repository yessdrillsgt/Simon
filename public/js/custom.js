$(document).ready(function(){
	// Declare global variables
	const BUTTON_IDs = ['btn_green', 'btn_red', 'btn_yellow', 'btn_blue'];
	const DEFAULT_GREEN = $('#btn_green').css('background-color');
	const DEFAULT_RED = $('#btn_red').css('background-color');
	const DEFAULT_YELLOW = $('#btn_yellow').css('background-color');
	const DEFAULT_BLUE = $('#btn_blue').css('background-color');
	const DEFAULT_START = $('#start').css('background-color');
	const DEFAULT_STRICT_LIGHT = $('#strictLight').css('background-color');
	const ACTIVE_GREEN = 'rgb(0, 255, 0)';
	const ACTIVE_RED = 'rgb(255, 0, 0)';
	const ACTIVE_YELLOW = 'rgb(255, 255, 0)';
	const ACTIVE_BLUE = 'rgb(0, 0, 255)';
	const ACTIVE_START = 'rgb(0, 255, 0)';
	const ACTIVE_STRICT_LIGHT = 'rgb(255, 0, 0)';
	const MAX_COMBO_LENGTH = 20;
	const ERROR = '!!';
	const WIN = 'WIN';
	const GAME_SPEED = 1000; // milliseconds
	const DISPLAY_ERROR = 1500; // milliseconds
	var computersTurn = false;
	var strict = false;
	var audio_green, audio_red, audio_blue, audio_yellow;
	var winningCombo = [];
	var currWinnComboIndex = 0;
	var gameOn = true;
	var gameStarted = false;
	var gameWon = false;
	
	var showWinningCombo = setInterval(ShowCurrentWinningCombo, GAME_SPEED);
	var iteration = 0;
	var currentCount = 0;
	
	DefineAudio();
	PopulateWinningCombo();
	
	
	// Chains mousedown and mouseup events for the four buttons
	$('#btn_green, #btn_red, #btn_yellow, #btn_blue').on('mousedown', function(){
		if (computersTurn) { return; }
		if (!gameStarted) { return; }
		var id = $(this).attr('id');
		ActivateButton(id);
		
	}).on('mouseup', function(){
		if (computersTurn) { return; }
		var id = $(this).attr('id');
		DeactivateButton(id);
			
		if (winningCombo[iteration] === id){ // correct move
			if (iteration == MAX_COMBO_LENGTH - 1){ // winner
				alert('got here');
				Update_CountDisplay(WIN);
				gameWon = true;
				
				setTimeout(function(){ 
					ResetGame();
					RestartGame();
				}, 1500);
				
			} else { // more moves to be played
				if (iteration === currWinnComboIndex){ // now computer's turn to show next sequence
					setTimeout(function(){ 
						iteration = 0;
						currWinnComboIndex++;
						computersTurn = true;
					}, 1500);

				} else {
					iteration++;
				}
			}
			
			
		} else{ // wrong move
			
			if (strict){ // start all over
				Update_CountDisplay(ERROR);
				
				setTimeout(function(){ 
					ResetGame();
					RestartGame();
				}, DISPLAY_ERROR);

			} else { // repeat sequence
				
				currentCount--;
				Update_CountDisplay(ERROR);
				
				setTimeout(function(){ 
					computersTurn = true;
					iteration = 0;
				}, DISPLAY_ERROR);
				
			}
		}
	});
	
	// Chains mousedown, mouseup and mouseleave events for the start button
	$('#start').on('mousedown', function(){
		if (!gameOn) { return; }
		if (gameStarted) { return; }
		RestartGame();
		
		$(this).css('background-color', ACTIVE_START);
		
	}).on('mouseup mouseleave', function(){
		$(this).css('background-color', DEFAULT_START);
	});
	
	$('#btn_strict').on('mousedown', function(){
		if (strict){
			$('#strictLight').css('background-color', DEFAULT_STRICT_LIGHT);
		
		} else {
			$('#strictLight').css('background-color', ACTIVE_STRICT_LIGHT);
		}
		
		strict = !strict;
	});
	
	$('#toggle-onOff').on('change', function(){
		var on = $(this).prop('checked');
		
		if (on) {
			ResetGame();
		
		} else {
			$('#count').text( '' );
			gameStarted = false;
		}
		
		gameOn = on;
	});
	
	
	$(function() {
		// Initializes bootstrap toggle object
		$('#toggle-onOff').bootstrapToggle({
			size: 'small',
			onstyle: 'success',
			offstyle: 'danger'
		});
		
		$('#toggle-onOff').bootstrapToggle('on'); // defaults to on
		Update_CountDisplay(currentCount);
	});
	
	// Creates an audio html5 element and assigns the associated file to the audio variables
	function DefineAudio(){
		audio_green = document.createElement('audio');
		audio_green.src = '../sounds/green.mp3';
		
		audio_red = document.createElement('audio');
		audio_red.src = '../sounds/red.mp3';
		
		audio_blue = document.createElement('audio');
		audio_blue.src = '../sounds/blue.mp3';
		
		audio_yellow = document.createElement('audio');
		audio_yellow.src = '../sounds/yellow.mp3';
	};
	
	// Randomizes the winning combination
	function PopulateWinningCombo(){
		winningCombo = []; // clear the array
		var winner;
		var index;
		
		for (var i = 0; i < MAX_COMBO_LENGTH; i++){
			index = Math.floor(Math.random() * (BUTTON_IDs.length)); // randomizes a number between 0 and lengthOfwinningCombo inclusively
			winner = BUTTON_IDs[index];
			winningCombo.push(winner);
		}
	};
	
	function ShowCurrentWinningCombo(){
		if (!computersTurn) { return; }
		if (!gameStarted) { return; }
		//if (iteration > 0) { DeactivateButton(winningCombo[iteration - 1]); } // Deactivate previous iteration
		
		if (iteration <= currWinnComboIndex){
			ActivateButton(winningCombo[iteration]);
			iteration++;
			Update_CountDisplay(currentCount);
			
			if (iteration > 0) {
				setTimeout(function(){ 
					DeactivateButton(winningCombo[iteration - 1]);
				}, GAME_SPEED / 2);
			}
			
		} else {
			computersTurn = false;
			iteration = 0;
			currentCount++;
		}
	};
	
	function ActivateButton(id){
		switch(id){
			case 'btn_green':
				$('#btn_green').css('background-color', ACTIVE_GREEN);
				audio_green.play();
				break;
			
			case 'btn_red':
				$('#btn_red').css('background-color', ACTIVE_RED);
				audio_red.play();
				break;
			
			case 'btn_yellow':
				$('#btn_yellow').css('background-color', ACTIVE_YELLOW);
				audio_yellow.play();
				break;
			
			case 'btn_blue':
				$('#btn_blue').css('background-color', ACTIVE_BLUE);
				audio_blue.play();
				break;
			
			default:
				return;
		}	
	};
	
	function DeactivateButton(id){
		switch(id){
			case 'btn_green':
				$('#btn_green').css('background-color', DEFAULT_GREEN);
				audio_green.pause();
				audio_green.currentTime = 0;
				break;
			
			case 'btn_red':
				$('#btn_red').css('background-color', DEFAULT_RED);
				audio_red.pause();
				audio_red.currentTime = 0;
				break;
			
			case 'btn_yellow':
				$('#btn_yellow').css('background-color', DEFAULT_YELLOW);
				audio_yellow.pause();
				audio_yellow.currentTime = 0;
				break;
			
			case 'btn_blue':
				$('#btn_blue').css('background-color', DEFAULT_BLUE);
				audio_blue.pause();
				audio_blue.currentTime = 0;
				break;
			
			default:
				return;
		}
	};
	
	function Update_CountDisplay(display){
		if (typeof display == 'number'){
			if (display > 9) {
				$('#count').text( display.toString() );
			} else {
				$('#count').text( '0' + display.toString() );
			}
		} else {
			$('#count').text( display );
		}			 
	};
	
	function ResetGame(){
		// Reset all variables
		iteration = 0;
		currentCount = 0;
		computersTurn = false;
		PopulateWinningCombo(); // repopulates winning combo
		currWinnComboIndex = 0;
		Update_CountDisplay(currentCount);
	};
	
	function RestartGame(){
		gameStarted = true;
		computersTurn = true;
		currentCount = 1;
		Update_CountDisplay(currentCount);
	};
	
});




















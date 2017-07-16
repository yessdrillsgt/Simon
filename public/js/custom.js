$(document).ready(function(){
	// Declare global variables
	const BUTTON_IDs = ['btn_green', 'btn_red', 'btn_yellow', 'btn_blue'];
	const DEFAULT_GREEN = $('#btn_green').css('background-color');
	const DEFAULT_RED = $('#btn_red').css('background-color');
	const DEFAULT_YELLOW = $('#btn_yellow').css('background-color');
	const DEFAULT_BLUE = $('#btn_blue').css('background-color');
	const ACTIVE_GREEN = 'rgb(0, 255, 0)';
	const ACTIVE_RED = 'rgb(255, 0, 0)';
	const ACTIVE_YELLOW = 'rgb(255, 255, 0)';
	const ACTIVE_BLUE = 'rgb(0, 0, 255)';
	const MAX_COMBO_LENGTH = 20;
	var computersTurn = true;
	var strict = false;
	var audio_green, audio_red, audio_blue, audio_yellow;
	var winningCombo = [];
	var currWinnComboIndex = 19;
	var gameOn = false;
	var gameSpeed = 1000; // milliseconds
	var showWinningCombo = setInterval(ShowCurrentWinningCombo, gameSpeed);
	var iteration = 0;
	
	DefineAudio();
	PopulateWinningCombo();
	
	// Chains mousedown, mouseup and mouseleave events for the four buttons
	$('#btn_green, #btn_red, #btn_yellow, #btn_blue').on('mousedown', function(){
		if (computersTurn) { return; }
		var id = $(this).attr('id');
		ActivateButton(id);
	
	}).on('mouseup mouseleave', function(){
		if (computersTurn) { return; }
		var id = $(this).attr('id');
		DeactivateButton(id);
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
		console.log(winningCombo);
	};
	
	function ShowCurrentWinningCombo(){
		if (!computersTurn) { return; }
		if (iteration > 0) { DeactivateButton(winningCombo[iteration - 1]); } // Deactivate previous iteration
		
		if (iteration <= currWinnComboIndex){
			ActivateButton(winningCombo[iteration]);
			iteration++;
		
		} else {
			computersTurn = false;
			iteration = 0;
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
	
});




















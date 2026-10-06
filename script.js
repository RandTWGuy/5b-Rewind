	// canvas dimensions
    let canvas_x = canvas.width;
    let canvas_y = canvas.height;

	// profile pic opacity & margin PROPORTION
	let img_opacity = 0.8;
	let img_margin = 0.15;

	// Rank number opacity & margin PROPORTION
	let rank_opacity = 0.75;
	let rank_margin = 0.1;
	
    // Margin
    let margin_x = 25;
    let margin_y = 25;
    
    // width and height of a single block
    let block_x = 100;
    let block_y = 100;
    
    //space between blocks
    let buffer_x = 20;
    let buffer_y = 20;

    //blocks that fit per axis
    let x_blocks = Math.floor((canvas_x - (margin_x * 2) - block_x)/(block_x + buffer_x)) + 1;
    let y_blocks = Math.floor((canvas_y - (margin_y * 2) - block_y)/(block_y + buffer_y)) + 1;
		
    // Drawing a rectangle over the whole canvas
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(0,0,canvas_x,canvas_y);

	//--------------------------------------------------------------------------------------------------------------------------------
	
	// Initialize vars
    //List of 5b-ers' data is already done from data.js
    const player_count = FiveBerData.length;
	let player_data = [];//Will turn into [[date1,PR1],[date2,PR2]] eventually; changed for each player
	
    //current x/y block number
    let curr_x_block;
    let curr_y_block;
    //rectangle corner coordinates
    let rect_x;
    let rect_y;
    //rectangle center coordinates
    let curr_center_x;
    let curr_center_y;

	//global var to be used in both main functions
	let curr_PRs;
	
	//Text style
	ctx.textAlign = "center";
    
	// Pre-load all profile images
	const pre_load_imgs = {};
	for (let i = 0; i < player_count; i++) {
  		if (FiveBerData[i].length == 3) {
    		const img = new Image();
    		img.src = FiveBerData[i][2];
    		pre_load_imgs[FiveBerData[i][0]] = img; // Store by player name
  		}
	}


	// The slider and it's updates
	// Start and End Dates
	const start_date = new Date('2018-11-02T00:00:00Z');
	const end_date = new Date(new Date().toUTCString());

	// Timestampize the dates
	const start_time_stamp = start_date.getTime();
	const end_time_stamp = end_date.getTime();

	// Tell JS about the slider
	const slider = document.getElementById('dateSlider');
	const display = document.getElementById('dateDisplay');

	// Set the slider's vals
	// First max then min to not mess the slider up
	slider.max = end_time_stamp;
	slider.min = start_time_stamp;
	slider.step = 86400000;
	slider.value = end_time_stamp; //Default to today

	//-------------------------------------------------------------------

	//Function Code: draw block and associates
	function draw(player_index){
		//Calculate x_block and y_block coordinates
      	//0-indexed
      	curr_x_block = player_index % x_blocks;
      	curr_y_block = (player_index - curr_x_block)/x_blocks;
      	
      	//Calculate the Rectangle
      	rect_x = margin_x + curr_x_block*(block_x + buffer_x);//margin + which block we're at
      	rect_y = margin_y + curr_y_block*(block_y + buffer_y);//ditto
      
      	//Clear the last block
		ctx.clearRect(rect_x,rect_y,block_x,block_y);
		//set color
		if (player_index == 0){
			ctx.fillStyle = 'gold';
		} else if (player_index == 1){
			ctx.fillStyle = 'silver';
		} else if (player_index == 2){
			ctx.fillStyle = 'peru';
		} else {
      		ctx.fillStyle = 'white';
		}
		//draw rect
      	ctx.fillRect(rect_x,rect_y,block_x,block_y);

		// semi-opaque profile pic
		// if there is a profile pic:
		if (curr_PRs[player_index].length == 3 && pre_load_imgs[curr_PRs[player_index][0]]) {
  		const profile_img = pre_load_imgs[curr_PRs[player_index][0]];
 			
  			// Only draw if the image is already loaded
  			if (profile_img.complete) {
    			ctx.globalAlpha = img_opacity;
    			ctx.drawImage(
      				profile_img,
      				rect_x + (img_margin * block_x),           // x offset
      				rect_y + (img_margin * block_y),           // y offset
      				(1 - 2 * img_margin) * block_x,            // width
      				(1 - 2 * img_margin) * block_y             // height
    				);
  			}
		}
		
	  	//Text style
		ctx.font = "14px Arial";
      	ctx.fillStyle = "black";//black
		ctx.globalAlpha = 1.0;
		
		//Calculate center of block
      	curr_center_x = rect_x + (block_x / 2);
		curr_center_y = rect_y + (block_y / 2);
		//Player name text top of block
		ctx.textBaseline = "top";
      	ctx.fillText(curr_PRs[player_index][0], curr_center_x, curr_center_y - (block_y / 2));
		
		//PR time text
		let text;
		let PR_time = curr_PRs[player_index][1];
		
		//Convert to mm:ss:xxx
		let PR_ms = PR_time%1000;
		PR_time = (PR_time - PR_ms)/1000;
		let PR_sec = PR_time%60;
		let PR_min = (PR_time - PR_sec)/60;
		//make sec always have two digits
		PR_sec = ('0' + PR_sec).slice(-2);
		//make ms always have three digits
		PR_ms = ('00' + PR_ms).slice(-3);
		
		//text
		text = `${PR_min}:${PR_sec}.${PR_ms}`;
		
		
		//Display text at the bottom of the block
		ctx.textBaseline = "bottom";
		ctx.fillText(text, curr_center_x, curr_center_y + (block_y / 2));

		//semisolid ranking numbers
		//Text style
      	ctx.fillStyle = "grey";
		ctx.globalAlpha = rank_opacity;
		ctx.font = String(block_x * (1 - 2 * rank_margin)) + "px Arial";//block_x is the width of a block, which is ok for square blocks only
    	//text
		ctx.textBaseline = "middle";
		ctx.fillText(String(player_index + 1), curr_center_x, curr_center_y);
	}


	//Function Code: Updating
	function update(curr_timestamp){
  		const curr_date = new Date(curr_timestamp);
  		
  		// Output as YYYYY-MM-DD. Ignore the time.
 		const formatted_date = curr_date.toISOString().split('T')[0];
  		display.textContent = formatted_date;

		curr_PRs = structuredClone(FiveBerData);
		//Will turn into [[player1,PR1],[player2,PR2]] eventually;
		// what was profile pic links will remain profile pic links
		// need player names 'cause we're gonna sort this thing in order
		// Calculate everyone's PRs at this time
		for (let i = 0; i < player_count; i++){
			//list of runs (timestamp+PR)
			player_data = FiveBerData[i][1];
			//check if the player has a run at this time
			//curr_player_data[0][0] is the timestamp of the first ever run
			if (curr_timestamp < player_data[0][0]){
				// if player doesn't have a run yet:
				// set their PR to an 3600000, which means "NO RUN YET"
				// so that converting to mm:ss:xxx can have an exception
				curr_PRs[i][1] = 3600000;
			} else {
				// if player already has runs:
				// keep running, from late to early runs, if run is after curr_timestamp
				let run_index = player_data.length - 1;
				while (curr_timestamp < player_data[run_index][0]){
					run_index--;
				}
				//this run is the curr_PR.
				curr_PRs[i][1] = player_data[run_index][1];
			}	
		}
		//sort curr_PRs by time, sorting the player names with them
		curr_PRs.sort((a,b) => a[1] - b[1])
		// Loop through everybody and draw
    	for (let i = 0; i < Math.min(player_count, x_blocks * y_blocks); i++){
      		//Only draw if player has run
			if (curr_PRs[i][1] != 3600000){
				draw(i);
			}
		}
	}
	
	//Run function once
	update(Number(slider.value));
	// Check if the slider is changing
	slider.addEventListener('input', (e) => {
 		update(Number(e.target.value));
	});

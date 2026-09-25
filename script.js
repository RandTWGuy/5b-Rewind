	// canvas dimensions (update manually with the canvas!)
    let canvas_x = 750
    let canvas_y = 750
    
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
    //List of 5b-ers' data:
	/*
	[
	[player1,[
	[Date1,PR1],[Date2,PR2],[Data3,PR3]
	]],
	[player2,[
	[Date1,PR1],[Date2,PR2],[Data3,PR3]
	]],
	[player3,[
	[Date1,PR1],[Date2,PR2],[Data3,PR3]
	]]
	]
	*/
	//Each player must have at least one run
    const FiveBerData = 
      [
		  ['me',
		   [[1789344000000,"17:59.450"],[1789862400000,"16:14.417"]]
		  ],
		  ['fake me',
		   [[1789430400000,"27:59.450"],[1789948800000,"26:14.417"]]
		  ]
	  ];
    const player_count = FiveBerData.length;

	const curr_PRs = structuredClone(FiveBerData);//Will turn into [[player1,PR1],[player2,PR2]] eventually
	let player_data = [];//Will turn into [[date1,PR1],[date2,PR2]] eventually; changed for each player
	//Do we need the player tab in curr_PRs? Best if we keep it, think about removing it.
	
    //current x/y block number
    let curr_x_block = 0;
    let curr_y_block = 0;
    //rectangle corner coordinates
    let rect_x = 0;
    let rect_y = 0;
    //rectangle center coordinates
    let curr_center_x = 0;
    let curr_center_y = 0;
    
	//Text style
	ctx.font = "12px Arial";
	ctx.textAlign = "center";
    
	
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
	slider.value = start_time_stamp; //Default to 2018

	// Check if the slider is changing
	slider.addEventListener('input', (e) => {
 		const curr_timestamp = Number(e.target.value);
  		const curr_date = new Date(curr_timestamp);
  
  		// Output as YYYYY-MM-DD. Ignore the time.
 		const formatted_date = curr_date.toISOString().split('T')[0];
  		display.textContent = formatted_date;

		//Calculate everyone's PRs at this time
		for (let i = 0; i < player_count; i++){
			//list of runs (timestamp+PR)
			player_data = FiveBerData[i][1];
			//check if the player has a run at this time
			//curr_player_data[0][0] is the timestamp of the first ever run
			if (curr_timestamp < player_data[0][0]){
				// if player doesn't have a run yet:
				// set their PR to 1hr as default
				curr_PRs[i][1] = "1:00:00";
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
		// Loop through everybody
    	for (let i = 0; i < player_count; i++){
      		//Calculate x_block and y_block coordinates
      		//0-indexed
      		curr_x_block = i % x_blocks;
      		curr_y_block = (i - curr_x_block)/x_blocks
      		
      		//Calculate the Rectangle
      		rect_x = margin_x + curr_x_block*(block_x + buffer_x);//margin + which block we're at
      		rect_y = margin_y + curr_y_block*(block_y + buffer_y);//ditto
      
      		//Draw the Rectangle/Block
      		ctx.fillStyle = '#FFD700';
      		ctx.fillRect(rect_x,rect_y,block_x,block_y);
      		
	  		//Text color
      		ctx.fillStyle = "#000000";//black
      		
			//Add Text
      		curr_center_x = rect_x + (block_x / 2);
			curr_center_y = rect_y + (block_y / 2);
			ctx.textBaseline = "center";
      		ctx.fillText(FiveBerData[i][0], curr_center_x, curr_center_y - (block_y / 4));
			ctx.textBaseline = "center";
			ctx.fillText(curr_PRs[i][1], curr_center_x, curr_center_y + (block_y / 4));
    	}
	});

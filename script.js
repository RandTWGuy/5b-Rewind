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
    const FiveBerData = 
      [
		  ['me',
		   [[1789344000000,1079450],[1789862400000,974417]]
		  ],
		  ['me2',
		   [[1789344000000,1089450],[1789862400000,984417]]
		  ]
	  ];
    const player_count = FiveBers.length;

	const curr_PRs = FiveBerData;//Will turn into [[player1,PR1],[player2,PR2]] eventually
	curr_player_data = [];//Will turn into [[date1,PR1],[date2,PR2]] eventually
	
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
    ctx.textBaseline = "middle";
	
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

		// //Calculate everyone's PRs at this time
		// for (let i = 0; i < player_count; i++){
		// 	//list of runs (timestamp+PR)
		// 	curr_player_data = FiveBerData[i][1]
		// 	//loop over all runs
		// 	for (let j = 0; j < curr_player_data.length; j++){
		// 		//the current run & when it was performed
		// 		curr_run = curr_player_data[j];
		// 		curr_run_timestamp = curr_run[0];
		// 		//if run was performed before current time, then it's a PR. 
		// 		//This is because the runs are ordered by time.
				
		// 	}
		// }
		// // Loop through everybody
  //   	for (let i = 0; i < player_count; i++){
  //     		//Calculate x_block and y_block coordinates
  //     		//0-indexed
  //     		curr_x_block = i % x_blocks;
  //     		curr_y_block = (i - curr_x_block)/x_blocks
      		
  //     		//Calculate the Rectangle
  //     		rect_x = margin_x + curr_x_block*(block_x + buffer_x);//margin + which block we're at
  //     		rect_y = margin_y + curr_y_block*(block_y + buffer_y);//ditto
      
  //     		//Draw the Rectangle/Block
  //     		ctx.fillStyle = '#FFD700';
  //     		ctx.fillRect(rect_x,rect_y,block_x,block_y);
      		
	 //  		//Text color
  //     		ctx.fillStyle = "#000000";//black
      		
		// 	//Add Text
  //     		curr_center_x = rect_x + (block_x / 2);
  //    		curr_center_y = rect_y + (block_y / 2);
  //     		//ctx.fillText(FiveBerData[i], curr_center_x, curr_center_y);
  //   	}
	});

	// canvas dimensions (update manually with the canvas!)
    let canvas_x = 750;
    let canvas_y = 750;
    
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
		  [
			  'me, the dev',
			  [
				  [1789344000000,1079450],
				  [1789862400000,974417]
			  ]
		  ],
		  [
			  'DraYoshi',
			  [
				  [1773446400000,721000],
				  [1777680000000,700283],
				  [1778284800000,646233],
				  [1780617600000,595567],
				  [1786320000000,582200]
			  ]
		  ],
		  [
			  'Numbly',
			  [
				  [1741305600000,1510167],
				  [1741651200000,1127400],
				  [1742601600000,1040100],
				  [1742688000000,925533],
				  [1743033600000,880767],
				  [1746316800000,780633],
				  [1747526400000,751600],
				  [1749427200000,705267],
				  [1749945600000,674500],
				  [1761177600000,663133],
				  [1762819200000,647000],
				  [1763078400000,633900],
				  [1764028800000,595667],
				  [1778716800000,542900],
				  [1778976000000,539967],
				  [1784851200000,505067],
				  [1786320000000,477483]
			  ]
		  ]
	  ];
    const player_count = FiveBerData.length;
	let player_data = [];//Will turn into [[date1,PR1],[date2,PR2]] eventually; changed for each player
	//Do we need the player tab in curr_PRs? Best if we keep it, think about removing it.
	
    //current x/y block number
    let curr_x_block;
    let curr_y_block;
    //rectangle corner coordinates
    let rect_x;
    let rect_y;
    //rectangle center coordinates
    let curr_center_x;
    let curr_center_y;
    
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

	//Function Code: Updating
	function update(curr_timestamp){
  		const curr_date = new Date(curr_timestamp);
  		
  		// Output as YYYYY-MM-DD. Ignore the time.
 		const formatted_date = curr_date.toISOString().split('T')[0];
  		display.textContent = formatted_date;

		const curr_PRs = structuredClone(FiveBerData);
		//Will turn into [[player1,PR1],[player2,PR2]] eventually
		//need player names 'cause we're gonna sort this thing in order
		//Calculate everyone's PRs at this time
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
		// Loop through everybody
    	for (let i = 0; i < player_count; i++){
      		//Calculate x_block and y_block coordinates
      		//0-indexed
      		curr_x_block = i % x_blocks;
      		curr_y_block = (i - curr_x_block)/x_blocks
      		
      		//Calculate the Rectangle
      		rect_x = margin_x + curr_x_block*(block_x + buffer_x);//margin + which block we're at
      		rect_y = margin_y + curr_y_block*(block_y + buffer_y);//ditto
      
      		//Clear the last block
			ctx.clearRect(rect_x,rect_y,block_x,block_y);
			//set color
			if (i == 0){
				ctx.fillStyle = 'gold';
			} else if (i == 1){
				ctx.fillStyle = 'silver';
			} else if (i == 2){
				ctx.fillStyle = 'peru';
			} else {
      			ctx.fillStyle = '#FFD700';
			}
			//draw rect
      		ctx.fillRect(rect_x,rect_y,block_x,block_y);
      		
	  		//Text color
      		ctx.fillStyle = "#000000";//black
      		
			//Calculate center of block
      		curr_center_x = rect_x + (block_x / 2);
			curr_center_y = rect_y + (block_y / 2);
			//Player name text
			ctx.textBaseline = "center";
      		ctx.fillText(curr_PRs[i][0], curr_center_x, curr_center_y - (block_y / 4));
			
			//PR time text
			let text;
			let PR_time = curr_PRs[i][1];
			if (PR_time == 3600000){
				//The PR_time is still a number for comparison purposes; 3600000 acts like infty on this scale.
				text = "NO RUN YET";
			} else {
				//Convert to mm:ss:xxx
				let PR_ms = PR_time%1000;
				PR_time = (PR_time - PR_ms)/1000;
				let PR_sec = PR_time%60;
				let PR_min = (PR_time - PR_sec)/60;
				//make sec always have two digits
				PR_sec = ('0' + PR_sec).slice(-2)
				//make ms always have three digits
				PR_ms = ('00' + PR_ms).slice(-3)
				
				//text
				text = `${PR_min}:${PR_sec}.${PR_ms}`;
			}
			//Display text
			ctx.textBaseline = "center";
			ctx.fillText(text, curr_center_x, curr_center_y + (block_y / 4));
    	}
	}

	//Run function once
	update(Number(slider.value));
	// Check if the slider is changing
	slider.addEventListener('input', (e) => {
 		update(Number(e.target.value));
	});

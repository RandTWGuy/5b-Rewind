	// canvas dimensions (update manually with the canvas!)
    let canvas_x = 750
    let canvas_y = 750
    
    // Margin
    let margin_x = 50;
    let margin_y = 50;
    
    // width and height of a single block
    let block_x = 100;
    let block_y = 100;
    
    //space between blocks
    let buffer_x = 25;
    let buffer_y = 25;

    //blocks that fit per axis
    let x_blocks = Math.floor((canvas_x - (margin_x * 2) - block_x)/(block_x + buffer_x)) + 1;
    let y_blocks = Math.floor((canvas_y - (margin_y * 2) - block_y)/(block_y + buffer_y)) + 1;
		
    // Drawing a rectangle over the whole canvas
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(0,0,canvas_x,canvas_y);


	// The slider
	// Start and End Dates
	const start_date = new Date('2018-11-02T00:00:00');
	const end_date = new Date();

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
	});

	// Initialize vars
    //List of 5b-ers
    const FiveBers = 
      ['Numbly','KorZen','1000%','DraYoshi','JJJ',
       'ItsMarker','ader_pulse','AntLadders','DrawfWizard','Trevarity',
	   'coppersalts','Mythical Rocket','MyShuckle','Meester Tweester','meanietweezie',
	   'me','CloverDrop','MatveiYT012','The Gamer Pug','yyy15err'];
    const player_count = FiveBers.length;
    //current x/y block number
    let curr_x_block = 0;
    let curr_y_block = 0;
    //rectangle corner coordinates
    let rect_x = 0;
    let rect_y = 0;
    //rectangle center coordinates
    let curr_center_x = 0;
    let curr_center_y = 0;
      
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
      //Text style
      ctx.font = "12px Arial";
      ctx.fillStyle = "#000000";//black
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
			
      //Add Text
      curr_center_x = rect_x + (block_x / 2);
      curr_center_y = rect_y + (block_y / 2);
      ctx.fillText(FiveBers[i], curr_center_x, curr_center_y);
    }

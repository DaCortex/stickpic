var RESOLUTION = 20;
var AVERAGE = true;
var LINE_WIDTH = "1";

function draw_line(context, start_x, start_y, end_x, end_y, color){
  context.beginPath();
  context.lineWidth = LINE_WIDTH;
  context.strokeStyle = color;
  context.moveTo(start_x, start_y);
  context.lineTo(end_x, end_y);
  context.stroke();
}

function draw_stick_figure(context, color, x_pos, y_pos, size){
  var angle_red   = ((color[0]/255.0) * 120.0)       * (Math.PI / 180.0);
  var angle_green = ((color[1]/255.0) * 120.0 + 120) * (Math.PI / 180.0);
  var angle_blue  = ((color[2]/255.0) * 120.0 + 240) * (Math.PI / 180.0);

  draw_line(context,
            x_pos + size*0.5,
            y_pos + size*0.5,
            x_pos + size*0.5 + size*0.5 * Math.sin(angle_red),
            y_pos + size*0.5 + size*0.5 * Math.cos(angle_red),
            "red");
  draw_line(context,
            x_pos + size*0.5,
            y_pos + size*0.5,
            x_pos + size*0.5 + size*0.5 * Math.sin(angle_green),
            y_pos + size*0.5 + size*0.5 * Math.cos(angle_green),
            "green");
  draw_line(context,
            x_pos + size*0.5,
            y_pos + size*0.5,
            x_pos + size*0.5 + size*0.5 * Math.sin(angle_blue),
            y_pos + size*0.5 + size*0.5 * Math.cos(angle_blue),
            "blue");
}

function image_to_stickpic(image_canvas){
  output_canvas = document.createElement("canvas");
  output_canvas.width = image_canvas.width;
  output_canvas.height = image_canvas.height;

  var amount_horizontal = Math.floor(image_canvas.width / RESOLUTION);
  var amount_vertical = Math.floor(image_canvas.height / RESOLUTION);

  var input_context = image_canvas.getContext('2d');
  var output_context = output_canvas.getContext('2d');

  output_context.fillStyle = "black";
  output_context.fillRect( 0, 0, output_canvas.width, output_canvas.height);

  for (var x = 0; x < amount_horizontal; x++) {
    for (var y = 0; y < amount_vertical; y++) {
      if(AVERAGE){
        var image_data = input_context.getImageData(x * RESOLUTION, y * RESOLUTION, RESOLUTION, RESOLUTION);

        var average = [0,0,0,0];
        for(var i = 0; i < image_data.data.length; i += 4)
        {
          average[0] += image_data.data[i];
          average[1] += image_data.data[i+1];
          average[2] += image_data.data[i+2];
          average[3] += image_data.data[i+3];
        }
        average[0] = average[0] / (image_data.data.length / 4);
        average[1] = average[1] / (image_data.data.length / 4);
        average[2] = average[2] / (image_data.data.length / 4);
        average[3] = average[3] / (image_data.data.length / 4);

        draw_stick_figure(output_context, average, x * RESOLUTION, y * RESOLUTION, RESOLUTION);
    }
    else{
        var image_data = input_context.getImageData(x * RESOLUTION, y * RESOLUTION, 1, 1);
        draw_stick_figure(output_context, image_data.data, x * RESOLUTION, y * RESOLUTION, RESOLUTION);
    }
    }
  }
  //output_context.stroke();
  return output_canvas;
  }  

var WIDTH = 1280;
var HEIGHT = 720;
document.getElementById('webcam').width = WIDTH;
document.getElementById('webcam').height = HEIGHT;

camera.init({
  width: WIDTH, // default: 640
  height: HEIGHT, // default: 480
  fps: 30, // default: 30
  mirror: true,  // default: false
  targetCanvas: null, //document.getElementById('webcam'), // default: null 

  onFrame: function(canvas) {
    var stickpic = image_to_stickpic(canvas);
    document.getElementById('webcam').getContext('2d').clearRect(0,0,WIDTH,HEIGHT);
    document.getElementById('webcam').getContext('2d').drawImage(stickpic,0,0);
    // do something with image data found in the canvas argument
  },

  onSuccess: function() {
    // stream succesfully started, yay!
  },

  onError: function(error) {
    // something went wrong on initialization
  },

  onNotSupported: function() {
    // instruct the user to get a better browser
  }
});


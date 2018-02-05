var RESOLUTION = 15;
var LINE_WIDTH = "1";
var FILENAME = "laila.jpg"

var img = new Image();
img.src = FILENAME;
var img_canvas = document.getElementById('image');
img_canvas.width = img.width;
img_canvas.height = img.height;

var stickfigure_canvas = document.getElementById('stickfigure');
stickfigure_canvas.width = img_canvas.width;
stickfigure_canvas.height = img_canvas.height;

var color = document.getElementById('color');

function draw_line(context, start_x, start_y, end_x, end_y, color){
  context.beginPath();
  context.lineWidth = LINE_WIDTH;
  context.strokeStyle = color;
  context.moveTo(start_x, start_y);
  context.lineTo(end_x, end_y);
  context.stroke();
}

function draw_stick_figure(context, color, x_pos, y_pos, size){
  context.clearRect(x_pos, y_pos, size, size);
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

function image_to_stickpic(image_canvas, stickpic_canvas){
  
  var amount_horizontal = Math.floor(image_canvas.width / RESOLUTION);
  var amount_vertical = Math.floor(image_canvas.height / RESOLUTION);

  for (var x = 0; x < amount_horizontal; x++) {
    for (var y = 0; y < amount_vertical; y++) {
      var image_data = img_canvas.getContext('2d').getImageData(x * RESOLUTION, y * RESOLUTION, RESOLUTION, RESOLUTION);

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

      draw_stick_figure(stickpic_canvas.getContext('2d'), average, x * RESOLUTION, y * RESOLUTION, RESOLUTION);
    }
  }
}

function array_to_rgba(array){
    return 'rgba(' + array[0] + ', ' + array[1] +
             ', ' + array[2] + ', ' + (array[3] / 255) + ')';
}

function pick(event) {
  var x = event.layerX;
  var y = event.layerY;
  var pixel = img_canvas.getContext('2d').getImageData(x, y, 1, 1);
  var rgba = array_to_rgba(pixel.data);
  color.style.background =  rgba;
  color.textContent = rgba;
}

img.onload = function() {
  img_canvas.getContext('2d').drawImage(img, 0, 0);
  img.style.display = 'none';
  image_to_stickpic(img_canvas,stickfigure_canvas);
};

img_canvas.addEventListener('mousemove', pick);
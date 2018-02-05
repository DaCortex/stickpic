var RESOLUTION = 10;
var LINE_WIDTH = "1";

var img = new Image();
img.src = 'RGB-space.jpg';
var img_canvas = document.getElementById('image');
img_canvas.width = img.width;
img_canvas.height = img.height;

var stickfigure_canvas = document.getElementById('stickfigure');
stickfigure_canvas.width = img_canvas.width;
stickfigure_canvas.height = img_canvas.height;

var color = document.getElementById('color');

function array_to_rgba(array){
    return 'rgba(' + array[0] + ', ' + array[1] +
             ', ' + array[2] + ', ' + (array[3] / 255) + ')';
}

function draw_line(canvas, start_x, start_y, end_x, end_y, color){
  ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.lineWidth = LINE_WIDTH;
  ctx.strokeStyle = color;
  ctx.moveTo(start_x, start_y);
  ctx.lineTo(end_x, end_y);
  ctx.stroke();
}

function draw_stick_figure(canvas, color, x_pos, y_pos, size){
  ctx = canvas.getContext('2d');
  ctx.clearRect(x_pos, y_pos, size, size);
  /*
  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "black";
  ctx.arc(x_pos + size*0.5,
          y_pos + size*0.5,
          size*0.5,
          0,
          2*Math.PI);
  ctx.stroke();
  */
  var angle_red   = ((color[0]/255.0) * 120.0)       * (Math.PI / 180.0);
  var angle_green = ((color[1]/255.0) * 120.0 + 120) * (Math.PI / 180.0);
  var angle_blue  = ((color[2]/255.0) * 120.0 + 240) * (Math.PI / 180.0);

  draw_line(canvas,
            x_pos + size*0.5,
            y_pos + size*0.5,
            x_pos + size*0.5 + size*0.5 * Math.sin(angle_red),
            y_pos + size*0.5 + size*0.5 * Math.cos(angle_red),
            "red");
  draw_line(canvas,
            x_pos + size*0.5,
            y_pos + size*0.5,
            x_pos + size*0.5 + size*0.5 * Math.sin(angle_green),
            y_pos + size*0.5 + size*0.5 * Math.cos(angle_green),
            "green");
  draw_line(canvas,
            x_pos + size*0.5,
            y_pos + size*0.5,
            x_pos + size*0.5 + size*0.5 * Math.sin(angle_blue),
            y_pos + size*0.5 + size*0.5 * Math.cos(angle_blue),
            "blue");
}

function image_to_stickpic(image_canvas, stickpic_canvas){
  
  var amount_horizontal = Math.floor(800 / RESOLUTION);
  var amount_vertical = Math.floor(449 / RESOLUTION);

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

      draw_stick_figure(stickpic_canvas, average, x * RESOLUTION, y * RESOLUTION, RESOLUTION);
    }
  }
}

function pick(event) {
  var x = event.layerX;
  var y = event.layerY;
  var pixel = img_canvas.getContext('2d').getImageData(x, y, 1, 1);
  var rgba = array_to_rgba(pixel.data);
  color.style.background =  rgba;
  color.textContent = rgba;
  //draw_stick_figure(stickfigure_canvas, pixel, 0, 0, RESOLUTION);
}

img.onload = function() {
  img_canvas.getContext('2d').drawImage(img, 0, 0);
  img.style.display = 'none';
  image_to_stickpic(img_canvas,stickfigure_canvas);
};

img_canvas.addEventListener('mousemove', pick);
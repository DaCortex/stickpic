var RESOLUTION = 20;
var LINE_WIDTH = "1";

var img = new Image();
img.src = 'RGB-space.jpg';
var img_canvas = document.getElementById('image');
var stickfigure_canvas = document.getElementById('stickfigure');
var color = document.getElementById('color');

img.onload = function() {
  img_canvas.getContext('2d').drawImage(img, 0, 0);
  img.style.display = 'none';
};

function pixel_to_rgba(pixel){
    return 'rgba(' + pixel.data[0] + ', ' + pixel.data[1] +
             ', ' + pixel.data[2] + ', ' + (pixel.data[3] / 255) + ')';
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

function draw_stick_figure(canvas, pixel, x_pos, y_pos, size){
  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "black";
  ctx.arc(x_pos + size*0.5,
          y_pos + size*0.5,
          size*0.5,
          0,
          2*Math.PI);
  ctx.stroke();

  var angle_red   = ((pixel.data[0]/255.0) * 120.0)       * (Math.PI / 180.0);
  var angle_green = ((pixel.data[1]/255.0) * 120.0 + 120) * (Math.PI / 180.0);
  var angle_blue  = ((pixel.data[2]/255.0) * 120.0 + 240) * (Math.PI / 180.0);

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

function pick(event) {
  var x = event.layerX;
  var y = event.layerY;
  var pixel = img_canvas.getContext('2d').getImageData(x, y, 1, 1);
  var rgba = pixel_to_rgba(pixel);
  color.style.background =  rgba;
  color.textContent = rgba;
  draw_stick_figure(stickfigure_canvas, pixel, 0, 0, RESOLUTION);
}

img_canvas.addEventListener('mousemove', pick);
var file;
var img = new Image();
var original_image_data;

function image_upload() {
  var preview = document.querySelector('img');
  file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    //preview.src = reader.result;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var contrast_ind = document.getElementById('contrast_ind');
    var contrast = document.getElementById('contrast_val');
    contrast_ind.innerHTML = '0';
    contrast.value = 0;

    img = new Image();
    img.onload = function()
    {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      original_image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    img.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

function pixel_range_helper(val) {
  return Math.max(Math.min(val, 255), 0);
}

function contrast() {
  var contrast_ind = document.getElementById('contrast_ind');
  var contrast = document.getElementById('contrast_val');

  if (file) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var c = parseFloat(contrast.value);
    var factor = (259*(c+255))/(255*(259-c));
    console.log("factor value");
    console.log(factor);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = pixel_range_helper((factor * (original_image_data.data[i] - 128)) + 128);
      imageData.data[i+1] = pixel_range_helper((factor * (original_image_data.data[i+1] - 128)) + 128);
      imageData.data[i+2] = pixel_range_helper((factor * (original_image_data.data[i+2] - 128)) + 128);
    }

    ctx.putImageData(imageData, 0, 0);
    contrast_ind.innerHTML = contrast.value;

  } else {
    console.log("no file");
    contrast.value = 0;
  }
}

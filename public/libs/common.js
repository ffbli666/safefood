resizeImage = function(image, width, height){
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/png");
};

var ImageUpload = function (element_id, preview_id) {
    var element = document.getElementById(element_id);
    var preview = document.getElementById(preview_id);
    var img = new Image();
    var input;
    if (element.type == "file") {
        input = element;
    }
    else {
        input = document.createElement("input");
        input.setAttribute("type", "file");
        element.onclick = function() {
            input.click();
        };
    }
    input.accept = "image/*";
    input.onchange = function () {
        var file = input.files[0];
        if (file.type.match(input.accept)) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var timg = new Image();
                timg.onload = function() {
                    img = new Image();
                    img.src = resizeImage(timg, 320, 320);
                    preview.innerHTML = "";
                    preview.appendChild(img);
                };
                timg.src = reader.result;
            }
            reader.readAsDataURL(file);
        }
    };

    var getImage = function() {
        return img.src;
    };

    return {
        getImage: getImage
    };
};
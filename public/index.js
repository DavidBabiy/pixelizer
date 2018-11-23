const scale = 1;
let file;
let dropArea = document.getElementById('drop-area')


function handleFiles(files) {
    file = files[0];
    if(file.type === 'image/png' || file.type === 'image/jpeg'){
        hideDrag();
        uploadFile();
    } else {
        alert('Please use only PNG or JPG')
    }

}

function showButton() {
    document.getElementById("b2").style.display = "inline";
}

function hideDrag() {
    document.getElementById("drop-area").style.display = "none";
    document.getElementById("demo-int").style.display = "none";
}



function uploadFile() {
    let formData = new FormData();
    formData.append('image', file);
    $.ajax({
        type: "POST",
        url: "/image/preview",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            drawPreview(data);

        }
    });
    console.log('File ' + file.name + ' sent to server');

    showButton();
    return false;
}

function downloadFile() {
     if (file === undefined) {
         alert('Please upload file');
        return false;
     }
    let formData = new FormData();
    formData.append('image', file);
    let request = new XMLHttpRequest();
    request.responseType = "blob";
    request.onload = function (event) {
        if (request.status === 200) {
            let blob = request.response;
            console.log(blob.type)
            saveBlob(blob, file.name.split(".")[0] + ".txt");
        }
    };
    request.open('POST', '/image/convert');
    request.send(formData);
    console.log('File ' + file.name + ' sent to server');
    return false;
}

function saveBlob(blob, fileName) {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    console.log(window.URL.createObjectURL(blob))
}

function drawPreview(pixelsMat) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    canvas.height = pixelsMat.length * scale;
    canvas.width = pixelsMat[0].length * scale;
    ctx.scale(scale, scale);
    for (let i = 0; i < pixelsMat.length; i++) {
        for (let j = 0; j < pixelsMat[i].length; j++) {
            let pixel = pixelsMat[i][j];
            ctx.fillStyle = 'rgba(' + pixel.r + ',' + pixel.g + ',' + pixel.b + ',' + pixel.a + ')';
            ctx.fillRect(j, i, 1, 1);
        }
    }
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

function highlight(e) {
    dropArea.classList.add('highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    let files = e.dataTransfer.files
    if(files.length > 0){
        handleFiles(files)
    }
}
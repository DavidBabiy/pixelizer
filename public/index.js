let file;

function  handleFiles(files) {
    file = files[0];
    document.getElementById("fileName").innerHTML = file.name;
}

function submitForm() {
    let formData = new FormData();
    formData.append('image', file);
    let request = new XMLHttpRequest();
    request.open('POST', '/file/upload');
    request.send(formData);
    console.log('File ' + file.name + ' sent to server');
   return false;
}


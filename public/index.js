let file;

function  handleFiles(files) {
    file = files[0];
    document.getElementById("fileName").innerHTML = file.name;
}

function submitForm() {
    let formData = new FormData();
    formData.append('image', file);
    let request = new XMLHttpRequest();
    request.responseType = "blob";
    request.onload = function(event){
        let blob = request.response;
        saveBlob(blob,file.name);
    }
    request.open('POST', '/file/upload');
    request.send(formData);
    console.log('File ' + file.name + ' sent to server');
   return false;
}

function saveBlob(blob, fileName) {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
 a.download = fileName;
a.click();
}

let file;

function  handleFiles(files) {
    file = files[0];
    document.getElementById("fileName").innerHTML = file.name;
    submitForm();
}

function submitForm() {
    let formData = new FormData();
    formData.append('image', file);
    let request = new XMLHttpRequest();
    request.responseType = "blob";
    request.onload = function(event){
        if (request.status === 200) {
            let blob = request.response;
            saveBlob(blob, file.name.split(".")[0] + ".txt");
        }
    };
    request.open('POST', '/file/convert');
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

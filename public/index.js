function submitForm() {
    console.log("Hello I am MagicButton");
    return false;
}

function  handleFiles(files) {
    let file = files[0];
    document.getElementById("fileName").innerHTML = file.name;
}

function submitForm() {
   /* let selectedFile = temporary;
    let formData = new FormData();
    formData.append('clientFile',selectedFile);
    let request = new XMLHttpRequest();
    request.open('POST','');
    request.send(formData);*/
   console.log(file.name);
   return false;
}


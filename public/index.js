function submitForm() {
    console.log("Hello I am MagicButton");
    return false;
}

function  handleFiles(files) {
    let selectedFile = files[0];
    document.getElementById("fileName").innerHTML = selectedFile.name;
    return selectedFile;
}


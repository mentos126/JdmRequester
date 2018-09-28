let text = "";

function loadFileAsText(){
    let myFile = document.getElementById("myFile").files[0]
    let fileReader = new FileReader()
    fileReader.onload = fileLoadedEvent => {
        let textFromFileLoaded = fileLoadedEvent.target.result
        text = textFromFileLoaded
        console.log(text)
    }
    fileReader.readAsText(myFile, "UTF-8")
}

let text = "";

function loadFileAsText() {
    let myFile = document.getElementById("myFile").files[0]
    let fileReader = new FileReader()
    fileReader.onload = fileLoadedEvent => {
        let textFromFileLoaded = fileLoadedEvent.target.result
        text = textFromFileLoaded
        
        let code = text.substring(text.indexOf("<CODE>") + 6, text.indexOf("</CODE>"))
        
        let def = code.substring(code.indexOf("<def>") + 5, code.indexOf("</def>"))
        document.getElementById("def").innerHTML = def
        
        let start = "// les types de noeuds (Nodes Types) : nt;ntid;'ntname'"
        let end = "// les noeuds/termes (Entries) : e;eid;'name';type;w;'formated name' "
        let nodeTypes = code.substring(code.indexOf(start) + start.length, code.indexOf(end))
        nodeTypes = nodeTypes.split("nt;")
        nodeTypes.shift()
        for(let i in nodeTypes){
            nodeTypes[i].replace(/(\r\n|\n|\r)/gm,"")
            nodeTypes[i] +="LOL"
        }
        let s = "<ul>"
        for(let i of nodeTypes){
            s += "<li>"+i+"</li>"
        }
        s += "</ul>" 
        document.getElementById("node_type").innerHTML = s

        /*start = end
        end = "// les types de relations (Relation Types) : rt;rtid;'trname';'trgpname';'rthelp' "
        let entries = code.substring(code.indexOf(start) + start.length, code.indexOf(end))
        entries = entries.split("e;")
        entries.shift()
        s = "<ul>"
        for(let i of entries){
            s += "<li>"+i+"</li>"
        }
        s += "</ul>" 
        document.getElementById("entries").innerHTML = s

        start = end
        end = "// les relations sortantes : r;rid;node1;node2;type;w "
        let relationTypes = code.substring(code.indexOf(start) + start.length, code.indexOf(end))
        relationTypes = relationTypes.split("rt;")
        relationTypes.shift()
        s = "<ul>"
        for(let i of relationTypes){
            s += "<li>"+i+"</li>"
        }
        s += "</ul>" 
        document.getElementById("relation_types").innerHTML = s

        start = end
        end = "// les relations entrantes : r;rid;node1;node2;type;w "
        let relOut = code.substring(code.indexOf(start) + start.length, code.indexOf(end))
        relOut = relOut.split("r;")
        relOut.shift()
        s = "<ul>"
        for(let i of relOut){
            s += "<li>"+i+"</li>"
        }
        s += "</ul>" 
        document.getElementById("rel_out").innerHTML = s

        start = end
        end = "// END"
        let relIn = code.substring(code.indexOf(start) + start.length, code.indexOf(end))
        relIn = relIn.split("r;")
        relIn.shift()
        s = "<ul>"
        for(let i of relIn){
            s += "<li>"+i+"</li>"
        }
        s += "</ul>" 
        document.getElementById("rel_in").innerHTML = s*/

        console.log("code",nodeTypes)
        
    }
    fileReader.readAsText(myFile, "UTF-8")

}



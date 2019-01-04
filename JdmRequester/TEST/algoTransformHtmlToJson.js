//TODO
//avoir une liste de type de relation qui ne sontpas utilisable
//hasher le text
//remodulation de l'objet

//label utile pour parser le code
const labelCodeInit = "<CODE>"
const labelCodeEnd = "</CODE>"
const labelDefInit = "<def>"
const labelDefEnd = "</def>"
const labelTypesNode = "// les types de noeuds (Nodes Types) : nt;ntid;'ntname'"
const labelEntries = "// les noeuds/termes (Entries) : e;eid;'name';type;w;'formated name' "
const labelRelationsType = "// les types de relations (Relation Types) : rt;rtid;'trname';'trgpname';'rthelp' "
const labelRelationOut = "// les relations sortantes : r;rid;node1;node2;type;w "
const labelRelationIn = "// les relations entrantes : r;rid;node1;node2;type;w "
const labelEnd = "// END"
const labelAfter = "// "

//fonction de comparaison des nodes pour sort
function compareEntriesWeight(a, b) {
    if (parseInt(a[3]) < parseInt(b[3]))
        return 1;
    if (parseInt(a[3]) > parseInt(b[3]))
        return -1;
    return 0;
}

//fonction de comparaison des relations pour sort
function compareRelationsWeight(a, b) {
    if (parseInt(a.w) < parseInt(b.w))
        return 1;
    if (parseInt(a.w) > parseInt(b.w))
        return -1;
    return 0;
}


//li le texte dans l'input
function loadFileAsText() {
    let text = "";
    let myFile = document.getElementById("myFile").files[0]
    let fileReader = new FileReader()
    fileReader.onload = fileLoadedEvent => {
        //recupere text du fichier
        let textFromFileLoaded = fileLoadedEvent.target.result
        text = textFromFileLoaded

        //TODO hash here in MD5
        let hashedText = "MD5";

        //recupere code utilisable du text
        let code = text.substring(text.indexOf(labelCodeInit) + labelCodeInit.length, text.indexOf(labelCodeEnd))
        let copyCode = code.slice(0, code.length - 1)

        //recupere definition du code
        let def = code.substring(code.indexOf(labelDefInit) + labelDefInit.length, code.indexOf(labelDefEnd))
        //document.getElementById("def").innerHTML = def

        //decoupe le code pour en sortir une liste de type de noeud
        let start = labelTypesNode
        let end = labelEntries
        let preIndex = code.indexOf(start);
        let searchIndex = preIndex + code.substring(preIndex + start.length).indexOf(labelAfter);
        let nodeTypes = code.substring(code.indexOf(start) + start.length, preIndex+searchIndex)
        nodeTypes = nodeTypes.split("nt;")
        nodeTypes.shift()
        let nodeTypesRes = []
        if(start !== -1 && searchIndex !== -1){
            for (let i in nodeTypes) {
                nodeTypes[i] = nodeTypes[i].slice(0, -1)
                if (i == nodeTypes.length - 1) {
                    nodeTypes[i] = nodeTypes[i].slice(0, -2)
                }
                nodeTypesRes.push(nodeTypes[i].split(";"))
            }
        }

        //decoupe le code pour en sortir une liste de noeuds
        start = end
        end = labelRelationsType
        preIndex = code.indexOf(start);
        searchIndex = preIndex + code.substring(preIndex + start.length).indexOf(labelAfter);
        let entries = code.substring(code.indexOf(start) + start.length, preIndex+searchIndex)
        entries = entries.split("e;")
        entries.shift()
        let entriesRes = []
        if(start !== -1 && searchIndex !== -1){
            for (let i in entries) {
                entries[i] = entries[i].slice(0, -1)
                if (i == entries.length - 1) {
                    entries[i] = entries[i].slice(0, -2)
                }
                entriesRes.push(entries[i].split(";"))
            }
        }

        //transforme la liste de noeud pour y mettre le type de noeud
        let entriesNodeTypesRes = []
        for (let entRes of entriesRes) {
            for (let r of nodeTypesRes) {
                if (r[0] == entRes[2]) {
                    let temp = { ...entRes
                    }
                    temp[2] = r[1]
                    entriesNodeTypesRes.push(temp)
                    break
                }
            }
        }
        entriesNodeTypesRes.sort(compareEntriesWeight)
        
        //decoupe le code pour en recouperer le type de relations
        code = copyCode.slice(0, copyCode.length - 1)
        start = end
        end = labelRelationOut
        preIndex = code.indexOf(start);
        searchIndex = preIndex + code.substring(preIndex + start.length).indexOf(labelAfter);
        let relationTypes = code.substring(code.indexOf(start) + start.length, preIndex+searchIndex)
        relationTypes = relationTypes.split("rt;")
        relationTypes.shift()
        let relationTypesRes = []
        if(start !== -1 && searchIndex !== -1){
            for (let i in relationTypes) {
                relationTypes[i] = relationTypes[i].slice(0, -1)
                if (i == relationTypes.length - 1) {
                    relationTypes[i] = relationTypes[i].slice(0, -2)
                }
                relationTypesRes.push(relationTypes[i].split(";"))
            }
        }

        //decoupe le code pour en sortir une liste de relation sortante
        start = end
        end = labelRelationIn
        preIndex = code.indexOf(start);
        searchIndex = preIndex + code.substring(preIndex + start.length).indexOf(labelAfter);
        let relOut = code.substring(code.indexOf(start) + start.length, searchIndex)
        relOut = relOut.split("r;")
        relOut.shift()
        let relOutRes = []
        if(start !== -1 && searchIndex !== -1){
            for (let i in relOut) {
                relOut[i] = relOut[i].slice(0, -1)
                if (i == relOut.length - 1) {
                    relOut[i] = relOut[i].slice(0, -2)
                }
                relOutRes.push(relOut[i].split(";"))
            }
        }

        //trouve le noeud demandé
        let theNode = {}
        if(relOutRes.length > 0){
            for (let n of entriesNodeTypesRes) {
                if (parseInt(n[0]) == parseInt(relOutRes[0][1])) {
                    theNode = {
                        eid: n[0],
                        name: n[1],
                        ntname: n[2],
                        w: n[3],
                        formatedName: n[4]
                    }
                    break
                }
            }
        }

        //transforme la liste de relation sortante pour y mettre le type de relation
        let relOutTypesRes = []
        for (let ro of relOutRes) {
            let temp = {
                rid: ro[0],
                node1: ro[1],
                node2: ro[2],
                type: ro[3],
                w: ro[4]
            }
            temp.node1 = { ...theNode
            }
            for (let n of entriesNodeTypesRes) {
                if (parseInt(n[0]) == parseInt(temp.node2)) {
                    temp.node2 = {
                        eid: n[0],
                        name: n[1],
                        ntname: n[2],
                        w: n[3],
                        formatedName: n[4]
                    }
                    break
                }
            }
            for (let rt of relationTypesRes) {
                if (rt[0] == ro[3]) {
                    temp.type = {
                        trname: rt[1],
                        trgpname: rt[2],
                        rthelp: rt[3]
                    }
                    break
                }
            }
            relOutTypesRes.push(temp)
        }
        relOutTypesRes.sort(compareRelationsWeight)

        //decoupe le code pour en sortir une liste de relation entrante
        start = end
        end = labelEnd
        preIndex = code.indexOf(start);
        searchIndex = preIndex + code.substring(preIndex + start.length).indexOf(labelAfter);
        let relIn = code.substring(code.indexOf(start) + start.length, searchIndex)
        relIn = relIn.split("r;")
        relIn.shift()
        let relInRes = []
        if(start !== -1 && searchIndex !== -1){
            for (let i in relIn) {
                relIn[i] = relIn[i].slice(0, -1)
                if (i == relIn.length - 1) {
                    relIn[i] = relIn[i].slice(0, -2)
                }
                relInRes.push(relIn[i].split(";"))
            }
        }

        //trouve le noeud demandé si pas de sortant
        if(relInRes.length > 0){
            theNode = {}
            for (let n of entriesNodeTypesRes) {
                if (parseInt(n[0]) == parseInt(relInRes[0][2])) {
                    theNode = {
                        eid: n[0],
                        name: n[1],
                        ntname: n[2],
                        w: n[3],
                        formatedName: n[4]
                    }
                    break
                }
            }
        }

        //transforme la liste de relation sortante pour y mettre le type de relation
        let relInTypesRes = []
        for (let ro of relInRes) {
            let temp = {
                rid: ro[0],
                node1: ro[1],
                node2: ro[2],
                type: ro[3],
                w: ro[4]
            }
            for (let n of entriesNodeTypesRes) {
                if (parseInt(n[0]) == parseInt(temp.node1)) {
                    temp.node1 = {
                        eid: n[0],
                        name: n[1],
                        ntname: n[2],
                        w: n[3],
                        formatedName: n[4]
                    }
                    break
                }
            }
            temp.node2 = { ...theNode
            }
            for (let rt of relationTypesRes) {
                if (rt[0] == ro[3]) {
                    temp.type = {
                        trname: rt[1],
                        trgpname: rt[2],
                        rthelp: rt[3]
                    }
                    break
                }
            }
            relInTypesRes.push(temp)
        }
        relInTypesRes.sort(compareRelationsWeight)

        let RESULTAT = {
            node: theNode,
            hashMD5: hashedText,
            relIn: relInTypesRes,
            relOut: relOutTypesRes,
            defs: def
        }

        for (let x of RESULTAT.relIn) {
            if (x.node1 == undefined || x.node1 == null) {
                RESULTAT.relIn.splice(RESULTAT.relIn.indexOf(x), 1);
            }
            if (x.node2 == undefined || x.node2 == null) {
                RESULTAT.relIn.splice(RESULTAT.relIn.indexOf(x), 1);

            }
        }

        for (let x of RESULTAT.relOut) {
            if (x.node1 == undefined || x.node1 == null) {
                RESULTAT.relOut.splice(RESULTAT.relOut.indexOf(x), 1);
            }
            if (x.node2 == undefined || x.node2 == null) {
                RESULTAT.relOut.splice(RESULTAT.relOut.indexOf(x), 1);
            }
        }

        console.log("END")
        console.log(RESULTAT)
        return RESULTAT

    }
    fileReader.readAsText(myFile, "UTF-8")

}
let ouis;
let regex = /[1234567890abcdefABCDEF]{4}\.[1234567890abcdefABCDEF]{4}\.[1234567890abcdefABCDEF]{4}|[1234567890abcdefABCDEF]{4}\-[1234567890abcdefABCDEF]{4}\-[1234567890abcdefABCDEF]{4}|[1234567890abcdefABCDEF]{2}:[1234567890abcdefABCDEF]{2}:[1234567890abcdefABCDEF]{2}:[1234567890abcdefABCDEF]{2}:[1234567890abcdefABCDEF]{2}:[1234567890abcdefABCDEF]{2}|[1234567890abcdefABCDEF]{2}-[1234567890abcdefABCDEF]{2}-[1234567890abcdefABCDEF]{2}-[1234567890abcdefABCDEF]{2}-[1234567890abcdefABCDEF]{2}-[1234567890abcdefABCDEF]{2}|[1234567890abcdefABCDEF]{12}/gi;

async function getOuis() {
    let response = await fetch("/ouis.min.txt");
    ouis = (await response.text()).split("\n");
}

function findOui(oui) {
    let lastRealManufacturer = "";
    for (line of ouis) {
        let line_oui = line.slice(0, 6);
        let manufacturer = line.slice(6);
        if (manufacturer.trim() == "") manufacturer = lastRealManufacturer;
        else lastRealManufacturer = manufacturer;
        if (line_oui.toUpperCase().trim() === oui.toUpperCase().trim()) {
            return manufacturer;
        }
    }
}

function isHex(item) {
    item = item.toLowerCase();
    let valid = "abcdef1234567890".split("");
    let returnVal = true;
    item.split("").forEach(character => {
        if (!valid.includes(character)) returnVal = false;
    });
    return returnVal;
}

function findOuis() {
    let textbox = document.getElementById("ouis");
    let list = textbox.value.split("\n");
    let response = "";

    for (item of list) {
        item = item.trim();
        if (item.length == 6 && isHex(item)) {
            response += `${item} (${findOui(item) || "No owner"})\n`;
        } else {
            response += `${item.replace(regex, (match, index) => {
                let newMatch = match.replaceAll("-", "").replaceAll(":", "").replaceAll(".", "").slice(0, 6);
                return `${match} (${findOui(newMatch) || "No owner"})`;
            })}\n`;
        }
    }
    textbox.value = response;
    navigator.clipboard.writeText(response);
}

getOuis();
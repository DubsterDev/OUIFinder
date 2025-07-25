import { readFile, writeFile } from "node:fs/promises";

let ouis1 = await(await fetch("https://standards-oui.ieee.org/")).text();
let ouis2 = ouis1.split("\n");
let ouis = [];

ouis2.forEach(line => {
    if (line.includes("(hex)")) {
        let split = line.split("(hex)");
        let result = {
            "oui": split[0].trim(),
            "owner": split[1].trim()
        };
        ouis.push(result)
    }
});

ouis.sort((a, b) => a.owner.localeCompare(b.owner));

let txtOuis = "";

ouis.forEach(oui => {
    txtOuis += `${oui.oui.replaceAll("-", "")}${oui.owner}\n`;
});

await writeFile("public/ouis.txt", txtOuis);

let minOuis = "";
let prevOwner = "";
ouis.forEach(oui => {
    minOuis += `${oui.oui.replaceAll("-", "")}${prevOwner == oui.owner ? "" : oui.owner}
`;
    prevOwner = oui.owner;
})

await writeFile("public/ouis.min.txt", minOuis);

const indexHtml = await readFile("public/index.html", {encoding: "utf-8"});

const indexHtmlLines = indexHtml.split("\n");
let lineNumberToReplace = indexHtmlLines.length;
indexHtmlLines.forEach((line, i) => {
    if (line.includes("<!-- [OUIGrabber] Next line is last updated date -->")) {
        lineNumberToReplace = i + 1;
    }
});

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const dateObj = new Date();

const date = `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;

indexHtmlLines[lineNumberToReplace] = `    <p class="last_updated">Data last fetched from <a href="https://standards-oui.ieee.org/">standards-oui.ieee.org</a> on ${date}</p>`;

await writeFile("public/index.html", indexHtmlLines.join("\n"));
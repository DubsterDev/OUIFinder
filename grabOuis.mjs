import { writeFile } from "node:fs/promises";

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
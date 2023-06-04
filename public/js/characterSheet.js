document.querySelector("#strScore").addEventListener("change", updateStr);
document.querySelector("#dexScore").addEventListener("change", updateDex);
document.querySelector("#conScore").addEventListener("change", updateCon);
document.querySelector("#intScore").addEventListener("change", updateInt);
document.querySelector("#wisScore").addEventListener("change", updateWis);
document.querySelector("#chaScore").addEventListener("change", updateCha);
document.querySelector("#race").addEventListener("change", updateRace);
document.querySelector("#class").addEventListener("change", updateClass);


onPageLoad();


function updateRace() {
    let race = document.getElementById("race");

    updateStr();
    updateDex();
    updateCon();
    updateInt();
    updateWis();
    updateCha();

    document.getElementById("raceName").innerHTML = race.options[race.value-1].innerHTML;
    document.getElementById("raceDesc").innerHTML = "<i>" + race.options[race.value-1].getAttribute("data-descRace") + "</i>";
    document.getElementById("raceTraits").innerHTML = "<strong>Racial Traits: </strong>" + race.options[race.value-1].getAttribute("data-traitsRace");
}

function updateClass() {
    let charClass = document.getElementById("class");

    document.getElementById("className").innerHTML = charClass.options[charClass.value-1].innerHTML;
    document.getElementById("classDesc").innerHTML = "<i>" + charClass.options[charClass.value-1].getAttribute("data-classDesc") + "</i>";
    document.getElementById("classHD").innerHTML = "<strong>Hit Die: </strong>d" + charClass.options[charClass.value-1].getAttribute("data-classHD");
    document.getElementById("classPrimAbi").innerHTML = "<strong>Primary Attribute: </strong>" + charClass.options[charClass.value-1].getAttribute("data-classPrimAbi");
    document.getElementById("classSaves").innerHTML = "<strong>Saves: </strong>" + charClass.options[charClass.value-1].getAttribute("data-classSaves");

}

function updateStr() {
    let strScore = document.getElementById("strScore").value;
    let strRace = 0;
    let race = document.getElementById("race");

    if (race.options[race.value-1].getAttribute("data-strRace").length != 0) {
        strRace = race.options[race.value-1].getAttribute("data-strRace");
    }

    if ( /['^\d+$']/.test(strScore) )  {
        document.getElementById("strMod").innerHTML = getMod(parseInt(strScore) + parseInt(strRace));
    }
    else {
        document.getElementById("strMod").innerHTML = "-";
    }
    document.getElementById("strTotal").innerHTML = parseInt(strScore) + parseInt(strRace);
    document.getElementById("strRace").innerHTML = strRace;
}

function updateDex() {
    let dexScore = document.getElementById("dexScore").value;
    let dexRace = 0;
    let race = document.getElementById("race");

    if (race.options[race.value-1].getAttribute("data-dexRace").length != 0) {
        dexRace = race.options[race.value-1].getAttribute("data-dexRace");
    }

    if ( /['^\d+$']/.test(dexScore) )  {
        document.getElementById("dexMod").innerHTML = getMod(parseInt(dexScore) + parseInt(dexRace));
    }
    else {
        document.getElementById("dexMod").innerHTML = "-";
    }
    document.getElementById("dexTotal").innerHTML = parseInt(dexScore) + parseInt(dexRace);
    document.getElementById("dexRace").innerHTML = dexRace;
}

function updateCon() {
    let conScore = document.getElementById("conScore").value;
    let conRace = 0;
    let race = document.getElementById("race");

    if (race.options[race.value-1].getAttribute("data-conRace").length != 0) {
        conRace = race.options[race.value-1].getAttribute("data-conRace");
    }

    if ( /['^\d+$']/.test(conScore) )  {
        document.getElementById("conMod").innerHTML = getMod(parseInt(conScore) + parseInt(conRace));
    }
    else {
        document.getElementById("conMod").innerHTML = "-";
    }
    document.getElementById("conTotal").innerHTML = parseInt(conScore) + parseInt(conRace);
    document.getElementById("conRace").innerHTML = conRace;
}

function updateInt() {
    let intScore = document.getElementById("intScore").value;
    let intRace = 0;
    let race = document.getElementById("race");

    if (race.options[race.value-1].getAttribute("data-intRace").length != 0) {
        intRace = race.options[race.value-1].getAttribute("data-intRace");
    }

    if ( /['^\d+$']/.test(intScore) )  {
        document.getElementById("intMod").innerHTML = getMod(parseInt(intScore) + parseInt(intRace));
    }
    else {
        document.getElementById("intMod").innerHTML = "-";
    }
    document.getElementById("intTotal").innerHTML = parseInt(intScore) + parseInt(intRace);
    document.getElementById("intRace").innerHTML = intRace;
}

function updateWis() {
    let wisScore = document.getElementById("wisScore").value;
    let wisRace = 0;
    let race = document.getElementById("race");

    if (race.options[race.value-1].getAttribute("data-wisRace").length != 0) {
        wisRace = race.options[race.value-1].getAttribute("data-wisRace");
    }

    if ( /['^\d+$']/.test(wisScore) )  {
        document.getElementById("wisMod").innerHTML = getMod(parseInt(wisScore) + parseInt(wisRace));
    }
    else {
        document.getElementById("wisMod").innerHTML = "-";
    }
    document.getElementById("wisTotal").innerHTML = parseInt(wisScore) + parseInt(wisRace);
    document.getElementById("wisRace").innerHTML = wisRace;
}

function updateCha() {
    let chaScore = document.getElementById("chaScore").value;
    let chaRace = 0;
    let race = document.getElementById("race");

    if (race.options[race.value-1].getAttribute("data-chaRace").length != 0) {
        chaRace = race.options[race.value-1].getAttribute("data-chaRace");
    }

    if ( /['^\d+$']/.test(chaScore) )  {
        document.getElementById("chaMod").innerHTML = getMod(parseInt(chaScore) + parseInt(chaRace));
    }
    else {
        document.getElementById("chaMod").innerHTML = "-";
    }
    document.getElementById("chaTotal").innerHTML = parseInt(chaScore) + parseInt(chaRace);
    document.getElementById("chaRace").innerHTML = chaRace;
}

function getMod(ability) {
    return Math.floor((ability-10)/2)
}

function onPageLoad() {
    document.getElementById('race').value = document.getElementById('raceId').value;
    document.getElementById('class').value = document.getElementById('classId').value;
    document.getElementById(document.getElementById('genderId').value).checked = true;
    updateRace();
    updateClass();
}
document.querySelector("#strScore").addEventListener("change", updateStr);
document.querySelector("#dexScore").addEventListener("change", updateDex);
document.querySelector("#conScore").addEventListener("change", updateCon);
document.querySelector("#intScore").addEventListener("change", updateInt);
document.querySelector("#wisScore").addEventListener("change", updateWis);
document.querySelector("#chaScore").addEventListener("change", updateCha);
document.querySelector("#race").addEventListener("change", updateRace);
document.querySelector("#class").addEventListener("change", updateClass);
document.querySelector("#newCharForm").addEventListener("submit", function(event) {
  validateForm(event);
});


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
    document.getElementById("strMod").innerHTML = "-";

    if (race.options[race.value-1].getAttribute("data-strRace").length != 0) {
        strRace = race.options[race.value-1].getAttribute("data-strRace");
    }

    if ( /['^\d+$']/.test(strScore) )  {
        document.getElementById("strMod").innerHTML = getMod(parseInt(strScore) + parseInt(strRace));
    }
    else {
        document.getElementById("strMod").innerHTML = "-";
    }

    if (strScore != 0) {
      document.getElementById("strTotal").innerHTML = parseInt(strScore) + parseInt(strRace);
    }
    
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

    if (dexScore != 0) {
      document.getElementById("dexTotal").innerHTML = parseInt(dexScore) + parseInt(dexRace);
    }
    
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

    if (conScore != 0) {
      document.getElementById("conTotal").innerHTML = parseInt(conScore) + parseInt(conRace);
    }
    
    document.getElementById("conRace").innerHTML = conRace;
}

function updateInt() {
    let intScore = document.getElementById("intScore").value;
    let intRace = 0;

    if (race.options[race.value-1].getAttribute("data-intRace").length != 0) {
        intRace = race.options[race.value-1].getAttribute("data-intRace");
    }

    if ( /['^\d+$']/.test(intScore))  {
        document.getElementById("intMod").innerHTML = getMod(parseInt(intScore) + parseInt(intRace));
    }
    else {
        document.getElementById("intMod").innerHTML = "-";
    }
  
    if (intScore != 0) {
      document.getElementById("intTotal").innerHTML = parseInt(intScore) + parseInt(intRace);
    }
    
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

    if (wisScore != 0) {
      document.getElementById("wisTotal").innerHTML = parseInt(wisScore) + parseInt(wisRace);
    }
    
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

    if (chaScore != 0) {
      document.getElementById("chaTotal").innerHTML = parseInt(chaScore) + parseInt(chaRace);
    }
    
    document.getElementById("chaRace").innerHTML = chaRace;
}

function getMod(ability) {
    return Math.floor((ability-10)/2)
}

function onPageLoad() {

  updateRace();
  updateClass();
  
  document.getElementById("strTotal").innerHTML = "-";
  document.getElementById("dexTotal").innerHTML = "-";
  document.getElementById("conTotal").innerHTML = "-";
  document.getElementById("intTotal").innerHTML = "-";
  document.getElementById("wisTotal").innerHTML = "-";
  document.getElementById("chaTotal").innerHTML = "-";
  
}

function validateForm(e) {
  document.querySelector("#newCharFeedback").innerHTML = "";
  let charName = document.getElementById("charName").value;
  let level = document.getElementById("level").value;
  let background = document.getElementById("background").value;
  let alignment = document.getElementById("alignment").value;
  let deity = document.getElementById("deity").value;
  let age = document.getElementById("age").value;
  let height = document.getElementById("height").value;
  let weight = document.getElementById("weight").value;
  let str = document.getElementById("strScore").value;
  let dex = document.getElementById("dexScore").value;
  let con = document.getElementById("conScore").value;
  let intelligence = document.getElementById("intScore").value;
  let wisdom = document.getElementById("wisScore").value;
  let charisma = document.getElementById("chaScore").value;

  console.log(charName);
  console.log(str);

  if ( charName == '' || level == '' || background == '' || alignment == '' || deity == '' || age == ''
     || height == '' || weight == '' || str == 0 || dex == 0 || con == 0 || intelligence == 0 || 
     wisdom == 0 || charisma == 0) {
    e.preventDefault();
    document.querySelector("#newCharFeedback").innerHTML = "Blank Field!"
    
  }

  if (!document.querySelector("#male").checked && !document.querySelector("#female").checked && 
     !document.querySelector("#other").checked) {
      e.preventDefault();
      document.querySelector("#newCharFeedback").innerHTML = "*Blank Field!*"
      
     }
  
}
//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            korv.push(toode);
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            //korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
    kokku();
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;

        }
    });
    kokku();
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkel.kogus--;
            if (korvArtikkel.kogus < 1) {
                eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp);
            } else {
                korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = korvArtikkel.kogus;
            }
        }
    });
    kokku();
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }
    kokku();
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => alustaOstukorviTaimer());
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaOstukorviNupp.innerText = 'Lisa ostukorvi';
        lisaOstukorviNupp.disabled = false;
    });
    kokku();
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.

function kokku(){
    let summaElement = document.querySelector('.korv_summa');

    if (korv.length < 1) {
        if (summaElement) {
            summaElement.remove();
        }
        return;
    }

    const summa = korv.reduce((kokku, toode) => {
        const hindNumber = parseFloat(toode.hind.replace(',', '.').replace(/[^0-9.]/g, ''));
        return kokku + hindNumber * toode.kogus;
    }, 0);
    const tarneHind = saaValitudTarneHind();
    const kogusumma = summa + tarneHind;

    if (!summaElement) {
        document.querySelector('.korv-jalus').insertAdjacentHTML('beforeend', `<p class="korv_summa">Kokku tasuda: ${kogusumma.toFixed(2)}€</p>`);
    } else {
        summaElement.innerText = `Kokku tasuda: ${kogusumma.toFixed(2)}€`;
    }
}


//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) {
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(vahe);
            document.getElementById("time").innerHTML = "alusta uuesti";
        };
    };
    taimer();
    return setInterval(taimer, 1000);
};

function alustaOstukorviTaimer() {
    let taimeriAeg = 60 * 2,
        kuva = document.getElementById("time"),
        taimeriPealkiri = document.getElementById("taimeri-pealkiri");
    taimeriPealkiri.style.display = "block";
    alustaTaimer(taimeriAeg, kuva);
}


//-------------------------3. osa Tarne vorm ------------------------
/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */


const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const kinnitus = document.getElementById("kinnitus");
// minu kood
const telefon = document.getElementById("telefon");
const aadress = document.getElementById("aadress");
const tarne1 = document.getElementById("tarne1");
const tarne2 = document.getElementById("tarne2");

const errorMessage = document.getElementById("errorMessage");

// minu kood
const tarneHinnad = {
    tarne1: 2,
    tarne2: 0
};

tarne1.addEventListener("change", kokku);
tarne2.addEventListener("change", kokku);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "" || /\d/.test(eesnimi.value)) {
        errors.push("Sisesta korrektne eesnimi");
    }

    if (perenimi.value.trim() === "" || /\d/.test(perenimi.value)) {
        errors.push("Sisesta korrektne perenimi");
    }

    if (!/^\d{6,}$/.test(telefon.value)) {
        errors.push("Telefon peab sisaldama vähemalt 6 numbrit");
    }

    // minu kood
    if (aadress.value.trim() === "") {
        errors.push("Sisesta aadress");
    }

    if (!tarne1.checked && !tarne2.checked) {
        errors.push("Vali tarneviis");
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";

    }

})

// minu kood
function saaValitudTarneHind() {
    if (tarne1.checked) {
        return tarneHinnad.tarne1;
    }

    if (tarne2.checked) {
        return tarneHinnad.tarne2;
    }

    return 0;
}

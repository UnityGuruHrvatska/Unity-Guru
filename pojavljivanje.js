// js za fejdanje i slajdanje
//dohvaćanje svih elemenata koji se trbaju pojaviti i/ili klizati na ekran
const faders = document.querySelectorAll(".fade-in");
const sliders = document.querySelectorAll("klizanje");
let isMob = false;
//opcije za pojavljivanje
const Opcije = {
    threshold: 0.3,
    rootMargin: "200% 50% -30% 50%"
};
const OpcijeMob = {
    threshold: 0.3,
    rootMargin: "200% 50% -30% 50%"
};

//služi za pojavljivanje elemenata kada uđu na ekran (doda im klasu pojava)
const pojavaTijekomSkrolanja = new IntersectionObserver(function(entries, pojavaTijekomSkrolanja) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            entry.target.classList.remove("pojava");
        } 
        
        else 
        {
            entry.target.classList.add("pojava");
        }
    });
}, isMob ? OpcijeMob : Opcije);

faders.forEach(fader => {
    pojavaTijekomSkrolanja.observe(fader);
});

sliders.forEach(slider => {
    pojavaTijekomSkrolanja.observe(slider);
});

// js za crno\bijelu temu, radi samo kada je stranica objavljena na serveru
const sve = document.getElementsByTagName("*");
const logo = document.getElementById("logo");

//var za scrollbar
var lNavigacija = document.querySelector('.lijeva-navigacija');
var scrollBarUnosnogKoda = document.querySelector('textarea');
var scrollBarIzlaznogKoda = document.getElementById('drzac-izlaznog-koda-podrucje');

/*Stavljamo sve vrste scrollbara u niz tako da ne 
moramo za svaki posebno pisati da mu se aktivira/deaktivira
svijetla tema u funkciji promjenaSvjetline*/
const elementiScrollbara = [lNavigacija, scrollBarUnosnogKoda, scrollBarIzlaznogKoda];

//gumbi za tablice(vidljivi samo u mobilnoj verziji stanice)
const gumbiMob = document.querySelectorAll('.gumb-tab-za-mob');


function promjenaSvjetline () {
    //govori da se promjenila tema i dohvaća kolačić koji prati temu
    let svjetlina = dohvatiKolačić("svjetlina");

    //stvara novi kolačić ako nema postojećeg
    if (svjetlina == ""){
        postaviKolačić("svjetlina", "true", 1000000000);
    }

    //dohvaća gumbe
    const lijevigumbiElementi = document.querySelectorAll(".lijevi-gumbi, .gornji-gumbi");

    //ako je svijetla tema
    if (svjetlina == "false") 
    {
        //mjeanja boju scrollbara
        document.body.classList.add('svijetla-tema');

        //prolazi kroz sve elemente koji imaju svoj poseban scroll bar i nadodaje im svijetlu temu
        elementiScrollbara.forEach(element => {
            if (element !== null) {
                element.classList.add('svijetla-tema');
            }
        });

        //prolazi kroz sve elemente koji imaju klasu gumb-tab-za-mob i stavlja im svijetlu temu
        gumbiMob.forEach(element => {
            if (element !== null) {
                element.classList.add('svijetla-tema');
            }
        });

        //mjenja boju za kada mis prekriva gumbove lekcije
        lijevigumbiElementi.forEach(element => {
            element.addEventListener("mouseover", function() {
                //ako ne prekriva id odabrano onda ce mu promjeniti boju pod uvjetom da je to kalasa .lijevi-gumbi
                if (this.id != "odabrano") {
                    this.style.backgroundColor = "rgb(146, 223, 224)";
                }
            });
            
            element.addEventListener("mouseout", function() {
                //ako ne prekriva id odabrano onda ce mu promjeniti boju pod uvjetom da je to kalasa .lijevi-gumbi
                if (this.id != "odabrano") {
                    this.style.backgroundColor = "transparent";
                }
            });
        });

        for (const nes of sve) 
        {
            nes.style.transition = '0.3s';
            
            //mjenja boju pozadine
            let boja = "rgb(255, 255, 255)";
            
            switch (window.getComputedStyle(nes).backgroundColor) {
                //pozadina1
                case "rgb(35, 37, 41)":
                    nes.style.backgroundColor = "rgb(255, 255, 255)";
                    boja = "rgb(228, 228, 255)";
                    break;
                    
                //pozadina2
                case "rgb(41, 44, 49)":
                    nes.style.backgroundColor = "rgb(245, 245, 255)";
                    boja = "rgb(255, 255, 255)";
                    break;
                    
                //gumb
                case "rgb(40, 42, 54)":
                    nes.style.backgroundColor = "rgb(227, 231, 250)";
                    break;

                //unutrasnjojst code containera
                case "rgb(23, 25, 32)":
                    nes.style.backgroundColor = "rgb(138, 141, 156)";
                    break;
                    
                //boja gumba za odabranu lekciju
                case "rgb(63, 67, 88)":
                    nes.style.backgroundColor = "rgb(155, 200, 201)";
                    break;
            }

            //slovaa varijabli u prism.css
            if(window.getComputedStyle(nes).color === "rgb(138, 113, 197)")
            {
                nes.style.transition = '0.3s';
                nes.style.color = "rgb(8, 193, 255)";
            }

            //lijevigumbi i gornjigumbi
            lijevigumbiElementi.forEach(lijevigumbi => {
                lijevigumbi.classList.add("svijetlo");
            });

            

            //mjenja boju pozadine kod svg 
            if(nes.tagName == "svg") {
                nes.style.transition = '0.3s';
                const pathElement = nes.querySelector("#wavepath");
                if (pathElement) {
                    pathElement.setAttribute("fill", boja);
                }
            }
            
            //mjenja boju slova
            if(window.getComputedStyle(nes).color === "rgb(239, 239, 239)"){
                nes.style.transition = '0.3s';
                if (nes.id == "treba") {
                    continue;
                }
                else{
                    nes.style.color = "rgb(0, 0, 0)";
                }
            }
        }
                    
        //mijenja logo ovisno o temi
        try {
            logo.src = "slike/logo3dark.png";
        }
        catch(err) {
            //console.log("Nema loga");
        }
    }
    //ako je tamna tema
    else if (svjetlina == "true")
    {
        //mjenja boju scrollbara bodya
        document.body.classList.remove('svijetla-tema');

        //prolazi kroz sve elemente koji imaju svoj poseban scroll bar i mice im svijetlu temu
        elementiScrollbara.forEach(element => {
            if (element !== null) {
                element.classList.remove('svijetla-tema');
            }
        });

        //prolazi kroz sve elemente koji imaju klasu gumb-tab-za-mob i mice im svijetlu temu
        gumbiMob.forEach(element => {
            if (element !== null) {
                element.classList.remove('svijetla-tema');
            }
        });

        //mjenja boju za kada mis prekriva gumbove lekcije
        lijevigumbiElementi.forEach(element => {
            element.addEventListener("mouseover", function() {
                //ako ne prekriva id odabrano onda ce mu promjeniti boju pod uvjetom da je to kalasa .lijevi-gumbi
                if (this.id != "odabrano") {
                    this.style.backgroundColor = "rgb(83, 91, 127)";
                }
            });
            
            element.addEventListener("mouseout", function() {
                //ako ne prekriva id odabrano onda ce mu promjeniti boju pod uvjetom da je to kalasa .lijevi-gumbi
                if (this.id != "odabrano") {
                    this.style.backgroundColor = "transparent";
                }
            });
        });

        for (const nes of sve) 
        {
            nes.style.transition = '0.3s';

            let boja = "rgb(35, 37, 41)";
            
            switch (window.getComputedStyle(nes).backgroundColor) {
                //pozadina1
                case "rgb(255, 255, 255)":
                    nes.style.backgroundColor = "rgb(35, 37, 41)";
                    boja = "rgb(41, 44, 49)";
                    break;
                    
                //pozadina2
                case "rgb(245, 245, 255)":
                    nes.style.backgroundColor = "rgb(41, 44, 49)";
                    boja = "rgb(35, 37, 41)";
                    break;
                    
                //gumb
                case "rgb(227, 231, 250)":
                    nes.style.backgroundColor = "rgb(40, 42, 54)";
                    break;
                        
                //unutrasnjojst code containera
                case "rgb(138, 141, 156)":
                    nes.style.backgroundColor = "rgb(23, 25, 32)";
                    break;

                //boja gumba za odabranu lekciju
                case "rgb(155, 200, 201)":
                    nes.style.backgroundColor = "rgb(63, 67, 88)";
                    break;
            }

            //slovaa varijabli u prism.css
            if(window.getComputedStyle(nes).color === "rgb(8, 193, 255)")
            {
                nes.style.transition = '0.3s';
                nes.style.color = "rgb(138, 113, 197)";
            }

            //lijevigumbi i gornjigumbi
            lijevigumbiElementi.forEach(lijevigumbi => {
                lijevigumbi.classList.remove("svijetlo");
            });

            //mjenja boju pozadine kod svg
            if(nes.tagName == "svg") {
                nes.style.transition = '0.3s';
                const pathElement = nes.querySelector("#wavepath");
                if (pathElement) {
                    pathElement.setAttribute("fill", boja);
                }
            }
            
            //mjenja boju slova
            if(window.getComputedStyle(nes).color === "rgb(0, 0, 0)"){
                nes.style.transition = '0.3s';
                nes.style.color = "rgb(239, 239, 239)";
            }
        }
        //mijenja logo
        try {
            logo.src = "slike/logo3.png";
        }
        catch(err) {
            //console.log("Nema loga");
        }
    }
};

let gumbSeMožeStisnuti = true;

function svjetlina(gumb) {
    //mijenja stanje kolačića
    if (gumbSeMožeStisnuti) {
        let svjetlo = dohvatiKolačić("svjetlina");
        if (svjetlo == "false") {
            svjetlo = "true";
        } else {
            svjetlo = "false";
        }
        postaviKolačić("svjetlina", svjetlo, 1000000000);
        promjenaSvjetline();

        setTimeout(function() {
            gumbSeMožeStisnuti = true;
        }, 350);

        // Onemoguci pritisak gumba tijekom cekanja
        gumbSeMožeStisnuti = false;

    }
};


const sveq = document.querySelectorAll("*");
function stilUOdnosuNaEkran() {
    var tijeloStranice = document.body;

    // Nabavlja širinu i visinu prozora
    var širinaProzora = window.innerWidth;
    var visinaProzora = window.innerHeight;
    var zumiranje = window.devicePixelRatio || 1;

    let AR = visinaProzora/širinaProzora;

    // Update styles based on the width
    if (širinaProzora <= 750) {
        isMob=true;
        sveq.forEach(element => {
            element.classList.add('mob');
            element.classList.remove('komp');
        });
        lNavigacija.classList.remove("mobVidljivo");
        lNavigacija.classList.add("mobMaknuto");
        vidljiv = false;
        console.log(širinaProzora)
        /*faders.forEach(element => {
            element.classList.remove('fade-in');
        });
        sliders.forEach(element => {
            element.classList.remove('klizanje');
        });*/
    } 
    else if (širinaProzora > 750) {
        isMob=false;
        //console.log(širinaProzora)
        sveq.forEach(element => {
            element.classList.add('komp');
            element.classList.remove('mob');
        });
        lNavigacija.classList.remove("mobVidljivo");
        lNavigacija.classList.remove("mobMaknuto");
        try{zatvoriPopupTab()}
        catch(error){}
        /*faders.forEach(element => {
            element.classList.add('fade-in');
        });
        sliders.forEach(element => {
            element.classList.remove('klizanje');
        });*/
    } 
}
window.addEventListener('resize', stilUOdnosuNaEkran);


//stvara ili mijenja kolačić s rokom trajanja
function postaviKolačić(kolačićIme, kolačićVrijednot, vrijemeTrajanja) {
    const d = new Date();
    d.setTime(d.getTime() + (vrijemeTrajanja * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = kolačićIme + "=" + kolačićVrijednot + ";" + expires + ";path=/";
};

//dohvaća kolačić s određenim imenom
function dohvatiKolačić(imeKolačića) {
    let ime = imeKolačića + "=";
    let ka = document.cookie.split(";");

    for(let i = 0; i < ka.length; i++) {
        let kol = ka[i];
        while (kol.charAt(0) == " ") {
            kol = kol.substring(1);
        }
        if (kol.indexOf(ime) == 0) {
            return kol.substring(ime.length, kol.length);
        }
    }
    return "";
};


// provjerava sadrzi li stranica drzac koda(njega ima samo dio stranice s C#)
if(document.getElementById("drzac-koda-textarea") != null)
{
    document.getElementById("drzac-koda-textarea").addEventListener("keydown", function(e) {
        if (e.key === "Tab") {
            e.preventDefault();
    
            // Informacije o odabiru
            var pocetak = this.selectionStart;
            var kraj = this.selectionEnd;
    
            // Umetni tab na trenutacnu poziciju pointera
            var tab = "\t";
            this.value = this.value.substring(0, pocetak) + tab + this.value.substring(kraj);
    
            // Pomakni poziciju pointera nakon umetnutog taba
            this.selectionStart = this.selectionEnd = pocetak + tab.length;
        }
    });
}


const tppps = document.querySelectorAll(".tppp");
function odaberiIdZaPopup(vrsta) {
    let vrs = document.querySelectorAll("."+vrsta);
    tppps.forEach(tppp => {
        tppp.style.display = 'none';
    });
    vrs.forEach(vr => {
        vr.style.display = 'block';
    });
}

//pronalazi stvar s id popup to su gumbi koji otvaraju meni s sadrzajem tablica u mobilnoj verziji
const popUp = document.getElementById('popup');

//omogucuje glatko stvaranje popupa za tablice kada su u moblinom prikazu
function otvoriPopupTab(vrsta) {
    odaberiIdZaPopup(vrsta);
    popUp.style.display = 'block';
    setTimeout(() => {
        popUp.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 5);
}

//omogucuje glatko smanjenje popupa za tablice kada su u moblinom prikazu
function zatvoriPopupTab() {
    popUp.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
        popUp.style.display = 'none';
    }, 300);
}

//provjerava je li mis kliknut ako je onda ce se popup smanjiti
document.body.addEventListener('mousedown', function(event) {
    if (!event.target.classList.contains('gumb-tab-za-mob') && popUp != null) {
        zatvoriPopupTab();
    }
});

//za pojavljivanje lekcije s gumbima
//nadodaje se i mice klasa kada je u mob verziji 
function pojavaLekcije(){
    if(vidljiv){
        lNavigacija.classList.remove("mobVidljivo");
        lNavigacija.classList.add("mobMaknuto");
        vidljiv = false;
    }

    else{
        lNavigacija.classList.add("mobVidljivo");
        lNavigacija.classList.remove("mobMaknuto");
        vidljiv = true;
    }
}
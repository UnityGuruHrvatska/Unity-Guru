// js za fejdanje i slajdanje
//dohvaćanje svih elemenata koji se trbaju pojaviti i/ili klizati na ekran
const faders = document.querySelectorAll(".fade-in");
const sliders = document.querySelectorAll("klizanje");

//opcije za pojavljivanje
const Opcije = {
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
}, Opcije);

faders.forEach(fader => {
    pojavaTijekomSkrolanja.observe(fader);
});

sliders.forEach(slider => {
    pojavaTijekomSkrolanja.observe(slider);
});

// js za crno\bijelu temu
const sve = document.getElementsByTagName("*");
const logo = document.getElementById("logo");

function promjenaSvjetline () {
    //govori da se promjenila tema i dohvaća kolačić koji prati temu
    let svjetlina = dohvatiKolačić("svjetlina");

    //stvara novi kolačić ako nema postojećeg
    if (svjetlina == "")
    {
        postaviKolačić("svjetlina", "true", 1000000000);
    }

    //dohvaća gumbe
    const lijevigumbiElements = document.querySelectorAll(".lijevigumbi");
    const gornjigumbiElements = document.querySelectorAll(".gornjigumbi");

    //ako je svijetla tema
    if (svjetlina == "false") 
    {
        for (const nes of sve) 
        {
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
                nes.style.color = "rgb(8, 193, 255)";
            }

            //lijevigumbi i gornjigumbi
            lijevigumbiElements.forEach(lijevigumbi => {
                lijevigumbi.classList.add("svijetlo");
            });

            gornjigumbiElements.forEach( gornjigumbi => {
                gornjigumbi.classList.add("svijetlo");
            });

            //mjenja boju pozadine kod svg 
            if(nes.tagName == "svg") {
                const pathElement = nes.querySelector("#wavepath");
                if (pathElement) {
                    pathElement.setAttribute("fill", boja);
                }
            }
            
            //mjenja boju slova
            if(window.getComputedStyle(nes).color === "rgb(239, 239, 239)"){
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
        for (const nes of sve) 
        {
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
                nes.style.color = "rgb(138, 113, 197)";
            }

            //lijevigumbi i gornjigumbi
            lijevigumbiElements.forEach(lijevigumbi => {
                lijevigumbi.classList.remove("svijetlo");
            });
            
            gornjigumbiElements.forEach( gornjigumbi => {
                gornjigumbi.classList.remove("svijetlo");
            });

            //mjenja boju pozadine kod svg
            if(nes.tagName == "svg") {
                const pathElement = nes.querySelector("#wavepath");

                if (pathElement) {
                    pathElement.setAttribute("fill", boja);
                }
            }
            
            //mjenja boju slova
            if(window.getComputedStyle(nes).color === "rgb(0, 0, 0)"){
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

//mijenja kolačić prilikom promjene teme
function svjetlina () {
    //mijenja stanje kolačića
    let svjetlo = dohvatiKolačić("svjetlina");
    if (svjetlo == "false"){
        svjetlo = "true";
    }
    else {
        svjetlo = "false"
    }
    postaviKolačić("svjetlina", svjetlo, 1000000000);
    promjenaSvjetline();
    
};

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


document.getElementById("drzac-koda-textarea").addEventListener("keydown", function(e) {
    if (e.key === "Tab") {
        e.preventDefault();

        // Get the current selection information
        var pocetak = this.selectionStart;
        var kraj = this.selectionEnd;

        // Insert a tab at the caret position
        var tab = "\t";
        this.value = this.value.substring(0, pocetak) + tab + this.value.substring(kraj);

        // Move the caret position after the inserted tab
        this.selectionStart = this.selectionEnd = pocetak + tab.length;
    }
});


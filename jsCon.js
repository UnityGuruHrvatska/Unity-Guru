function pretvoriKonzolneFunkcije(csharpKod) {
  // pretvara konzolne funkcije c#-a u js
  let rezultat = csharpKod.replace(/("[^"]*")|\bConsole\.(Write(Line)?|ReadLine|Clear)\b/g, (podudaranje, uNavodnicima) => {
    if (uNavodnicima) {
      return uNavodnicima;
    }
    else if (podudaranje.includes("Write")) {
      return 'console.log';
    }
    else if (podudaranje.includes("ReadLine")) {
      return 'prompt';
    }
    else if (podudaranje.includes("Clear")) {
      return 'console.clear';
    }
    else {
      return podudaranje;
    }
  });

  return rezultat;
}


function pretvoriMatFunkcije(csharpKod) {
  // pretvara matematičke funkcije c#-a u js
  const regex = /("[^"]*")|\bMath\.([A-Z][a-zA-Z]*)\b(?=\s*\()/g;

  return csharpKod.replace(regex, (podudaranje, uNavodnicima, mathFunkcija) => {
    if (uNavodnicima) {
      return uNavodnicima;
    }
    else {
      return `Math.${mathFunkcija.charAt(0).toLowerCase()}${mathFunkcija.slice(1)}`;
    }
  });
}

function pretvoriFloat(unos) {
  const regex = /("[^"]*")|\b(\d+(\.\d*)?)f\b/g;

  return unos.replace(regex, (podudaranje, uNavodnicima, floatVrijednost) => {
    if (uNavodnicima) {
      return uNavodnicima;
    }
    else {
      return floatVrijednost;
    }
  });
}


function enumiUSwitchu(jsKod, enumNazivi) {
  // traži uzorak "case nešto.nešto:"
  const uzorak = /case\s+(\w+)\.(\w+)\s*:/g;

  // ako je enum vraća tako da radi
  const izlaz = jsKod.replace(uzorak, (nađeno, eNaziv, nazivUEnumu) => {
    if (enumNazivi.includes(eNaziv)) {
      return `case ${eNaziv}.${nazivUEnumu}[0]:`;
    } else {
      return nađeno; // ako nije enum vraća nepromijenjeno
    }
  });

  return izlaz;
}

function provjeriIPopraviWriteLine(csharpKod, enumNazivi) {
  // popravlja write line da radi s enumima i neke druge stvari
  const consoleWriteLineRegex = /console\.log\s*\(\s*(.*?)\s*\)/g;

  let promijenjeniKod = csharpKod;
  let nađeno;

  promijenjeniKod = promijenjeniKod.replace(consoleWriteLineRegex, (nađeno, arg) => {

    //popravlja enume
    function enumiKojiRade(arg) {
      //console.log(arg);
      const enumProvjeraRegex = /\b(\w+\.\w+)\b/g;
      const enumNađeno = arg.match(enumProvjeraRegex);
      if (enumNađeno && arg[0] != '"' && arg[0] != "'") {
        const prvidio = arg.split(".")[0];
        prvidio.replace(" ", "");
        //console.log(prvidio);
        if (enumNazivi.includes(prvidio)) {
          brEn += 1
          if (brEn > 1) {
            console.log("error")
            return "+ +";
          }
          return `${arg.replace(" ", "")}[0]`;
        }
        else {
          return arg;
        }
      }
      else {
        return arg;
      }
    }


    //traži pluseve
    let rezultat = "";
    let navodnici = [];
    let tArg = "";
    let brEn = 0;
    let brArg = 0;
    for (let i = 0; i < arg.length; i++) {
      if (arg[i] === "+" && navodnici.length == 0) {
        rezultat += enumiKojiRade(tArg, brEn) + arg[i];
        tArg = "";
      }
      else if (arg[i] === "," && navodnici.length == 0) {
        break;
      }
      else if (arg[i] === "'" || arg[i] === '"') {
        if (navodnici.length == 0) {
          navodnici.push(arg[i]);
        }
        else if (navodnici[0] == arg[i]) {
          navodnici = [];
        }
        tArg += arg[i];
      }
      else {
        tArg += arg[i];
      }
    }
    rezultat += enumiKojiRade(tArg);

    //console.log(rezultat);

    return `console.log(${rezultat})`;
  });
  return promijenjeniKod;
}

function razdvojiKlase(unos) {
  const sadrzajiKlase = [];
  const imenaKlase = [];

  const linije = unos.split('\n');
  let trenutniSadrzajKlase = '';
  let unutarKlase = false;

  for (const linija of linije) {
    const skracenaLinija = linija.trim();

    if (skracenaLinija.startsWith('class ') || skracenaLinija.startsWith('enum ') || skracenaLinija.startsWith('public static class ')) {
      if (unutarKlase) {
        sadrzajiKlase.push(trenutniSadrzajKlase.trim());
        trenutniSadrzajKlase = '';
      }
      unutarKlase = true;
      const podudaranjeImenaKlase = skracenaLinija.match(/class (\w+)|enum (\w+)|public static class (\w+)/);
      imenaKlase.push(podudaranjeImenaKlase ? podudaranjeImenaKlase[1] || podudaranjeImenaKlase[2] || podudaranjeImenaKlase[3] : '');
    }

    if (unutarKlase) {
      trenutniSadrzajKlase += linija + '\n';
    }
  }

  // Gurni zadnji sadržaj klasa
  if (unutarKlase) {
    sadrzajiKlase.push(trenutniSadrzajKlase.trim());
  }

  return { sadrzajiKlase: sadrzajiKlase, imenaKlase: imenaKlase.filter(Boolean) };
}

function provjeriDodavanjeVrijednosti(csharpKod, charVarijable) {
  const regexUzorak = /(\w+)\s*=\s*([^;]+);/g;

  let nađeno;
  while ((nađeno = regexUzorak.exec(csharpKod)) !== null) {
    const imeVarijable = nađeno[1];
    const vrijednostVarijable = nađeno[2];
    if (charVarijable.includes(imeVarijable)) {
      if (vrijednostVarijable[0] == '"' || (vrijednostVarijable.length !== 2 && vrijednostVarijable.length !== 3 && !charVarijable.includes(vrijednostVarijable))) {
        //za direktno zapisivanje
        csharpKod = "";
        console.log("error");
      }
      else if (vrijednostVarijable[0] !== "'" && !charVarijable.includes(vrijednostVarijable)) {
        //za posredno zapisivanje
        csharpKod = "";
        console.log("error");
      }
    }
  }
  return csharpKod;
}

function nadodajLetDeklariranojVarijabli(csharpKod, enumNazivi, charVarijable) {

  const validneVrste = ['int', 'float', 'double', 'string', 'bool', 'char'];

  // Definiraj regex izraz za globalno pronalaženje deklaracija varijabli
  const regexUzorak = /\b(\w+)\s+(\w+)\s*(?:=\s*([^;]+))?;/g;

  // Zamijeni sve pojave uzorka s izmijenjenom deklaracijom.
  const rezultatStringa = csharpKod.replace(regexUzorak, (podudaranje, vrsta, naziv, vrijednost, indeks) => {
    //provjerava je li vrsta validna c# vrsta
    if (validneVrste.includes(vrsta) || (vrijednost && (/\b\w+\.\w+\b/.test(vrijednost) || /^\s*new\s+\w+\s*\([^]*\)\s*$/i.test(vrijednost)))) {
      let scopeValue = 0;

      //provjerava jeli varijabla char
      if (vrsta === 'char') {
        if (vrijednost[0] === "'" && (vrijednost.length !== 3 || vrijednost.length !== 2)) {
          charVarijable.push(naziv);
        }
        else {
          console.log("error");
          csharpKod = "";
        }
      }

      const substringBeforeMatch = csharpKod.substring(0, indeks);
      for (let i = 0; i < substringBeforeMatch.length; i++) {
        if (substringBeforeMatch[i] === '{') scopeValue++;
        else if (substringBeforeMatch[i] === '}') scopeValue--;
      }

      if (scopeValue > 1) {
        if (vrijednost) {
          // Provjeri ako je vrijednost u formatu "(int) nešto.nešto" , "Convert.ToInt(nešto.nešto)" ili "nešto.nešto" tu je zbog enuma
          const intCastingRegex = /\(\s*int\s*\)\s*(\w+\.\w+)/;
          const convertToIntRegex = /Convert\.ToInt\s*\(\s*(\w+\.\w+)\s*\)/;
          const neštoTočkaNeštoRgx = /\b\w+\.\w+\b(?<!\))\s*$/;

          if (intCastingRegex.test(vrijednost)) {
            const podudaranje = intCastingRegex.exec(vrijednost);
            const [prviDio] = podudaranje[1].split('.');
            //console.log(prviDio);

            if (enumNazivi.includes(prviDio)) {
              return `let ${vrsta} ${naziv} = ${podudaranje[1]}[1];`;
            }

            return `let ${vrsta} ${naziv} = ${podudaranje[1]};`;
          }
          else if (convertToIntRegex.test(vrijednost)) {
            const podudaranje = convertToIntRegex.exec(vrijednost);
            const [prviDio] = podudaranje[1].split('.');

            if (enumNazivi.includes(prviDio)) {
              return `let ${vrsta} ${naziv} = ${podudaranje[1]}[1];`;
            }
            return `let ${vrsta} ${naziv} = ${podudaranje[1]};`;

          }
          else if (neštoTočkaNeštoRgx.test(vrijednost)) {
            const podudaranje = neštoTočkaNeštoRgx.exec(vrijednost);
            const [prviDio] = podudaranje[0].split('.');

            if (enumNazivi.includes(prviDio)) {
              return `let ${vrsta} ${naziv} = ${vrijednost}[0];`;
            }

            return `let ${vrsta} ${naziv} = ${vrijednost};`;
          }
          else {
            return `let ${vrsta} ${naziv} = ${vrijednost};`;
          }
        }
        else {
          return `let ${vrsta} ${naziv};`;
        }
      }
      else {
        return podudaranje;
      }
    }
    else {
      return podudaranje;
    }
  });

  return rezultatStringa;
}


function pretvrotiCsharp2DNizUJs(unos) {
  // Korištenje replace s funkcijom povratnog poziva za izvođenje zamjena
  let rezultat = unos.replace(/(\w+)\s*=\s*\{\s*((?:\{.*?\}\s*,?\s*)+)\s*\};/g, (podudaranje, varijabla, nizovi) => {
    // Zamjenjuje { s [ i } s ] unutar svakog niza
    const zamjenjeniNizovi = nizovi.replace(/\{/g, '[').replace(/\}/g, ']');

    // Zamjenjuje nešto1[,] sa nešto1[]
    const zamjenjeneVarijable = varijabla.replace(/\[\]/g, '[]');

    // Spoji varijablu i zamijenjeni niz kako bi formiralo konačnu zamjenu
    return `${zamjenjeneVarijable} = [${zamjenjeniNizovi}];`;
  });

  // Koristi replace s funkcijom povratnog poziva za izvođenje zamjena
  rezultat = unos.replace(/(\w+)\s*=\s*\{\s*((?:\{.*?\}\s*,?\s*)+)\s*\};/g, (podudaranje, varijabla, nizovi) => {
    // Zamjenjuje { s [ i } s ] unutar svakog niza
    const zamjenjeniNizovi = nizovi.replace(/\{/g, '[').replace(/\}/g, ']');

    // Spoji varijablu i zamijenjeni niz kako bi formiralo konačnu zamjenu
    return `${varijabla} = [${zamjenjeniNizovi}];`;
  });

  rezultat = rezultat.replace(/(\w+)\[\s*,\s*\]/g, '$1');

  return rezultat;
}

function pretvoriCsharpNizUJs(unos) {
  let pretvoreniKod = unos.replace(/(\w+)\s*\[\]\s*(\w+)\s*;/g, (podudaranje, vrstaNaziva, imeVarijable) => {
    return `${vrstaNaziva} ${imeVarijable} = [];`;
  });

  pretvoreniKod = pretvoreniKod.replace(/(\w+)\s*\[\]\s*(\w+)\s*=\s*new\s*(\w+)\s*\[\s*(.*?)\s*\]\s*;/g, (podudaranje, vrstaNaziva, imeVarijable, vrstaNiza, vrijednostNiza) => {
    return `${vrstaNaziva} ${imeVarijable} = [];`;
  });

  pretvoreniKod = pretvoreniKod.replace(/(\w+)\[\]\s+(\w+)\s*=\s*{\s*([^}]*)\s*}\s*;/g, (podudaranje, vrstaNaziva, imeVarijable, elementi) => {

    return `${vrstaNaziva} ${imeVarijable} = [${elementi.trim()}];`;
  });

  pretvoreniKod = pretvoreniKod.replace(/(\w+)\[\]\s+(\w+)\s*=\s*new\s+(\w+)\[\]\s*{\s*([^}]*)\s*}\s*;/g, (podudaranje, vrstaNaziva, imeVarijable, vrstaNiza, elementi) => {
    return `${vrstaNaziva} ${imeVarijable} = [${elementi.trim()}];`;
  });

  pretvoreniKod = pretvoreniKod.replace(/(\w+)\s*=\s*{\s*([^}]*)\s*};/g, (podudaranje, imeVarijable, elementi) => {
    return `${imeVarijable} = [${elementi.trim()}];`;
  });

  return pretvoreniKod;
}

function pretvoriFunkcijeNiza(unos) {
  let deklariraneVarijable = [];

  // Provjeri sadrži li unos uzorak "somename = new"
  if (/(\b\w+(?:\.\w+)*\s*=\s*new\b)/.test(unos)) {
    // Ako je uzorak pronađen, izdvojite i pohranite naziv varijable
    const podudaranje = unos.match(/(\b\w+(?:\.\w+)*)\s*=\s*new\b/);
    if (podudaranje) {
      deklariraneVarijable.push(podudaranje[1]);
    }
    return unos;
  }

  /*String(deklariraneVarijable).toUpperCase()
  String(deklariraneVarijable).toLowerCase()
  String(deklariraneVarijable).indexOf()
  String(deklariraneVarijable).substring()*/


  let rezultat = unos.replace(/(\b\w+(?:\.\w+)*\.)ToUpper\(\)/g, function (podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return 'String(' + nekoIme.slice(0, -1) + ').toUpperCase()';
    }
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)ToLower\(\)/g, function (podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return 'String(' + nekoIme.slice(0, -1) + ').toLowerCase()';
    }
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)IndexOf\((.*?)\)/g, function (podudaranje, nekoIme, args) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return 'String(' + nekoIme.slice(0, -1) + ').indexOf(' + args + ')';
    }
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)Substring\((.*?)\)/g, function (podudaranje, nekoIme, args) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return 'String(' + nekoIme.slice(0, -1) + ').substring(' + args + ')';
    }
    else {
      return podudaranje;
    }
  });

  // Zamijeni uzorak "nekoime.GetLength(n)" s "nekoime[n].length"
  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)GetLength\((\d+)\)/g, function (podudaranje, nekoIme, n) {
    // Check if nekoIme is in the deklariraneVarijable array
    if (!deklariraneVarijable.includes(nekoIme)) {
      return nekoIme.slice(0, -1) + '[' + n + '].length';
    }
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)Max\(\)/g, function (podudaranje, nekoIme, n) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return `Math.max(...${nekoIme.slice(0, -1)})`;
    }
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)Min\(\)/g, function (podudaranje, nekoIme, n) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return `Math.min(...${nekoIme.slice(0, -1)})`;
    }
    else {
      return podudaranje;
    }
  });

  // Zamijeni uzorak "nekoime.Length" s "nekoime.length"
  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*)\.Length\b/g, function (podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (deklariraneVarijable.includes(nekoIme)) {
      return podudaranje;
    }
    else {
      return nekoIme + '.length';
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\[[^\]]*\]\.)GetLength\((\d+)\)/g, function (podudaranje, nekoIme, n) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return nekoIme.slice(0, -1) + '[' + n + '].length';
    }
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\[[^\]]*\]\.)Max\(\)/g, function (podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return `Math.max(...${nekoIme.slice(0, -1)})`;
    }
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\[[^\]]*\]\.)Min\(\)/g, function (podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return `Math.min(...${nekoIme.slice(0, -1)})`;
    }
    else {
      return podudaranje;
    }
  });

  // Zamijeni uzorak "nekoime.Length" s "nekoime.length"
  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\[[^\]]*\]\.)Length\b/g, function (podudaranje, nekoIme) {
    // Provjeri nalazi li se varijabla u deklariraneVarijable
    if (deklariraneVarijable.includes(nekoIme)) {
      return podudaranje;
    }
    else {
      return nekoIme + '.length';
    }
  });

  return rezultat.replace(/(\b\w+(?:\.\w+)*)\[((?:[\w.]+\s*,\s*)*[\w.]+)\]/g, function (podudaranje, varijabla, indeksi) {
    // Provjeri nalazi li se varijabla u deklariraneVarijable
    if (deklariraneVarijable.includes(varijabla)) {
      return podudaranje;
    }
    else {
      // Zamijeni uzorak someword[x, y] s someword[x][y]
      const indeksNiza = indeksi.split(/\s*,\s*/).join('][');
      return `${varijabla}[${indeksNiza}]`;
    }
  });
}

function pretvoriForeach(unos) {
  const regex = /foreach\s*\((\w+)\s+(\w+)\s+in\s+(\w+)\)\s*{/g;
  const zamjena = 'for(let $2 in $3) { $2 = $3[$2];';

  return unos.replace(regex, zamjena);
}

//pretvara dvostruku u trostruku jednakost, provjerava smije li se jednakost provesti u C#-u

function pretvaranjeJednakosti(jsKod, charVarijable) {
  let jsKodDulj = jsKod.length;
  let rezultat1 = "";
  let otvoreniNavodnici = [];
  let pon = 0; //pozicija početnih navodnika
  let pok = 0; //pozicija krajnjih navodnika
  let jednakosti = [];
  let breakpointovi = "=()!|&,;:"; //što prekida traženje argumenata
  let rezultat2 = "";

  //Prolazi kroz kod
  for (let i = 0; i < jsKodDulj; i++) {
    rezultat1 += jsKod[i];


    if (jsKod[i] === "=" && jsKod[i + 1] === "=" && otvoreniNavodnici.length === 0) {
      //sprema mjesta gdje se testira jednakost
      jednakosti.push(i);
    }
  }

  if (jednakosti.length < 1) {
    return rezultat1;
  }

  let dPozProš = 0;
  for (let i = 0; i < jednakosti.length; i++) {
    //console.log(i)
    let poz = jednakosti[i];
    let lijevoDobro = true;
    let desnoDobro = true;
    let lPoz;
    let dPoz;
    let lArg;
    let dArg;

    let j = 0;
    while (lijevoDobro) {
      j += 1
      if (breakpointovi.includes(String(rezultat1[poz - j]))) {
        lPoz = poz - j + 1;
        lArg = rezultat1.slice(lPoz, poz);
        lijevoDobro = false;
      }
      //console.log(jsKod[poz-j]);
    }
    //console.log(lArg);
    let k = 1;
    while (desnoDobro) {
      k += 1
      if (breakpointovi.includes(String(rezultat1[poz + k]))) {
        dPoz = poz + k;
        dArg = rezultat1.slice(poz + 2, dPoz);
        desnoDobro = false;
      }
    }
    //console.log(dArg);

    rezultat2 += `${rezultat1.slice(dPozProš, lPoz)}__JeDnAAkOssssTffff__(${lArg} , ${dArg}, ${charVarijable.includes(lArg.replace(" ", ""))}, ${charVarijable.includes(dArg.replace(" ", ""))} )`;
    dPozProš = dPoz
  }
  rezultat2 += rezultat1.slice(dPozProš, rezultat1.length);
  return rezultat2;
}

//simulira c# jednakost
function __JeDnAAkOssssTffff__(a, b, tl, tr) {
  typeA = typeof (a);
  typeB = typeof (b);
  if (typeA == typeB && tl == tr) {
    return (a === b);
  }
  return "error";
}

function ProvjeriRadeLiNavodniciKakoSpada(jsKod) {
  let jsKodDulj = jsKod.length;
  let rezultat = "";
  let otvoreniNavodnici = [];
  let pon = 0; //pozicija početnih navodnika
  let pok = 0; //pozicija krajnjih navodnika

  //Prolazi kroz kod
  for (let i = 0; i < jsKodDulj; i++) {
    rezultat += jsKod[i];
    if (jsKod[i] === "=" && jsKod[i + 1] === "=" && otvoreniNavodnici.length === 0) {
      let NemaNavodnika1 = true; //varijabla koja prati ima li navodnika s lijeve strane
      let NemaNavodnika2 = true; //varijabla koja prati ima li navodnika s desne strane
      let KojiNavodnik1 = "";
      let KojiNavodnik2 = "";

      //kod koji provjerava ima li navodnika s lijeve strane
      let j = 0;
      while (NemaNavodnika1) {
        if (jsKod[i - j] != " " && jsKod[i - j] != "=") {
          if (jsKod[i - j] === "'" || jsKod[i - j] === '"') {
            NemaNavodnika1 = false;
            KojiNavodnik1 = jsKod[i - j];
            break;
          }
          else {
            break;
          }
        }
        j += 1
      }

      //kod koji provjerava ima li navodnika s desne strane
      let k = 0;
      while (NemaNavodnika2) {
        if (jsKod[i + k] != " " && jsKod[i + k] != "=") {
          if (jsKod[i + k] === "'" || jsKod[i + k] === '"') {
            NemaNavodnika2 = false;
            KojiNavodnik2 = jsKod[i + k];
            break;
          }
          else {
            break;
          }
        }
        k += 1
      }
      //izbacuje pogrešku ako je su s jedne strane navodnici a s druge nisu ili ako je jedna strana char a druga string
      if (NemaNavodnika1 != NemaNavodnika2 || KojiNavodnik1 != KojiNavodnik2) {
        console.log("error")
        break
      }
    }


    //Provjrava rade li navodnici kao u C#-u
    else if (jsKod[i] === '"' && jsKod[i - 1] != "\\") {
      if (otvoreniNavodnici[0] === '"') {
        otvoreniNavodnici = [];
        pok = i;
      }
      else {
        otvoreniNavodnici.push('"');
        if (otvoreniNavodnici.length <= 1) {
          pon = i;
        }
      }
    }
    else if (jsKod[i] === "'" && jsKod[i - 1] != "\\") {
      if (otvoreniNavodnici[0] === "'") {
        otvoreniNavodnici = [];
        pok = i;
        //Gleda ima li više od 1 znaka u charu
        if (pok - pon > 2) {
          break;
        }
      }
      else {
        otvoreniNavodnici.push("'");
        if (otvoreniNavodnici.length <= 1) {
          pon = i;
        }
      }
    }

    //izbacuje pogrešku ako ne radi kako spada
    if ((jsKod[i] === "'" && jsKod[i - 1] === "'" && (jsKod[i - 2] !== '\\' && i - 1 !== pon)) || (jsKod[i] === '"' && jsKod[i - 1] === '"' && (jsKod[i - 2] !== '\\' && i - 1 !== pon))) {
      console.log("error");
      break;
    }

  }

  return rezultat;
}

function pretvoriSpecijalce(unos) {
  const specijalci = {
    'č': 'c',
    'ć': 'c',
    'ž': 'z',
    'š': 's',
    'đ': 'd',
    'Č': 'C',
    'Ć': 'C',
    'Ž': 'Z',
    'Š': 'S',
    'Đ': 'D',
  };

  const uzorak = new RegExp(`[${Object.keys(specijalci).join('')}]`, 'g');

  const rezultat = unos.replace(uzorak, podudaranje => specijalci[podudaranje]);

  return rezultat;
}


function pretvoriCsharpUJs(csharpKod) {
  //dio koda koji emulira c# enume jer js
  const enums = [];
  const enumNazivi = [];

  csharpKod = csharpKod.replace(/enum\s+(\w+)\s*{([^}]+)}/g, (enumPodudaranje, enumNaziv, enumVrijednosti) => {
    let indexPr = 0;
    let prošPod = 0;
    const jsEnumVrijednosti = enumVrijednosti
      .split(',')
      .map((vrijednost, index) => {
        const podudaranje = /\s*([^\s=]+)(?:\s*=\s*([^\s,]+))?/.exec(vrijednost.trim());
        if (podudaranje) {
          const nazivClan = podudaranje[1];
          let vrijednostInd;
          if (podudaranje[2]) {
            vrijednostInd = podudaranje[2];
            indexPr = index;
            prošPod = podudaranje[2];
          }
          else {
            vrijednostInd = Number(index) - Number(indexPr) + Number(prošPod);
          }

          const vrijednostClan = `["${nazivClan}", ${vrijednostInd}]`;
          return `${nazivClan}: ${vrijednostClan}`;
        }
        else {
          return null;
        }
      })
      .filter(Boolean)
      .join(',\n');

    enumNazivi.push(enumNaziv)
    enums.push(`const ${enumNaziv} = {\n${jsEnumVrijednosti}\n};`);
    return '';
  });

  csharpKod = csharpKod.replace(/(?:public|private|protected|\s+static)+\s+class/g, 'class');

  const klase = razdvojiKlase(csharpKod);
  const imenaKlase = klase.imenaKlase;
  const sadrzajiKlase = klase.sadrzajiKlase;

  let rezultat = '';

  // Prolazi kroz klase
  for (let i = 0; i < imenaKlase.length; i++) {
    let imeKlase = imenaKlase[i];
    let sadrzajKlase = sadrzajiKlase[i];

    // Koristi metodu replace() za zamjenu ":" s "extends"

    // Ukloni modifikatore pristupa (public, private, protected)
    let jsKod = sadrzajKlase.replace(/\b(public|private|protected)\s+/g, '');

    jsKod = jsKod.replace(/class\s+(\w+)\s+:\s+(\w+)\s+\{/, "class $1 extends $2\n{");

    jsKod = jsKod.replace(new RegExp(`${imeKlase}\\((.*?)\\)\\s*:\\s*base\\((.*?)\\)\\s*\\{`, 'gs'), 'constructor($1) { super($2);');
    jsKod = jsKod.replace(new RegExp(`${imeKlase}\\s*\\((.*?)\\)\\s*\\{`, 'gs'), 'constructor($1) {');

    // Zamijeni statičnu ključnu riječ za varijable i zapamtite statičke varijable
    const staticVarijable = {};

    jsKod = jsKod.replace(/\bstatic\s+(\w+)\s+(\w+)\s*\(/g, (podudaranje, vrsta, functionName) => {
      staticVarijable[functionName] = vrsta;
      return `static ${vrsta} ${functionName}(`;
    });

    jsKod = jsKod.replace(/\bstatic\s+(\w+)\s+(\w+)(?:\s*=\s*\w+(?:\s*;|\s*[,]))?;/, (podudaranje, vrsta, varijabla) => {
      staticVarijable[varijabla] = vrsta;
      return `static ${vrsta} ${varijabla};`;
    });

    jsKod = jsKod.replace(/\bstatic\s+(\w+)\s+(\w+)(?:\s*=\s*([^;]+))?\s*;/, (podudaranje, vrsta, varijabla, vrijednost) => {
      staticVarijable[varijabla] = { vrsta, vrijednost };
      return `static ${vrsta} ${varijabla}${vrijednost ? ` = ${vrijednost}` : ''};`;
    });

    const charVarijable = [];

    jsKod = pretvoriCsharpNizUJs(jsKod);
    jsKod = pretvrotiCsharp2DNizUJs(jsKod);
    jsKod = nadodajLetDeklariranojVarijabli(jsKod, enumNazivi, charVarijable);
    jsKod = provjeriDodavanjeVrijednosti(jsKod, charVarijable);
    jsKod = pretvoriForeach(jsKod);
    jsKod = ProvjeriRadeLiNavodniciKakoSpada(jsKod, charVarijable);
    jsKod = pretvaranjeJednakosti(jsKod, charVarijable);
    jsKod = enumiUSwitchu(jsKod, enumNazivi)
    //console.log(charVarijable);


    // Ukloni tipove iz varijabli i funkcija
    jsKod = jsKod.replace(/\b(\w+)\s+(\w+)\s*=\s*(.+?);/g, '$2 = $3;');
    jsKod = jsKod.replace(/\b(\w+)\s+(\w+)\s*\[\]\s*;/g, '$2 = [];');
    // jsKod = jsKod.replace(/\b(\w+)\s+(\w+)\s*;/g, '$2 = null;'); staro

    jsKod = jsKod.replace(/\b(\w+)\s+(\w+)\s*;/g, function (podudaranje, vrsta, varijabla) {
      // Provjeri je li tip varijable osnovni C# tip
      if (['bool', 'byte', 'sbyte', 'char', 'decimal', 'double', 'float', 'int', 'uint', 'nint', 'nuint', 'long', 'nlong', 'ulong', 'short', 'ushort', 'string'].includes(vrsta)) {
        return varijabla + ' = null;';
      }
      else {
        // Ako je to prilagođena klasa, zamijenite instancijom klase
        return varijabla + ' = new ' + vrsta + '();';
      }
    });


    jsKod = jsKod.replace(/\b(\w+)\s+(\w+|\bif\b)\s*\((.*?)\)\s*{/g, function (match, p1, p2, p3) {
      if (p1.toLowerCase() === 'else' && p2.toLowerCase() === 'if') {
        return match; // zadržava else if zajedno
      } else {
        return ' ' + p2 + '(' + p3 + ') {';
      }
    });


    // Makni typse iz argumenata funkcije
    jsKod = jsKod.replace(/(\b(?!for|while)\w+)\s*\(([^)]*)\)\s*\{/g, function (podudaranje, imeFunkcije, args) {
      let ocisceniArgumenti = args.replace(/(\b\w+\b(?:\s*\[\s*\])?)\s+(\w+)/g, '$2');
      return `${imeFunkcije}(${ocisceniArgumenti}) {`;
    });

    jsKod = pretvoriFunkcijeNiza(jsKod);


    // Doda naziv klase statičkim varijabla pristupima
    for (const varijabla in staticVarijable) {
      const regex = new RegExp(`(?<!\\w\\.)\\b${varijabla}\\b(?!\\w)`, 'g');
      jsKod = jsKod.replace(regex, `${imeKlase}.${varijabla}`);
    }

    jsKod = jsKod.replace(/static\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(;|\s*=\s*[^;]*)?/g, 'static $2 $3');

    jsKod = jsKod.replace(/(\w+)\s+\(/g, (podudaranje, word) => {
      return `${word}(`;
    });

    jsKod = jsKod.replace(/Convert\.ToChar(?=(?:(?:[^"]*"){2})*[^"]*$)/g, 'String');
    jsKod = jsKod.replace(/Convert\.ToString(?=(?:(?:[^"]*"){2})*[^"]*$)/g, 'String');
    jsKod = jsKod.replace(/Convert\.ToBoolean(?=(?:(?:[^"]*"){2})*[^"]*$)/g, 'Boolean');
    jsKod = jsKod.replace(/Convert\.ToDouble(?=(?:(?:[^"]*"){2})*[^"]*$)/g, 'Number');
    jsKod = jsKod.replace(/Convert\.ToInt64(?=(?:(?:[^"]*"){2})*[^"]*$)/g, 'Number');
    jsKod = jsKod.replace(/Convert\.ToInt32(?=(?:(?:[^"]*"){2})*[^"]*$)/g, 'Number');
    jsKod = jsKod.replace(/Convert\.ToInt16(?=(?:(?:[^"]*"){2})*[^"]*$)/g, 'Number');
    jsKod = jsKod.replace(/Convert\.ToInt8(?=(?:(?:[^"]*"){2})*[^"]*$)/g, 'Number');

    // Ovdje se mož koristiti jsKod za svaku klasu prema potrebi
    rezultat += `\n\n${jsKod}`;
  }

  for (let i = 0; i < enums.length; i++)
    rezultat += `\n\n${enums[i]}`;

  rezultat = pretvoriKonzolneFunkcije(rezultat);
  rezultat = provjeriIPopraviWriteLine(rezultat, enumNazivi);
  rezultat = pretvoriMatFunkcije(rezultat);
  rezultat = pretvoriFloat(rezultat);

  rezultat += '\n\nProgram.Main(null);'

  return rezultat;
}


(function () {
  var oldLog = console.log;
  console.log = function () {
    var izlazniDiv = document.getElementById('drzac-izlaznog-koda-podrucje');
    if (izlazniDiv) {
      for (var i = 0; i < arguments.length; i++) {
        var poruka = document.createElement('p');
        let izlaz = String(arguments[i]);
        poruka.textContent = izlaz.replace(/ /g, "\u00A0");
        izlazniDiv.appendChild(poruka);
      }
    }
    oldLog.apply(console, arguments);
  };

  var oldClear = console.clear;
  console.clear = function () {
    var izlazniDiv = document.getElementById('drzac-izlaznog-koda-podrucje');
    if (izlazniDiv) {
      izlazniDiv.innerHTML = '';
    }
    oldClear.apply(console, arguments);
  };
})();

function izvrsiCsharpkKod() {
  console.clear();
  const code = document.getElementById("drzac-koda-textarea").value;
  const output = pretvoriSpecijalce(pretvoriCsharpUJs(code));
  //console.log(output); 
  const F = new Function(output);
  F();
}





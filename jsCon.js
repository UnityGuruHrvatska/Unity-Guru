
function pretvoriKonzolneFunkcije(csharpKod) {
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

function nadodajLetDeklariranojVarijabli(csharpKod) {
  let varijablePrvogDometa = new Set();

  // Regex za podudaranje deklaracija i referenci varijabli u C# kodu
  const varijableDekRegex = /\b(\w+)\s+(\w+)\s*(?:=\s*([^;]+);|;)/g;
  
  // Brojač za vitičaste zagrade zbog određivanja opsega/raspona
  let brZagrada = 0;
  
  // Zamjenjuje deklaracije i reference varijabli dodavanjem 'let'
  const rezultat = csharpKod.replace(
    varijableDekRegex,
    (podudaranje, vrsta, imeVarijable, vrijednost, pomak) => {
      // Ažurira brZagrada na temelju znakova '{' i '}
      for (let i = 0; i < pomak; i++) {
        if (csharpKod[i] === '{') {
          brZagrada++;
        } 
        else if (csharpKod[i] === '}') {
          brZagrada--;
        }
      }
  
      // Provjerite je li varijabla u prvom opsegu
      const jeUPrvomDometu = brZagrada === 1;
  
      if (jeUPrvomDometu) {
        varijablePrvogDometa.add(imeVarijable);
        return podudaranje;
      } 
      else if (!varijablePrvogDometa.has(imeVarijable)) {
        return `let ${vrsta} ${imeVarijable}${vrijednost !== undefined ? ` = ${vrijednost}` : ''};`;
      } 
      else {
        return podudaranje;
      }
    }
  );
  
  return rezultat;
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

  
  let rezultat = unos.replace(/(\b\w+(?:\.\w+)*\.)ToUpper\(\)/g, function(podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return 'String(' + nekoIme.slice(0, -1) + ').toUpperCase()';
    } 
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)ToLower\(\)/g, function(podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return 'String(' + nekoIme.slice(0, -1) + ').toLowerCase()';
    } 
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)IndexOf\((.*?)\)/g, function(podudaranje, nekoIme, args) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return 'String(' + nekoIme.slice(0, -1) + ').indexOf(' + args + ')';
    } 
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)Substring\((.*?)\)/g, function(podudaranje, nekoIme, args) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return 'String(' + nekoIme.slice(0, -1) + ').substring(' + args + ')';
    } 
    else {
      return podudaranje;
    }
  });

  // Zamijeni uzorak "nekoime.GetLength(n)" s "nekoime[n].length"
  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)GetLength\((\d+)\)/g, function(podudaranje, nekoIme, n) {
    // Check if nekoIme is in the deklariraneVarijable array
    if (!deklariraneVarijable.includes(nekoIme)) {
      return nekoIme.slice(0, -1) + '[' + n + '].length';
    } 
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)Max\(\)/g, function(podudaranje, nekoIme, n) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return `Math.max(...${nekoIme.slice(0, -1)})`;
    } 
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\.)Min\(\)/g, function(podudaranje, nekoIme, n) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return `Math.min(...${nekoIme.slice(0, -1)})`;
    } 
    else {
      return podudaranje;
    }
  });

  // Zamijeni uzorak "nekoime.Length" s "nekoime.length"
  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*)\.Length\b/g, function(podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (deklariraneVarijable.includes(nekoIme)) {
      return podudaranje;
    } 
    else {
      return nekoIme + '.length';
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\[[^\]]*\]\.)GetLength\((\d+)\)/g, function(podudaranje, nekoIme, n) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return nekoIme.slice(0, -1) + '[' + n + '].length';
    } 
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\[[^\]]*\]\.)Max\(\)/g, function(podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return `Math.max(...${nekoIme.slice(0, -1)})`;
    } 
    else {
      return podudaranje;
    }
  });

  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\[[^\]]*\]\.)Min\(\)/g, function(podudaranje, nekoIme) {
    // Provjeri nalazi li se nekoime u deklariraneVariable
    if (!deklariraneVarijable.includes(nekoIme)) {
      return `Math.min(...${nekoIme.slice(0, -1)})`;
    } 
    else {
      return podudaranje;
    }
  });

  // Zamijeni uzorak "nekoime.Length" s "nekoime.length"
  rezultat = rezultat.replace(/(\b\w+(?:\.\w+)*\[[^\]]*\]\.)Length\b/g, function(podudaranje, nekoIme) {
    // Provjeri nalazi li se varijabla u deklariraneVarijable
    if (deklariraneVarijable.includes(nekoIme)) {
      return podudaranje;
    } 
    else {
      return nekoIme + '.length';
    }
  });

  return rezultat.replace(/(\b\w+(?:\.\w+)*)\[((?:[\w.]+\s*,\s*)*[\w.]+)\]/g, function(podudaranje, varijabla, indeksi) {
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
  const zamjena = 'for (let $2 in in $3) { $2 = $3[$2];'; // Dodatak 'in' jer će kasnije jedan biti uklonjen arg uzorkom
  
  return unos.replace(regex, zamjena);
}

function pretvoriCsharpUJs(csharpKod) {
  const enums = [];

  csharpKod = csharpKod.replace(/enum\s+(\w+)\s*{([^}]+)}/g, (enumPodudaranje, enumNaziv, enumVrijednosti) => {
    const jsEnumVrijednosti = enumVrijednosti
      .split(',')
      .map((vrijednost) => {
        const podudaranje = /\s*([^\s=]+)(?:\s*=\s*([^\s,]+))?/.exec(vrijednost.trim());
        if (podudaranje) {
          const nazivClan = podudaranje[1];
          const vrijednostClan = podudaranje[2] ? `"${podudaranje[2]}"` : `"${nazivClan}"`;
          return `${nazivClan}: ${vrijednostClan}`;
        } 
        else {
          return null;
        }
      })
      .filter(Boolean)
      .join(',\n');
  
    enums.push(`const ${enumNaziv} = {\n${jsEnumVrijednosti}\n};`);
    return '';
  });

  csharpKod = csharpKod.replace(/(?:public|private|protected|\s+static)+\s+class/g, 'class');

  const klase = razdvojiKlase(csharpKod);
  const imenaKlase = klase.imenaKlase;
  const sadrzajiKlase = klase.sadrzajiKlase;

  let rezultat = '';
  
  // Prolazi kroz klase
  for (let i = 0; i < imenaKlase.length; i++)
  {
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

  jsKod = pretvoriCsharpNizUJs(jsKod);
  jsKod = pretvrotiCsharp2DNizUJs(jsKod);
  jsKod = nadodajLetDeklariranojVarijabli(jsKod);
  jsKod = pretvoriForeach(jsKod);

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

  jsKod = jsKod.replace(/\b(?<!\=)\s+(\w+)\s+(\w+)\s*\((.*?)\)/g, ' $2($3)');

  // Ukloni vrste iz argumenata funkcije
  jsKod = jsKod.replace(/("[^"]*"|'\S*')|\b(\w+(\s*\[\s*\])?)\s+(\w+)\s*(?=[),])/g, function(podudaranje, stringUNavodnicima, vrstaVarijable, _, imeVarijable) {
    if (stringUNavodnicima) {
      return stringUNavodnicima;
    } 
    else {
      return imeVarijable;
    }
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

  // Ovdje se mož koristiti jsKod za svaku klasu prema potrebi
  rezultat += `\n\n${jsKod}`;
  }

  for (let i = 0; i < enums.length; i++)
    rezultat += `\n\n${enums[i]}`;
  
  rezultat = pretvoriKonzolneFunkcije(rezultat);
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
        poruka.textContent = arguments[i];
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
  const output = pretvoriCsharpUJs(code);
  //console.log(output); 
  const F = new Function(output);
  F();
}
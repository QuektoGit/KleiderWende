const query = new URLSearchParams(window.location.search); //Formulareingaben werden aus dem Query-String in der URL ausgelesen
renderSubmitDonation(); //Seiteninhalt wird basierend auf den Formulareingaben erstellt.

//Gibt eine Zusammenfassung mit den Formulareingaben aus
function renderSubmitDonation() {
    const content = document.getElementById('submitDonationContent');

    //Ausgabe bei vollständig ausgefülltem Formular
    if (isFormComplete()) {
        //Ausgabe bei Online-Spendenanmeldung
        if (query.get('inhouse') === 'off')
            //Ausgabe bei erfolgreicher Online-Spendenanmeldung
            if (isZIPValid()) {
                const h = document.createElement('h2');
                h.innerText = `Danke für ihre Spende, ${query.get('firstName')} ${query.get('lastName')}!`;

                const p = document.createElement('p');
                p.innerText =
                    `
                Sie haben uns folgende Daten übermittelt:

                Spendenzweck: ${query.get('destination')}
                Art der Kleidung: ${getClothingTypeList()}
                Geeignet für: ${getClothingAgeList()}

                Adresse: ${query.get('address')}, ${query.get('zip')} ${query.get('city')}
                Tel.: ${query.get('phone')}
                
                Wir werden Sie in Kürze anrufen, um einen Abholtermin zu vereinbaren.
                `;

                const button = document.createElement('div');
                button.innerHTML = `<a href="../index.html" class="btn btn-primary">OK</a>`

                content.appendChild(h);
                content.appendChild(p);
                content.appendChild(button);
            }
            //Ausgabe bei fehlgeschlagener Online-Spendenanmeldung (PLZ außerhalb des Abholbereichs)
            else {
                const h = document.createElement('h2');
                h.innerText = "Leider können wir ihre Spende nicht abholen!";

                const p = document.createElement('p');
                p.innerText =
                    `
                Ihre Adresse liegt außerhalb unseres Abholbereichs.
                
                Gerne können Sie ihre Spende persönlich in einer Geschäftsstelle abgeben.
                `;

                const button = document.createElement('div');
                button.innerHTML = `<a href="donation-locations.html" class="btn btn-primary">Unsere Standorte</a>`

                content.appendChild(h);
                content.appendChild(p);
                content.appendChild(button);
            }
        //Ausgabe bei Spendenanmeldung in der Geschäftsstelle
        else if (query.get('inhouse') === 'on') {
            const h = document.createElement('h2');
            h.innerText = `Danke für ihre Spende!`;

            const p = document.createElement('p');
            p.innerText =
                `
            Sie haben folgende Spende abgegeben:

            Spendenzweck: ${query.get('destination')}
            Art der Kleidung: ${getClothingTypeList()}
            Geeignet für: ${getClothingAgeList()}
            
            Bitte legen Sie ihre Spende in das dafür vorgesehene Fach.
            `;

            const button = document.createElement('div');
            button.innerHTML = `<a href="donation-inhouse.html" class="btn btn-primary">OK</a>`

            content.appendChild(h);
            content.appendChild(p);
            content.appendChild(button);
        }
    }
    //Ausgabe, falls Formular unvollständig ist
    else {
        const h = document.createElement('h2');
        h.innerText = `Ihre Angaben sind unvollständig!`;

        const p = document.createElement('p');
        p.innerText =
            `
        Bitte kehren Sie zum Spendenformular zurück!
        `;

        const button = document.createElement('div');
        button.innerHTML = `<a href="javascript:history.back()" class="btn btn-primary">Zurück</a>`

        content.appendChild(h);
        content.appendChild(p);
        content.appendChild(button);
    }
}

//Prüft Formular auf Vollständigkeit
function isFormComplete() {
    return (
        query.get('destination') !== null //Zweck muss ausgewählt sein
        && getClothingTypeList() !== "" //Mindestens eine Kleidungsart muss ausgewählt sein
        && getClothingAgeList() !== "" //Mindestens eine Altersgruppe muss ausgewählt sein
    ) //Adresseingabe muss nicht überprüft werden, da die entsprechenden inputs in donation.html bereits auf 'required' gesetzt sind
}

//Prüft, ob die eingegebene PLZ im Abholgebiet liegt
function isZIPValid() {
    const zip = query.get('zip');
    const prefix = zip.slice(0, 2); //Loslösen des relevanten Teils der PLZ vom Rest
    const validPrefixes = ['70', '10', '20', '60'] //Liste der Präfixe aller Postleitzahlen von Orten, an denen es eine Geschäftsstelle gibt
    return validPrefixes.includes(prefix); //Gibt true zurück, wenn die angegebene PLZ im Abholbereich liegt
}

//Erstellt eine Liste der ausgewählten Kleidungsarten
function getClothingTypeList() {
    const list = [];
    if (query.get('everyday') === 'on') list.push("Oberteile & Hosen");
    if (query.get('outerwear') === 'on') list.push("Jacken & Mäntel");
    if (query.get('shoes') === 'on') list.push("Schuhe");
    if (query.get('accessoires') === 'on') list.push("Mützen, Schals, Handschuhe");
    return `${list.join(", ")}`;
}

//Erstellt eine Liste der Altersgruppen, für die die Kleidung geeignet ist
function getClothingAgeList() {
    const list = [];
    if (query.get('baby') === 'on') list.push("Babys");
    if (query.get('child') === 'on') list.push("Kinder");
    if (query.get('adult') === 'on') list.push("Erwachsene");
    return `${list.join(", ")}`;
}
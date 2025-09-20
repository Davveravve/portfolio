# Firebase Portfolio Setup Guide

Din portfolio har nu konverterats till Firebase! Här är hur du konfigurerar och använder den.

## 🚀 Snabbstart

### 1. Installera och kör
```bash
npm install
npm start
```

### 2. Konfigurera Firebase (första gången)
Öppna browser console på din sida och kör:
```javascript
// Importera setup-funktionen
import('./src/utils/setupFirebase.js').then(({ initializeFirebaseData }) => {
  initializeFirebaseData('dittSäkraLösenord123');
});
```

Detta skapar:
- ✅ Admin-konfiguration med ditt lösenord
- ✅ Grundläggande "About Me"-data
- ✅ Exempel-kategorier (Web Development, Mobile Apps, UI/UX Design)
- ✅ Ett exempel-projekt

### 3. Logga in som admin
1. Gå till `/admin` i din browser
2. Ange det lösenord du satte i steg 2
3. Du är nu inloggad!

## 🔧 Admin-funktioner

### Lösenordshantering
Ditt admin-lösenord lagras säkert i Firebase (inte i koden). För att ändra lösenord:

```javascript
// I browser console
import('./src/utils/setupFirebase.js').then(({ changeAdminPassword }) => {
  changeAdminPassword('dittNyaLösenord123');
});
```

### Dashboard-funktioner
- **Dashboard**: Översikt av projekt, kategorier och meddelanden
- **Lägg till projekt**: Skapa nya portfolio-projekt med bilder/videos
- **Hantera kategorier**: Organisera dina projekt i kategorier
- **Meddelanden**: Se meddelanden från kontaktformuläret
- **Redigera About Me**: Uppdatera din profil och profilbild

## 📁 Firebase Database-struktur

```
firestore/
├── admin/
│   └── config (lösenord och admin-inställningar)
├── content/
│   └── about (ditt namn, titel, bio, profilbild)
├── categories/
│   └── [documents] (namn, beskrivning, displayOrder)
├── projects/
│   └── [documents] (titel, beskrivning, teknologier, länkar, media)
└── messages/
    └── [documents] (namn, email, meddelande, läst-status)
```

## 🎨 Anpassa din portfolio

### 1. Uppdatera About Me
- Gå till `/admin`
- Klicka "Edit About Me"
- Uppdatera namn, titel, bio och ladda upp profilbild

### 2. Skapa projekt
- Klicka "Add New Project" i dashboard
- Fyll i projektinformation
- Ladda upp bilder/videos
- Välj kategori

### 3. Hantera kategorier
- Klicka "Manage Categories"
- Lägg till, redigera eller ta bort kategorier
- Ställ in visningsordning

## 🔒 Säkerhet

- **Lösenord**: Lagras säkert i Firestore, inte i källkod
- **Admin-åtkomst**: Endast via `/admin` med korrekt lösenord
- **Firebase-regler**: Konfigurera lämpliga säkerhetsregler i Firebase Console

## 🛠️ Teknisk information

### Nya Firebase-komponenter
- `src/config/firebase.js` - Firebase-konfiguration
- `src/utils/setupFirebase.js` - Setup och admin-verktyg
- `src/components/Admin/AboutEditor.js` - About Me-redigering
- `src/components/Admin/*Firebase.js` - Firebase-versioner av admin-komponenter

### Migrering från Supabase
Alla komponenter har uppdaterats för Firebase:
- Autentisering via lösenord istället för email/lösenord
- Firestore för datalagring
- Firebase Storage för bilder/videos

## 🎯 Nästa steg

1. **Testa systemet**: Logga in och prova alla funktioner
2. **Anpassa design**: Uppdatera färger och styling efter dina preferenser
3. **Lägg till projekt**: Skapa dina riktiga portfolio-projekt
4. **Konfigurera Firebase-regler**: Säkra din databas i Firebase Console
5. **Deploy**: Publicera din portfolio (Firebase Hosting, Netlify, Vercel, etc.)

## 🆘 Felsökning

### Kan inte logga in?
- Kontrollera att du kört `initializeFirebaseData()` först
- Verifiera lösenordet i Firebase Console under `admin/config`

### Projektet laddar inte?
- Kontrollera browser console för fel
- Verifiera Firebase-konfiguration i `src/config/firebase.js`

### Bilder laddar inte upp?
- Kontrollera Firebase Storage-regler
- Verifiera att Storage är aktiverat i Firebase Console

---

**Tips**: Alla Firebase-operationer loggas i browser console för enklare debugging!
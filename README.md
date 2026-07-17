# Nik Linder – Premium Personal Brand Website

Statische, responsive Website für GitHub Pages. Die bestehende Seitenstruktur wurde beibehalten und visuell zu einer hochwertigen Personal-Brand-, Experten- und Kursverkaufsseite ausgebaut.

## Seiten
- Startseite
- Freediving
- Relaqua
- Seatrekking
- Kurse & Reisen
- Über Nik
- Journal + Beispielartikel
- Kontakt
- Impressum / Datenschutz / 404

## Veröffentlichung auf GitHub Pages
1. Alle Dateien in ein Repository hochladen.
2. Unter **Settings → Pages** den Branch `main` und den Ordner `/root` wählen.
3. Domain und HTTPS konfigurieren.

## Vor dem Launch
- Alle orange markierten Platzhalter ersetzen.
- Authentische, lizenzierte Bilder einsetzen.
- Kurstermine, Leistungen, Preise und Voraussetzungen prüfen.
- Formular-Backend anbinden.
- Impressum, Datenschutz, AGB/Reisebedingungen rechtlich prüfen.
- Rekorde, Qualifikationen, Publikationen und Partner final verifizieren.

## Technik
- Kein Framework, kein Build-Schritt
- Reines HTML, CSS und JavaScript
- Keine externen Fonts, Tracker oder Embeds
- Mobile Navigation, Angebotsfilter, Demo-Formular und Scroll-Reveals


## Kinetic Experience Layer

The current version adds a premium motion and interaction system without external libraries:

- Context-aware custom cursor for fine-pointer desktop devices
- Magnetic buttons, click ripples and contextual cursor labels
- 3D card tilt and pointer-reactive hero depth visual
- Animated breath rings, bubbles, caustic light and depth scanner
- Kinetic brand-value marquee and live simulated depth readout
- Scroll progress indicator, staggered reveals and subtle page transitions
- Automatic reduced-motion mode and touch/mobile fallbacks

All interaction code lives in `assets/js/main.js`; the visual motion layer is appended to `assets/css/style.css`.

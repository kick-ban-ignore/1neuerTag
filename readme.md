# 1neuerTag 1newDay - sunrise Countdown ☀️⌛

A minimalist, privacy-focused browser extension that displays a beautiful, animated countdown until the next local sunrise. Featuring a meditative hourglass aesthetic, smooth pulsing star constellations, and an instant test mode.

<img width="400" height="460" alt="sonne klein" src="https://github.com/user-attachments/assets/68da049b-c225-495a-87c4-82fa71be059c" />
<img width="587" height="460" alt="sonne mit zeit" src="https://github.com/user-attachments/assets/e51b986f-2ff7-4167-b2f5-4408e535746e" />


## Features

* **Real-time Countdown:** Calculates the exact remaining time until the next sunrise based on your local coordinates.
* **100% Local & Private:** No data ever leaves your machine. Geolocation coordinates are processed strictly offline using `SunCalc`.
* **Calming Animations:** Features a custom ASCII-grid sky with slow, organically pulsing stars and a centered sun.
* **Universal Compatibility:** Works flawlessly on Manifest V3 supported browsers including Google Chrome, Brave, and Mozilla Firefox.
* **Built-in Test Mode:** Switch into test mode anytime to preview the sunrise animation sequence instantly.


## File Structure

```text
📁 1newDay-sunrise-countdown/
├── manifest.json       # Extension configuration (Manifest V3)
├── index.html          # Main user interface & styling
├── app.js              # Core UI logic and countdown timer
├── suncalc.js          # Offline astronomical calculation engine
└── background.js       # Background script to launch the extension
```
## Installation & Setup
### For Google Chrome & Brave

    Clone or download this repository to your local machine.

    Open your browser and navigate to chrome://extensions/.

    Enable Developer mode using the toggle switch in the top-right corner.

    Click on Load unpacked in the top-left corner.

    Select the root folder containing the extension files.

### For Mozilla Firefox (Developer Edition / Nightly)

Since this extension runs purely locally, you can load it permanently in Firefox Developer Edition:

    Open Firefox and type about:config in the address bar. Accept the warning.

    Search for xpinstall.signatures.required and double-click it to set it to false.

    Compress all files inside the project folder into a .zip archive (ensure manifest.json is at the root level of the zip). Rename the file extension from .zip to .xpi (e.g., 1newDay.xpi).

    Open about:addons, click the gear icon ⚙️, select Install Add-on From File..., and choose your .xpi file.

## Technical Details

    Frameworks used: None. Built entirely with vanilla HTML5, CSS3 Grid/Flexbox, and pure modern JavaScript.

    Astronomy Engine: Powered by a localized, CSP-compliant implementation of SunCalc to compute precise solar positions mathematically without external API dependencies.

## License

This project is open-source and available under the MIT License.

Made in Berlin by <a href="https://github.com/kick-ban-ignore" target="_blank" rel="noopener noreferrer">Max</a>, ❤️ and ☕ and some AI for making text more readable 🤖 and talking me out of stupid ideas.

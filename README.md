# Northbound Consulting — Minimal Editable Website

Change summary
- The "Companies I’ve Consulted For" section shows only company names (no testimonial quotes).
- Company names are stored as a simple array of strings in the saved JSON.

Preview
- Place files in a folder with an `assets/` subfolder containing `logo.svg` and a portrait at `assets/me.jpg` to replace the placeholder.
- Open `index.html` directly or run a local server:
  - `python3 -m http.server 8000`
  - then visit http://localhost:8000

How to edit company names
- Click Edit → click a company name card to edit the name inline → Done → Save to download a JSON backup.
- Load restores the array of company names from a previously saved JSON.

To publish
- I will enable GitHub Pages for the repository root (main branch) after pushing these files and will return the live URL.

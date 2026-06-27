# Απόστολος Ανθόπουλος — CMS-ready website

Αυτό το build δεν είναι απλό HTML zip. Είναι static site με Eleventy + Decap CMS, ώστε να μπορείς να γράφεις άρθρα, να προσθέτεις βίντεο και φωτογραφίες από browser.

## Local preview

```bash
npm install
npm run serve
```

Άνοιξε το URL που θα εμφανίσει το terminal.

## Deploy σε Netlify

1. Ανέβασε όλο τον φάκελο σε GitHub repository.
2. Στο Netlify: Add new site → Import from Git.
3. Build command: `npm run build`
4. Publish directory: `_site`
5. Στο Netlify ενεργοποίησε Identity.
6. Ενεργοποίησε Git Gateway.
7. Πρόσθεσε τον εαυτό σου ως χρήστη στο Identity.
8. Μετά μπαίνεις στο `/admin` και γράφεις άρθρα/βίντεο/φωτογραφίες.

## Περιεχόμενο

- Άρθρα: `content/articles/`
- Βίντεο: `content/videos/`
- Φωτογραφίες: `_data/gallery.json`
- Εικόνες που ανεβάζεις από το CMS: `assets/uploads/`

## Σημαντικό

Το `/admin` δουλεύει σωστά σε Netlify με Identity + Git Gateway. Σε απλό cPanel/FTP θα φαίνεται το site, αλλά δεν θα δουλεύει το CMS admin.

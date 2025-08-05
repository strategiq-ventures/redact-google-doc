# Google Docs Redaction Tool

Had a situation where I needed to show a prospective client the *effort* and *structure* of a deliverable without giving away the actual content.

Most “redaction” you see in shared docs is just black boxes over text — which anyone can strip out in seconds. I needed something destructive: once it’s redacted, it’s gone.

## What this script does
- Makes a copy of the doc (leaves your original alone)
- Keeps all headings visible
- Randomly redacts about two‑thirds of the non‑heading words
- Never shows more than three visible words in a row
- Adds a “Sample – Full Version Available on Engagement” watermark on every page
- Gives the copy a timestamped filename so you can keep versions straight

The result: a doc that shows the level of work done and the layout, but has zero usable content.

---

## How to run it in Google Docs (for first‑timers)
1. Open the Google Doc you want to redact.  
2. Go to **Extensions → Apps Script**.  
3. Delete anything in the editor and paste the script from this repository.  
4. Click the **Save** icon, name the project anything you want.  
5. In the script editor, run the `onOpen` function once (this adds the “Redact” menu).  
   - It will prompt you to authorize the script. Click through and allow access.  
6. Close the Apps Script tab and **re‑open your Google Doc**.  
7. You’ll now see a **Redact** menu at the top. Choose **Create Redacted Copy**.  
8. A new copy will be created in the same folder, redacted and watermarked, with your original untouched.

---

## Necessary CYA legalese
This is not a compliance tool, official legal redaction, or certified to meet any privacy standard.  
Do not use this for HIPAA, GDPR, state secrets, or hiding the identity of the real Batman.  
It’s just a quick way to send a “looks like the real thing” sample without giving away your actual work.

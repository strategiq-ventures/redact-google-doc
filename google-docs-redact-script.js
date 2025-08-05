/**
 * Google Docs Redaction Tool
 * 
 * Creates a redacted copy of the current Google Doc for safe sharing.
 * - Leaves the original untouched
 * - Preserves all heading text
 * - Randomly redacts ~2/3 of non-heading words
 * - Ensures no more than 3 visible words in a row
 * - Appends " - REDACTED - [timestamp]" to the filename
 * 
 * For demo/proof-of-work purposes only — not a legal/compliance redaction tool.
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu("Redact")
    .addItem("Create Redacted Copy", "createRedactedCopy")
    .addToUi();
}

function createRedactedCopy() {
  const doc = DocumentApp.getActiveDocument();
  const docId = doc.getId();
  const file = DriveApp.getFileById(docId);
  const parentFolders = file.getParents();

  // Create timestamp for filename
  const now = new Date();
  const timestamp = now.getFullYear() + "-" +
                    String(now.getMonth() + 1).padStart(2, '0') + "-" +
                    String(now.getDate()).padStart(2, '0') + " " +
                    String(now.getHours()).padStart(2, '0') + "-" +
                    String(now.getMinutes()).padStart(2, '0');

  // Create the copy
  const copyName = doc.getName() + " - REDACTED - " + timestamp;
  const copyFile = file.makeCopy(copyName);

  // Place in same folder as original if possible
  if (parentFolders.hasNext()) {
    const parent = parentFolders.next();
    parent.addFile(copyFile);
    DriveApp.getRootFolder().removeFile(copyFile);
  }

  // Open the copy for editing
  const copyDoc = DocumentApp.openById(copyFile.getId());

  // Redact the content
  processElement(copyDoc.getBody());

  // Save and close
  copyDoc.saveAndClose();

  // Open the redacted copy in a new tab
  const url = copyDoc.getUrl();
  const html = `<script>window.open("${url}","_blank");google.script.host.close();</script>`;
  DocumentApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html), "Opening Redacted Copy...");
}

// Recursive processor
function processElement(element) {
  const type = element.getType();

  if (type === DocumentApp.ElementType.PARAGRAPH) {
    const paragraph = element.asParagraph();
    const heading = paragraph.getHeading();
    if (heading !== DocumentApp.ParagraphHeading.NORMAL) return;
    redactTextElement(paragraph.editAsText());

  } else if (type === DocumentApp.ElementType.TABLE) {
    for (let r = 0; r < element.getNumRows(); r++) {
      const row = element.getRow(r);
      for (let c = 0; c < row.getNumCells(); c++) {
        processElement(row.getCell(c));
      }
    }

  } else if (type === DocumentApp.ElementType.LIST_ITEM) {
    redactTextElement(element.editAsText());

  } else if (type === DocumentApp.ElementType.TEXT) {
    redactTextElement(element.asText());

  } else if (element.getNumChildren) {
    for (let i = 0; i < element.getNumChildren(); i++) {
      processElement(element.getChild(i));
    }
  }
}

function redactTextElement(textElem) {
  if (!textElem) return;

  const text = textElem.getText();
  const words = text.split(/(\s+)/); // keep spaces
  let visibleCount = 0;
  let index = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (/^\w/.test(word)) {
      const redactChance = Math.random() < 0.66;
      if (redactChance || visibleCount >= 3) {
        textElem.deleteText(index, index + word.length - 1);
        textElem.insertText(index, "████");
        index += 4;
        visibleCount = 0;
      } else {
        visibleCount++;
        index += word.length;
      }
    } else {
      index += word.length;
      if (/[.!?]/.test(word)) visibleCount = 0;
    }
  }
}

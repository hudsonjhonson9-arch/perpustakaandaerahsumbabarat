function doGet() {
  return HtmlService.createHtmlOutput("<h2>Perpus Sumba Barat — Image Upload API</h2><p>Send POST with JSON body containing: file (base64), fileName, mimeType.</p>");
}

function doPost(e) {
  try {
    const folderName = "Perpus Sumba Barat — Images";
    const folders = DriveApp.getFoldersByName(folderName);
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    let data, blob;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (_) {
      data = e.parameters;
    }

    const base64 = data.file || e.parameter.file;
    const fileName = data.fileName || e.parameter.fileName || "upload.jpg";
    const mimeType = data.mimeType || e.parameter.mimeType || "image/jpeg";

    if (!base64) throw new Error("No file data received");

    blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const fileId = file.getId();

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, url: `https://drive.google.com/uc?export=view&id=${fileId}`, fileId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

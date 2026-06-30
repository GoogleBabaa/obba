# Subscriber List Setup

Use this when you want `/api/subscribe` to save every signup into a Google Sheet.

## Sheet Columns

Create a Google Sheet with this header row:

```csv
email,subscribedAt,page,pageTitle,referrer,timezone,language,country,region,city,latitude,longitude,ip,userAgent
```

## Apps Script

In the Google Sheet, open `Extensions > Apps Script` and paste:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents || '{}');
  sheet.appendRow([
    data.email || '',
    data.subscribedAt || '',
    data.page || '',
    data.pageTitle || '',
    data.referrer || '',
    data.timezone || '',
    data.language || '',
    data.country || '',
    data.region || '',
    data.city || '',
    data.latitude || '',
    data.longitude || '',
    data.ip || '',
    data.userAgent || '',
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy it as a web app:

- `Execute as`: Me
- `Who has access`: Anyone

Copy the web app URL and add it to Vercel environment variables:

```txt
SUBSCRIBERS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

Redeploy after adding the environment variable.

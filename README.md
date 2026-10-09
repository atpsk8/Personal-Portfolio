# Portfolio

My personal portfolio site, built with Express and EJS. It has a home page, a portfolio page, and a contact form that saves each submission to a Google Sheet.

## Run locally

```sh
npm install
npm start        # http://localhost:8080
npm run dev      # restarts on file changes
npm test
```

The site works without Google Sheets set up; form submissions just aren't saved and the server logs a warning.

## Editing projects

Projects on the home and portfolio pages come from [`data/projects.js`](data/projects.js). Add or edit an entry there; `featured: true` puts it on the home page.

## Google Sheets setup

Contacts are appended as rows of `timestamp | first name | last name | email`.

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Google Sheets API**.
2. Under **IAM & Admin → Service Accounts**, create a service account, then **Keys → Add key → JSON**. Save the file as `credentials.json` in this folder (it is git-ignored).
3. Create a Google Sheet, and **Share** it with the service account's email (the `client_email` in the JSON) as an **Editor**.
4. Copy the sheet ID from its URL (`docs.google.com/spreadsheets/d/<SHEET_ID>/edit`) and start the server with it:

   ```powershell
   $env:SHEET_ID = "<SHEET_ID>"; npm start
   ```

| Variable | Purpose |
|---|---|
| `SHEET_ID` | ID of the Google Sheet to write to |
| `GOOGLE_CREDENTIALS` | The service account JSON pasted as one value (use this on Render instead of a file) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to the key file, if not `./credentials.json` |
| `SHEET_RANGE` | Defaults to `Sheet1!A:D` |
| `PORT` | Defaults to `8080` |

## Deploy

- **Render:** New → Blueprint → pick this repo. It reads [`render.yaml`](render.yaml). Fill in `SHEET_ID` and `GOOGLE_CREDENTIALS` when asked.
- **CircleCI:** Projects → Set Up Project → pick this repo. It runs `npm test` on every push using [`.circleci/config.yml`](.circleci/config.yml).

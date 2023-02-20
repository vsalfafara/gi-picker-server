import { google } from 'googleapis'
import { format } from 'date-fns'

const spreadsheetId = process.env.SHEET_ID

function checkMode(mode: string) {
  if (mode === 'kingOfTeyvat') {
    return 'King of Teyvat - History'
  } else if (mode === 'fight2DaTop') {
    return 'Fight 2 Da Top - History'
  } else if (mode === 'abyss') {
    return 'Abyss - History'
  }
}

async function saveData(data: any) {
  const { sheetData, mode } = data
  sheetData.unshift(format(new Date(), 'MM/dd/yyyy h:mm b'))

  const auth = new google.auth.GoogleAuth({
    keyFile: 'secrets.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  })

  const client = await auth.getClient()

  const sheets = google.sheets({
    version: 'v4',
    auth: client
  })

  const response = await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: checkMode(mode),
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [sheetData]
    }
  })

  return response
}

export default saveData
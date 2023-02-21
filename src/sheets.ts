import { google } from 'googleapis'
import { format } from 'date-fns'

const spreadsheetId = process.env.SHEET_ID

type Sheet = {
  mode: string
  sheet: string
}

const sheets: Sheet[] = [
  {
    mode: 'amberGames',
    sheet: 'Amber Games - History'
  },
  {
    mode: 'kingOfTeyvat',
    sheet: 'King of Teyvat - History'
  },
  {
    mode: 'fight2DaTop',
    sheet: 'Fight 2 Da Top - History'
  },
  {
    mode: 'abyss',
    sheet: 'Abyss - History'
  }
]

function getSheetName(mode: string) {
  const sheetData = sheets.find((sheet: Sheet) => sheet.mode === mode)
  return sheetData.sheet
}

export async function saveData(data: any) {
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
    range: getSheetName(mode),
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [sheetData]
    }
  })

  return response
}

export async function getData(mode: string) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'secrets.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  })

  const client = await auth.getClient()

  const sheets = google.sheets({
    version: 'v4',
    auth: client
  })

  const response = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: getSheetName(mode),
  })

  return response
}
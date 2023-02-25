import { google } from "googleapis"
import { format } from "date-fns"

const abyssSpreadsheetId = process.env.SHEET_ID_ABYSS
const amberGamesSpreadsheetId = process.env.SHEET_ID_AMBER_GAMES
const kotSpreadsheetId = process.env.SHEET_ID_KOT

type Sheet = {
  mode: string
  sheetId: string
}

const sheets: Sheet[] = [
  {
    mode: "amberGames",
    sheetId: amberGamesSpreadsheetId,
  },
  {
    mode: "kingOfTeyvat",
    sheetId: kotSpreadsheetId,
  },
  {
    mode: "abyss",
    sheetId: abyssSpreadsheetId,
  },
]

function getSheetId(mode: string) {
  const sheetData = sheets.find((sheet: Sheet) => sheet.mode === mode)
  return sheetData.sheetId
}

export async function saveData(data: any) {
  const { sheetData, mode } = data
  sheetData.unshift(format(new Date(), "MM/dd/yyyy h:mm b"))

  const auth = new google.auth.GoogleAuth({
    keyFile: "secrets.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  })

  const client = await auth.getClient()

  const sheets = google.sheets({
    version: "v4",
    auth: client,
  })

  const response = await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId: getSheetId(mode),
    range: "History",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [sheetData],
    },
  })

  return response
}

export async function getData(mode: string) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "secrets.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  })

  const client = await auth.getClient()

  const sheets = google.sheets({
    version: "v4",
    auth: client,
  })

  const response = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: getSheetId(mode),
    range: "History",
  })

  return response
}

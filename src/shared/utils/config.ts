/* eslint-disable */
import * as fs from "fs"

import * as dotenv from "dotenv"

export function loadConfig() {
  const environment = process.env.NODE_ENV || "local"

  const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`))

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      console.log(data[key])
      process.env[key] = data[key]
    }
  }
}

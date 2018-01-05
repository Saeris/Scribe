import { readFileSync } from "fs"
import { resolve } from "path"

const key = readFileSync(resolve(__dirname, `..`, PRIVATE_KEY))

const validateFunc = () => {

}


export default {
  key,
  validateFunc,
  verifyOptions: { algorithms: [`HS256`] }
}

import { createReadStream, createWriteStream, existsSync } from "fs"
import { join } from "path"
import stream from "stream"
import mkdirp from 'mkdirp'
import { generatePrivateKey } from "ursa"

const { info, error } = console

async function setup() {
  // if a keypair doesn't already exist, create it
  try {
    info(`Beginning server setup...`)
    const ssh = join(__dirname, `.ssh`)
    if (existsSync(ssh)) {
      info(`Keypair already exists! Skipping...`)
    } else {
      info(`Creating ssh keypair...`)
      const keypair = await generatePrivateKey()
      const publicPem = new stream.PassThrough()
      publicPem.end(keypair.toPublicPem())
      const privatePem = new stream.PassThrough()
      privatePem.end(keypair.toPrivatePem())
      await mkdirp.sync(ssh)
      await publicPem.pipe(createWriteStream(`${ssh}/public.pem`))
      await privatePem.pipe(createWriteStream(`${ssh}/private.pem`))
      info(`Successfully created ssh keypair!`)
    }
    // if an .env file doesn't already exist, create one from the template
    const env = join(__dirname, `.env`)
    if (existsSync(env)) {
      info(`Environment settings already exist! Skipping...`)
    } else {
      info(`Creating .env file from template...`)
      await createReadStream(`.env.default`).pipe(createWriteStream(`.env`))
      info(`Successfully created .env file!`)
    }
    info(`Server setup finished! Run 'yarn start' to start the server!`)
  } catch (err) {
    error(`Server setup failed with the following error:`, err)
  }
}

setup()

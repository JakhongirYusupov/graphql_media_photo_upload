import path from 'path'
import fs from 'fs'

export default {
    Query: {
        upload: () => 'upload'
    },

    Mutation: {
        upload: async (_, { file }) => {
            const { createReadStream, filename, mimetype, encoding } = await file.file
            const stream = createReadStream()
            const fileAddress = path.join(process.cwd(), 'uploads', filename)
            console.log(fileAddress);
            const out = fs.createWriteStream(fileAddress)
            stream.pipe(out)

            return filename
        }
    }
}
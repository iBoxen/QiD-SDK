import { run } from "@mermaid-js/mermaid-cli"
import { readdirSync, readFileSync, writeFileSync, unlink } from 'fs'

const ROOT = './' + process.env.TARGET_VERSION

const files = readdirSync(ROOT)
const mermaidFiles = files.filter(name => name.includes('mmd') && !name.includes('png'))

for (const mmd of mermaidFiles) {
    const filePath = `${ROOT}/${mmd}`
    const content = readFileSync(filePath).toString()
    const cleanedContent = content.replace('```mermaid', '').replace('```', '')
    const cleanedFilePath = `${filePath.replace('mmd', 'cleaned.mmd')}`
    writeFileSync(cleanedFilePath, cleanedContent)

    await run(
        cleanedFilePath, `${ROOT}/${mmd.replace('.mmd', '')}.png`,
    )
    unlink(cleanedFilePath, () => { })
}


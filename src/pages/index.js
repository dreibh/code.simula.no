import { useContext, useState } from 'react'
import { SearchContext } from '../context/search'
import fs from 'fs'
import matter from 'gray-matter'
import { CodeGrid } from '../components/grid'
import SearchAndFilter from '../components/search'

export async function getStaticProps() {
    const files = fs.readdirSync('code')

    const code = files.map(fileName => {
        const slug = fileName.replace('.md', '')
        const filepath = `code/${fileName}`
        const readFile = fs.readFileSync(filepath, 'utf-8')
        const stats = fs.statSync(filepath)
        const { data: frontmatter } = matter(readFile)
        frontmatter.mtime = stats.mtime.toLocaleDateString()
        return {
            slug,
            frontmatter
        }
    })

    return {
        props: {
            code
        }
    }
}

export default function Home({ code }) {
    const [value, setValue] = useState('')

    return (
        <SearchContext.Provider value={{ value, setValue }}>
            <div>
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl">Simula Code Repositories</h1>
                    <h2 className="text-xl">
                        A collection of code repositories published by{' '}
                        <br />
                        Simula Research Laboratory and SimulaMet.
                    </h2>
                </div>
                <CodeGrid code={code} />
            </div>
        </SearchContext.Provider>
    )
}

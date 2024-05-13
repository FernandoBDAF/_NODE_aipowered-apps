import {openai} from './openai.js'
import {Document} from "langchain/document"
import {MemoryVectorStore} from "langchain/vectorstores/memory"
import {OpenAIEmbeddings} from "@langchain/openai"

const movies = [
    {
        id: 1,
        title: 'StepBrother',
        description: 'Comedic journey full of adult humor and awkwardness'
    },
    {
        id: 2,
        title: 'The Maxtrix',
        description: "Deal with alternate realities and questioning what's real"
    },
    {
        id: 3,
        title: 'The Dark Knight',
        description: 'A hero and his struggle against a villain'
    },
    {
        id: 4,
        title: 'The Godfather',
        description: 'A crime family and their rise to power'
    },
    {
        id: 5,
        title: "Shutter Island",
        description: "A detective's journey to uncover the truth"
    },
    {
        id: 6,
        title: 'Memento',
        description: "A non-linear narrative that challenges the viewer's perception",
    },
    {
        id: 7,
        title: 'Inception',
        description: "A heist within a dream"
    },
    {
        id: 8,
        title: "Doctor Strange",
        description: "Features alternate dimensions and reality mapiulation",
    },
    {
        id: 9,
        title: "The Prestige",
        description: "A rivalry between magicians",
    },
    {
        id: 10,
        title: "Interstellar",
        description: "Features furutistic space travel and time dilation with high stakes",
    },
    {
        id: 11,
        title: "The Shawshank Redemption",
        description: "A story of hope and friendship in the face of adversity",
    },
    {
        id: 12,
        title: "The Silence of the Lambs",
        description: "A psychological thriller about a serial killer",
    },
    {
        id: 13,
        title: "The Departed",
        description: "An undercover cop infiltrates a crime syndicate",
    },
    {
        id: 14,
        title: "The Social Network",
        description: "The story of Facebook's creation and the people behind it",
    },
    {
        id: 15,
        title: "The Big Short",
        description: "A look at the 2008 financial crisis",
    },
    {
        id: 16,
        title: "The Revenant",
        description: "A tale of survival and revenge",
    },
    {
        id: 17,
        title: "The Wolf of Wall Street",
        description: "The rise and fall of a stockbroker",
    },
    {
        id: 18,
        title: "The Grand Budapest Hotel",
        description: "A quirky tale set in a fictional European country",
    },
    {
        id: 19,
        title: "Paw Patrol",
        description: "AChildren's animated movie where a group of adorable puppies save people from all sorts of emergencies",
    },
]

const createStore = () => { 
    return MemoryVectorStore.fromDocuments(
    movies.map((movie) => new Document({
        pageContent: movie.title + " " + movie.description,
        metadata: {source: movie.id, title: movie.title},
    })),
    new OpenAIEmbeddings(),
)}

const search = async (query, count = 1) => {
    const store = createStore()
    const results = (await store).similaritySearch(query, count)
    return results
}

console.log(await search("something cute and fluffy"))
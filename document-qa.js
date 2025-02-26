import { openai } from './openai.js'
import { Document } from 'langchain/document'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from '@langchain/openai'
import { CharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { YoutubeLoader } from 'langchain/document_loaders/web/youtube'

// node queueMicrotask.js "this is process.argv[2]"
const question = process.argv[2] || 'HI'
// const video = 'https://youtu.be/zR_iuq2evXo?si=cG8rODgRgXOx9_Cn'
const video = 'https://www.youtube.com/watch?v=DQacCB9tDaw'

const createStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings())
const docsFromYTVideo = (video) => {
  const loader = YoutubeLoader.createFromUrl(video, {
    language: 'en',
    addVideoInfo: true,
  })
  return loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: ' ',
      chunkSize: 2500,
      chunkOverlap: 100,
    }),
  )
}

const docsFromPDF = () => {
  const loader = new PDFLoader('xbox.pdf')
  return loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: '. ',
      chunkSize: 2500,
      chunkOverlap: 200,
    }),
  )
}

const loadStore = async () => {
  const videoDocs = await docsFromYTVideo(video)
  const pdfDocs = await docsFromPDF()

  return createStore([...videoDocs, ...pdfDocs])
}

const query = async () => {
  const store = await loadStore()
  const results = await store.similaritySearch(question, 2)
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content:
          'You are an ai assistant, answer any questions to the best of your ability.',
      },
      {
        role: 'user',
        content: `
            Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff, Just say you need more context.
            Question: ${question}
            Context: ${results.map((result) => result.pageContent).join('\n')}
            `,
      },
    ],
  })

    console.log(`Anwer: ${response.choices[0].message.content}\nSources: ${results.map((result) => result.metadata.source).join(', ')}`)
}

query()

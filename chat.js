import {openai} from './openai.js'
import readline from 'node:readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const newMessage = async (history, message) => {
    const results = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            ...history,
            message
        ],
        temperature: 1,
    })

    return results.choices[0].message
}

const formatMessage = (userInput) => ({role: 'user', content: userInput})

const chat = async () => {
    const history = [
        {role: 'system', content: 'You are an ai assistant, answer any questions to the best of your ability.'}
    ]

    const start = () => {
        rl.question('You: ', async (userInput) => {
            if (userInput.toLowerCase() === 'exit') {
                rl.close()
                return
            }

            const userMessage = formatMessage(userInput)
            const response = await newMessage(history, userMessage)

            history.push(userMessage, response)
            console.log(`\n\nAI: ${response.content}`)
            start()
        })
        
    }
    console.log('\n\nAI: How can I help you today?\n\n')
    start()
}

console.log("Chatbot initialized. Type 'exit' to quit.")
chat()


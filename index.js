import 'dotenv/config'

import OpenAI from 'openai'

const openai = new OpenAI(process.env.OPENAI_API_KEY)
const results = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        {role: 'system', content: 'You are an ai assistant, answer any questions to the best of your ability.'},
        {role: 'user', content: 'Can you tell me what is the best way to learn how to do maths?'}
    ],
})

console.log(results.choices[0].message.content)
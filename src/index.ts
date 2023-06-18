import * as dotenv from "dotenv";

import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

dotenv.config();

const model = new OpenAI({});
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory: memory });
const res1 = await chain.call({ input: "What languages from this list can you understand? Kazakh, Kyrgyz, Tajik, Turkmen, Uzbek, Uyghur, Turkish, Farsi, and Russian, Central Kurdish, Northern Kurdish, and Southern Kurdish?" });
console.log(res1);
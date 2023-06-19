import * as dotenv from "dotenv";

import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory } from "langchain/memory";

dotenv.config();

/* Initialize the LLM to use to answer the question */
const model = new OpenAI({});
/* Load in the file we want to do question answering over */
const text = `Jesus is not God’s Son in the sense of a human father and a son. God did not get married and have a son. God did not mate with Mary and, together with her, produce a son. Jesus is God’s Son in the sense that He is God made manifest in human form (John 1:1, 14). Jesus is God’s Son in that He was conceived in Mary by the Holy Spirit. Luke 1:35 declares, “The angel answered, 'The Holy Spirit will come upon you, and the power of the Most High will overshadow you. So the holy one to be born will be called the Son of God.’”

During His trial before the Jewish leaders, the High Priest demanded of Jesus, “I charge you under oath by the living God: Tell us if you are the Christ, the Son of God” (Matthew 26:63). “‘Yes, it is as you say,’ Jesus replied. ‘But I say to all of you: In the future you will see the Son of Man sitting at the right hand of the Mighty One and coming on the clouds of heaven’” (Matthew 26:64). The Jewish leaders responded by accusing Jesus of blasphemy (Matthew 26:65-66). Later, before Pontius Pilate, “The Jews insisted, ‘We have a law, and according to that law He must die, because He claimed to be the Son of God’” (John 19:7). Why would His claiming to be the Son of God be considered blasphemy and be worthy of a death sentence? The Jewish leaders understood exactly what Jesus meant by the phrase “Son of God.” To be the Son of God is to be of the same nature as God. The Son of God is “of God.” The claim to be of the same nature as God—to in fact be God—was blasphemy to the Jewish leaders; therefore, they demanded Jesus’ death, in keeping with Leviticus 24:15. Hebrews 1:3 expresses this very clearly, “The Son is the radiance of God’s glory and the exact representation of His being.”

Another example can be found in John 17:12 where Judas is described as the “son of perdition.” John 6:71 tells us that Judas was the son of Simon. What does John 17:12 mean by describing Judas as the “son of perdition”? The word perdition means “destruction, ruin, waste.” Judas was not the literal son of “ruin, destruction, and waste,” but those things were the identity of Judas' life. Judas was a manifestation of perdition. In this same way, Jesus is the Son of God. The Son of God is God. Jesus is God made manifest (John 1:1, 14).`;

/* Split the text into chunks */
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);
/* Create the vectorstore */
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

const QA_PROMPT = `You are a Christian responding to Muslim's questions about Christianity. 
If you can't find the answer in the context below, just say "Hmm, I'm not sure". You can also ask the student to rephrase the question if you need more context. But don't try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
Answer in a concise or elaborate format as per the intent of the question.`;

/* Create the chain */
const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    qaTemplate: QA_PROMPT,
    memory: new BufferMemory({
      memoryKey: "chat_history", // Must be set to "chat_history"
    }),
  },

);

/* creat a new chain that will use the model and vectorStore with memory and the 
/* Ask it a question */
const question = "Why do Christians believe that Jesus is the Son of God?";
const res = await chain.call({ question });
console.log(res);
/* Ask it a follow up question */
const followUpRes = await chain.call({
  question: "Did God ever say that Jesus was his son?",
});
console.log(followUpRes);
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
  maxRetries: 0,
  thinkingLevel: "low",
});


export async function testAi(){
    model.invoke("What is Deep Learning? Explain in 100 words").then((response) => {
        console.log(response.text);
        
    })
}

// export async function testAi() {
//   try {
//     console.log("Calling Gemini API...");

//     const response = await model.invoke(
//       "What is AI Explain under 100 words?"
//     );

//     console.log("Gemini response:", response.content);
//   } catch (error) {
//     console.error("Gemini API error:", error.message);

//     if (error.status === 429) {
//       console.error(
//         "Gemini quota exceeded. Check your API usage and billing."
//       );
//     }
//   }
// }

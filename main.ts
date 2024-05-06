import OpenAI from "npm:openai";
import { Effect } from "npm:effect";

const openai = new OpenAI();

const systemPrompt =
  "Answer the question as if you were in Monty Python's Holy Grail, but very succinctly.";

async function ask(question: string): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0].message.content;
}

const main = (question: string) => Effect.tryPromise(() => ask(question));

Effect.runPromise(
  Effect.all(
    [
      main("What is your name?"),
      main("What is your quest?"),
      main("What is your favourite colour?"),
    ],
    { concurrency: "unbounded" } // massive speedup for our OpenAI-bound code
  )
).then(console.log);

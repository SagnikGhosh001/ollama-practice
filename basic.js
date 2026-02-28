const callOllama = async (messages) => {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1",
      messages,
      // stream: false, // it will tell modle to generate the response fully then send it
    }),
  });

  return res.body.getReader();
};
const messages = [
  {
    role: "system",
    content: "You are a helpful geographic assistant.",
  },
  {
    role: "user",
    content: "why is the sky blue?",
  },
];

const reader = await callOllama(messages);
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();

  if (done) {
    console.log("Stream finished");
    break;
  }

  console.log("RAW CHUNK:");
  console.log(decoder.decode(value));
}

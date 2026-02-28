const callOllama = async (messages, tools) => {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1",
      messages,
      stream: false,
      tools,
    }),
  });

  return res.json();
};
const messages = [
  {
    role: "system",
    content: "You are a helpful math assistant.",
  },
  {
    role: "user",
    content: Deno.args[0],
  },
];

const tools = [
  {
    type: "function",
    function: {
      name: "adder",
      description: "Add two numbers",
      parameters: {
        type: "object",
        properties: {
          a: { type: "number" },
          b: { type: "number" },
        },
        required: ["a", "b"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "substract",
      description: "substract two numbers",
      parameters: {
        type: "object",
        properties: {
          a: { type: "number" },
          b: { type: "number" },
        },
        required: ["a", "b"],
      },
    },
  },
];

while (true) {
  const res = await callOllama(messages, tools);
  console.log(res);
  const toolMessage = res.message;

  messages.push(toolMessage);

  if (!toolMessage.tool_calls) {
    console.log("last tool call");
    break;
  }

  const toolCall = toolMessage.tool_calls[0];
  if (toolCall.function.name === "adder") {
    const args = toolCall.function.arguments;
    const result = args.a + args.b;

    messages.push({
      role: "tool",
      name: "adder",
      content: JSON.stringify(result),
    });
  }

  if (toolCall.function.name === "substract") {
    const args = toolCall.function.arguments;
    const result = args.a - args.b;

    messages.push({
      role: "tool",
      name: "substract",
      content: JSON.stringify(result),
    });
  }
}

console.log(messages);

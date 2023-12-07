// Main code. Not yet separated. 
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { OpenAI } from 'openai';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

client.once('ready', () => {
  console.log('Bot is online');
});


function generateCodeChallenges() {
  const challenges = [];
  
  challenges.push("const a = [5, 10, 15]; let sum = 0; for (let i = 0; i < a.length; i++) { sum += a[i]; } console.log(sum); // What's the output?"
)

challenges.push("const nums = [2, 3, 4, 5, 6]; let count = 0; for (let i = 0; i < nums.length; i++) { if (nums[i] % 2 === 0) { count++; } } console.log(count); // What's the output?"
)

challenges.push("const arr = [1, 2, 3]; const squares = []; for (let i = 0; i < arr.length; i++) { squares.push(arr[i] * arr[i]); } console.log(squares); // What's the output?"
)

challenges.push("const numbers = [3, 1, 7, 4]; let max = numbers[0]; for (let i = 1; i < numbers.length; i++) { if (numbers[i] > max) { max = numbers[i]; } } console.log(max); // What's the output?"
)

challenges.push("const items = [1, 3, 5, 7]; let found = false; for (let i = 0; i < items.length; i++) { if (items[i] === 4) { found = true; break; } } console.log(found); // What's the output?"
)


  return challenges;
}

//WHEN YOU ENTER !codeChallenge IT TRIGGERS THE CODE BOT. 
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!codeChallenge') {
    const challenges = generateCodeChallenges();
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    await message.reply(randomChallenge);
    await message.channel.sendTyping()
  } else {
 // NORMAL AI CHATBOT FUNCTIONALITY
    const userMessage = message.content;
    let conversation = [];

    let prevMessages = await message.channel.messages.fetch({ limit: 12 });
    prevMessages = prevMessages.reverse();
    await message.channel.sendTyping()

    prevMessages.forEach((msg) => {
      if (!msg.author.bot || msg.author.id === client.user.id) {
        conversation.push({
          role: msg.author.id === client.user.id ? 'assistant' : 'user',
          content: msg.content,
        });
      }
    });

   
    conversation.push({
      role: 'user',
      content: userMessage,
    });

    console.log(typeof userMessage);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: conversation,
        stream: true,
      });

     let botReply = '';
      for await (const chunk of response) {
        botReply += chunk.choices[0]?.delta?.content || '';
      }
 
      if (botReply) {
        message.reply(botReply.trim());
      }
    } catch (error) {
      console.error('OpenAI Error:', error.message);
      message.reply("Apologies, but I'm unable to respond right now.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
//END
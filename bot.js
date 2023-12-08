// Main code. Not yet separated. 
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { OpenAI } from 'openai';

dotenv.config();
let conversation = [];

let beginner = "beginner";
    let intermediate = "intermediate";
    let advanced = "advanced";
    let firstMessge = "chicken";
    const beginnerMessage = `In this chat, do not provide any explanations of code. Only use single-letter variable names. Generate 1 example of a modern JavaScript code-reading challenge you might get in a job interview. The difficulty level should be ${beginner} For these examples, use a mixture of different array methods.`;
    const intermediateMessage = `In this chat, do not provide any explanations of code. Only use single-letter variable names. Generate 1 example of a modern JavaScript code-reading challenge you might get in a job interview. The difficulty level should be ${intermediate} For these examples, use a mixture of different array methods.`;
    const advancedMessage = `In this chat, do not provide any explanations of code. Only use single-letter variable names. Generate 1 example of a modern JavaScript code-reading challenge you might get in a job interview. The difficulty level should be ${advanced} For these examples, use a mixture of different array methods.`;


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
    
    client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
    
      let prevMessages = await message.channel.messages.fetch({ limit: 12 });
      prevMessages = prevMessages.reverse();
      await message.channel.sendTyping();
    
      prevMessages.forEach((msg) => {
        if (!msg.author.bot || msg.author.id === client.user.id) {
          conversation.push({
            role: msg.author.id === client.user.id ? 'assistant' : 'user',
            content: msg.content,
          });
        }
      });
    
      if (message.content === '!beginner') {
        conversation.push({
          role: 'user',
          content: beginnerMessage,
        });
      }
      if (message.content === '!intermediate') {
        conversation.push({
          role: 'user',
          content: intermediateMessage,
        });
      }

      if (message.content === '!advanced') {
        conversation.push({
          role: 'user',
          content: advancedMessage,
        });
      }

   
    
      // Common logic for handling both special commands and regular messages
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
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
    });
    
    client.login(process.env.DISCORD_TOKEN);
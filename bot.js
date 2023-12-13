// Main code. Not yet separated. 
import dotenv from 'dotenv';
import { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';
dotenv.config();
let conversation = [];
let botIntroMsg = 'Hello there! I am a bot designed to help you practice your Javascriptcode-reading skills. I have 3 modes, Beginner, Intermediate and Advanced. Selecting one of these buttons will provide you with an appropriate Javascript example code to read. In addition to using the buttons, you can type prompts to start the challenges, too. For Beginner, type = !beginner | For Intermediate, type !intermediate | For Advanced, type !advanced.';

const botButtons = [
  { label: 'Beginner', customId: 'beginner' },
  { label: 'Intermediate', customId: 'intermediate' },
  { label: 'Advanced', customId: 'advanced' },
  { label: 'Hint', customId: 'hint' }
];

    let intermediate = "intermediate";
    let advanced = "advanced";
    // let firstMessge = "chicken";
    const beginnerMessage = `In this chat, do not provide any explanations of code. Only use single-letter variable names. Generate 1 example of a modern JavaScript code-reading challenge you might get in a job interview. The difficulty level should be beginner For these examples, use a mixture of different array methods.`;
    const intermediateMessage = `In this chat, do not provide any explanations of code. Only use single-letter variable names. Generate 1 example of a modern JavaScript code-reading challenge you might get in a job interview. The difficulty level should be ${intermediate} For these examples, use a mixture of different array methods.`;
    const advancedMessage = `In this chat, do not provide any explanations of code. Only use single-letter variable names. Generate 1 example of a modern JavaScript code-reading challenge you might get in a job interview. The difficulty level should be ${advanced} For these examples, use a mixture of different array methods.`;
    const hintMessage = `Create a hint for the most recent code challenge that you sent.`;
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
   


      const row = new ActionRowBuilder().addComponents( botButtons.map(button =>
        new ButtonBuilder()
        .setCustomId(button.customId)
        .setLabel(button.label)
        .setStyle(ButtonStyle.Primary)
      ));

      
    client.on('messageCreate', async (message) => {
      if(message.author.bot) return 
      if(message.content !== "!beginner" && message.content !== "!intermediate" && message.content !== "!advanced") {
        // message.reply(botIntroMsg);

       return message.reply({ content: botIntroMsg, components: [row] }); 

      } 
     
    // intro message calling
    
      let prevMessages = await message.channel.messages.fetch({ limit: 12 });
      prevMessages = prevMessages.reverse();
      await message.channel.sendTyping();

      prevMessages.forEach((msg) => {
        if (!msg.author.bot || msg.author.id === client.user.id) {
          pushIntoArray(conversation, msg.author.id === client.user.id ? 'assistant' : 'user', msg.content);
        }
      });


      

      // console.log(prevMessages)
      
     


      if (message.content === '!beginner' ) {
        pushIntoArray(conversation, 'assistant', beginnerMessage);


      }
      if (message.content === '!intermediate') {
        pushIntoArray(conversation, 'assistant', intermediateMessage);

      }

      if (message.content === '!advanced') {
        pushIntoArray(conversation, 'assistant', advancedMessage);
      }

  

      function pushIntoArray(array, role, content) {
        array.push({
          role: role,
          // "user"
          content: content
        })
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

    client.on('interactionCreate', async (interaction) => {
      console.log("Received interaction:", interaction);
    
      if (!interaction.isButton()) return;
    
      console.log("Button interaction:", interaction.customId);
    

      let responseMessage = '';
      switch (interaction.customId) {
        case 'beginner':
          responseMessage = "To start the Beginner challenge, type `!beginner`.";
          break;
        case 'intermediate':
          responseMessage = "To start the Intermediate challenge, type `!intermediate`.";
          break;
        case 'advanced':
          responseMessage = "To start the Advanced challenge, type `!advanced`.";
          break;
       
        default:
          responseMessage = "Invalid selection";
      }
    
      await interaction.reply({ content: responseMessage, ephemeral: true });
      console.log(`Replied to ${interaction.customId} interaction`);
    });
    
    client.login(process.env.DISCORD_TOKEN);
    // up to date 
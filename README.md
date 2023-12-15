# Discord Code-Reading Bot

This Discord bot is designed to help users practice their JavaScript code-reading skills. The bot provides code challenges for different difficulty levels and allows users to interact with the challenges using buttons and then prompts.

## Features

- Three difficulty levels: Beginner, Intermediate, and Advanced.
- Code challenges with instructions to read and understand JavaScript code.
- Interaction through buttons for ease of use.
- Specific written prompts that are displayed when the corresponding button is clicked. 

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>

2. Install dependencies

npm install

3. Set up environment variables:

Create a .env file and add your Discord bot token and OpenAI API key:

DISCORD_TOKEN=<your-discord-bot-token>
OPEN_API_KEY=<your-openai-api-key>

4. Run the bot
npm start

5. Invite the bot to your Discord server

Use the Discord Developer Portal to create a bot and get the bot token. Then, create an invite link for your server.

6. Interact with the bot

Use the !beginner, !intermediate, and !advanced commands to display the required prompt for each challenge. 
Enter the prompt using discord chat. 
Enjoy practicing your JavaScript code-reading skills!

** Coming Soon ** 
- A hint button displayed in each code reading challenge. When clicked, the hint button sends a direct message that provides the user some assistance in the challenge. 
- Buttons that automatically generate the corresponding code challenge rather than having the required prompt. This eleminates an entire step and makes the bot more seemless and user-friendly.

## Dependencies

discord.js
openai

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.





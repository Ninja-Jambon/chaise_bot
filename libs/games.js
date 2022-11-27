function rockPaperScissorsAgainstBot(ctx, bot) {
  // Variables
  var userChoice;
  var computerChoice;
  const CHOICES = ["rock", "paper", "scissors"];

  // Computer choice

  computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];

  // User choice

  bot.telegram.sendMessage(ctx.chat.id, "Choose between rock, paper or scissors", {});
  


  //Display choices
  bot.telegram.sendMessage(ctx.chat.id, "You chose " + userChoice + ". The bot chose " + computerChoice + ".");

  // Winner
  switch (userChoice) {
    case "rock":
      if (computerChoice == "rock") {
        ctx.reply("It's a tie");
      } else if (computerChoice == "paper") {
        ctx.reply("You lose");
      } else {
        ctx.reply("You win");
      }
      break;
    case "paper":
      if (computerChoice == "rock") {
        ctx.reply("You win");
      } else if (computerChoice == "paper") {
        ctx.reply("It's a tie");
      } else {
        ctx.reply("You lose");
      }
      break;
    case "scissors":
      if (computerChoice == "rock") {
        ctx.reply("You lose");
      } else if (computerChoice == "paper") {
        ctx.reply("You win");
      } else {
        ctx.reply("It's a tie");
      }
      break;
  }
}
function rockPaperScissorsAgainstBot(userChoice, ctx, bot) {
  const choices = ["rock", "paper", "scissors"];

  if (choices.includes(userChoice) == true) 
  {
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    bot.telegram.sendMessage(ctx.chat.id, "You chose " + userChoice + " and I chose " + botChoice, {})

    //wait 50ms
    setTimeout(function() {
      if (userChoice == botChoice) 
      {
        bot.telegram.sendMessage(ctx.chat.id, "It's a tie!", {});
      } 
      else if (userChoice == "rock") 
      {
        if (botChoice == "paper") 
        {
          bot.telegram.sendMessage(ctx.chat.id, "You lose! Paper beats rock.", {});
        } 
        else 
        {
          bot.telegram.sendMessage(ctx.chat.id, "You win! Rock beats scissors.", {});
        }
      } 
      else if (userChoice == "paper") 
      {
        if (botChoice == "scissors") 
        {
          bot.telegram.sendMessage(ctx.chat.id, "You lose! Scissors beats paper.", {});
        } 
        else 
        {
          bot.telegram.sendMessage(ctx.chat.id, "You win! Paper beats rock.", {});
        }
      } 
      else if (userChoice == "scissors") 
      {
        if (botChoice == "rock") 
        {
          bot.telegram.sendMessage(ctx.chat.id, "You lose! Rock beats scissors.", {});
        } 
        else 
        {
          bot.telegram.sendMessage(ctx.chat.id, "You win! Scissors beats paper.", {});
        }
      }
    }, 50);
  } else 
  {
    bot.telegram.sendMessage(ctx.chat.id, "Please choose between rock, paper and scisors", {});
  }

}

module.exports = { rockPaperScissorsAgainstBot };
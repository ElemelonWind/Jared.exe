const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();

const prefix = 'j!';
const LEFT  = "([{<";
const RIGHT = ")]}>";
const operators = "+-*/%^!";
const accepted = LEFT + RIGHT + operators + "0123456789 ";
var array = new Array();

// fsLibrary.readFile('data.txt', (error, txtString) => {
 
//     if (error) throw err;
    
//     if(typeof txtString != 'undefined') {
//         var string = txtString.toString();
//         var curIndex = 0;
//         var curGuild = "";
//         while(string.length > 0) {
//             curIndex = string.indexOf(',');
//             curGuild = string.substring(1, curIndex);
//             string = string.substring(curIndex + 1);
//             curIndex = curGuild.indexOf('|');
//             var brah = new Storage(parse(curGuild.substring(0, curIndex)));
//             curGuild = curGuild.substring(curIndex + 1);
//             curIndex = curGuild.indexOf('|');
//             brah.setCur(parse(curGuild.substring(0, curIndex)));
//             curGuild = curGuild.substring(curIndex + 1);
//             curIndex = curGuild.indexOf('|');
//             if(curGuild.substring(0, curIndex) != 'null') {
//                 brah.setChannel(parse(curGuild.substring(0, curIndex)));
//             } 
//             curGuild = curGuild.substring(curIndex + 1);
//             curIndex = curGuild.indexOf('|');
//             brah.setRecord(parse(curGuild.substring(0, curIndex)));
//             curGuild = curGuild.substring(curIndex + 1);
//             curIndex = curGuild.indexOf('|');
//             if(curGuild.substring(0, curIndex) != 'null') {
//                 brah.setLast(parse(curGuild.substring(0, curIndex)));
//             }
//             array.push(brah);
//         }
//     }
// })

client.commands = new Discord.Collection();

client.once('ready', () => {
    console.log('Jared is online!');
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'j!help',
            type: 'PLAYING'
        }
    })
    client.guilds.cache.forEach(guild => {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#6d28f1')
        .setDescription('Hello! Jared has just restarted. Please reset the channel.');
        
        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
        channel.send(newEmbed);
        
        // let channelID;
        // let channels = guild.channels.cache;

        // for (let key in channels) {
        //     let c = channels[key];
        //     let permarray = c.permissionsFor(client.user).toArray();
        //     if (c.type === "text" && permarray.includes('SEND_MESSAGES')) {
        //         channelID = c.id;
        //         break;
        //     }
        // }

        // let channel = channels.get(guild.systemChannelID || channelID);
        // if(typeof channel != 'undefined') {
        //     channel.send(newEmbed);
        //     console.log('restart sent in ' + guild + ' in ' + channel);
        // }
        // else {
        //     console.log('restart unable to send in ' + guild);
        // }
    })
});

client.on('message', (message) => {
    var{ guild } = message;
    var index = findIndex(guild.id);
    if(index == array.length) {
        array.push(new Storage(guild.id)) - 1;
    }
    var theChannel = array[index].getChannel();
    
    if(message.content.startsWith(prefix) && !message.author.bot) {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        
        if(command == 'help') {
            const newEmbed = new Discord.MessageEmbed()
            .setColor('#6d28f1')
            .setTitle('Jared Help Center')
            .setDescription('Prefix: j!')
            .addFields(
                {name: 'setchannel', value: 'sets the channel the game will be played in.'},
                {name: 'record', value: 'returns your record count for the day.'},
                {name: 'channel', value: 'returns the current game channel.'},
                {name: 'How to Play', value: 'You can use any functions as long as the end product equals the '
                + 'next number. Do not count twice in a row. You must include a space between each number and operator. Do not mess it up!'},
                {name: 'Valid Operators', value: '+ - * / % ! ^ () [] {} <>'}
            )
            .setFooter(`Note: Hi! I am a noob developer who has not learned how to use databases yet. If I am debugging, the variables will suddenly reset, in addition to the bot restarting once a day. I apologize for any inconvenience but I hope you enjoy the bot with all of its flaws <3`)
            .setThumbnail('https://images.pexels.com/photos/50577/hedgehog-animal-baby-cute-50577.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500');
        
            message.channel.send(newEmbed);
        }

        if(command == 'setchannel') {
            if(message.channel.isText) {
                channel = message.channel;
                var index = findIndex(guild.id);
                if(index == array.length) {
                    array.push(new Storage(guild.id)) - 1;
                }
                array[index].setChannel(channel);
                const newEmbed = new Discord.MessageEmbed()
                .setColor('#07c0e3')     
                .setDescription('Game channel set to ' + channel.toString());

                message.channel.send(newEmbed);
            }

            else {
                message.channel.send('Channel not valid.');
            }
        }

        if(command == 'record') {
            var index = findIndex(guild.id);
            if(index == array.length) {
                array.push(new Storage(guild.id)) - 1;
            }
            const newEmbed = new Discord.MessageEmbed()
            .setColor('#f2f954')
            .setDescription('Your daily record is `' + array[index].getRecord() + '`.');

            message.channel.send(newEmbed);
        }

        if(command == 'channel') {
            var newEmbed;
            var index = findIndex(guild.id);
            if(index == array.length) {
                array.push(new Storage(guild.id)) - 1;
            }
            if(typeof array[index].getChannel() == 'undefined')    
                newEmbed = new Discord.MessageEmbed()
                .setColor('#fc8ed7')
                .setDescription('There is no set game channel.');
            else {
                newEmbed = new Discord.MessageEmbed()
                .setColor('#fc8ed7')
                .setDescription('Game channel is ' + array[index].getChannel().toString());
            }
            
            message.channel.send(newEmbed);
        }
    }
    else if(message.channel.equals(theChannel) && checkOK(message.toString()) && !message.author.bot) {
        const nums1 = message.content.split(/ +/);
        const nums = message.toString();
        
        var cur = array[index].getCur();
        var lastUser = array[index].getLast();

        if(message.author == lastUser) {
            message.react('❌');
                const newEmbed = new Discord.MessageEmbed()
                .setColor('#96eeb9')
                .setDescription(message.author.toString() + ' ruined it at ' + cur + '! Do not count twice in a row!');

                message.channel.send(newEmbed);

                array[index].reset();
        }
        
        else if(nums1.length == 1) {
            if(parseInt(nums1[0]) == cur) {
                message.react('✔️');
                array[index].setLast(message.author);
                array[index].addCur();
            }
            else {
                message.react('❌');
                const newEmbed = new Discord.MessageEmbed()
                .setColor('#96eeb9')
                .setDescription(message.author.toString() + ' ruined it at ' + cur + '! Wrong number or formatting.');

                message.channel.send(newEmbed);

                array[index].reset();
            }
        }
        
        else {
            if(infixToPostfix(nums) == "ERROR") {
                message.react('❌');
                const newEmbed = new Discord.MessageEmbed()
                .setColor('#96eeb9')
                .setDescription(message.author.toString() + ' ruined it at ' + cur + '! Error.');

                message.channel.send(newEmbed);

                array[index].reset();
            }
            else if(parseInt(eval(infixToPostfix(nums))) != cur) {
                message.react('❌');
                const newEmbed = new Discord.MessageEmbed()
                .setColor('#96eeb9')
                .setDescription(message.author.toString() + ' ruined it at ' + cur + '! Wrong number or formatting.');

                message.channel.send(newEmbed);

                array[index].reset();
            }
            else {
                message.react('✔️');
                array[index].setLast(message.author);
                array[index].addCur();
            }
        }
    }
    // // Data which will need to add in a file. 
    // let data = array.toString();
  
    // // Write data in 'data.txt' . 
    // fsLibrary.writeFile('data.txt', data, (error) => { 
        
    //     // In case of a error throw err exception. 
    //     if (error) throw err; 
    // }) 
})
//}

//const token = fs.readFileSync("token.txt").toString().trim();
const token = secret.TOKEN
client.login(token);

function findIndex(guildId) {
    //console.log(guildId.toString());
    var index = 0;
    while(array.length > index && array[index].getId() != guildId) {
        index++;
    }
    //console.log(index);
    /*if(index < array.length)*/ return index;
    //return -1;
}

function checkOK(exp) {
    if(exp.length == 0) return false;
    for(var x = 0; x < exp.length; x++) {
       if(!accepted.includes("" + exp.charAt(x))) {
          return false;
       }
    }
    return true;
 }

 //returns the index of the left parentheses or -1 if is not
function isLeftParen(p)
 {
    return LEFT.indexOf(p);
 }

 //returns the index of the right parentheses or -1 if is not
 function isRightParen(p)
 {
    return RIGHT.indexOf(p);
 }
 
 function checkParen(exp)
 {
    var array = exp.split(/ +/);
    var stack = new Stack();
    for(var x = 0; x < array.length; x++) {
       if(isLeftParen(array[x]) != -1) {
          stack.push(isLeftParen(array[x]));
       }
       else if(isRightParen(array[x]) != -1) {
          if(stack.isEmpty()) {
             return false;
          }
          if(stack.pop() != isRightParen(array[x])) {
             return false;
          }
       }
    }
    if(stack.size() != 0) {
       return false;
    }
    return true;
 }

 function eval(pf)
   {
      var postfixParts = pf.split(/ +/);
      var postfixEval = new Stack();
      var count = 0;
      while(count < postfixParts.length - 1) {
         while(!isOperator(postfixParts[count])) {
            postfixEval.push(parseInt(postfixParts[count]));
            count++;
         }
         if(postfixParts[count] == "!") {
            var product = postfixEval.pop();
            for(var x = product-1; x > 0; x--) {
               product*=x;
            }
            postfixEval.push(product);
         }
         else {
            postfixEval.push(eval1(postfixEval.pop(), postfixEval.pop(), postfixParts[count]));
         }
         count++;
      }
      return postfixEval.pop();
   }
   
   function eval1(a, b, ch)
   {
      switch(ch.charAt(0)) {
         case '+':
         return a + b;
         case '-':
         return b - a;
         case '*':
         return a * b;
         case '/':
         return b/a;
         case '%':
         return b%a;
         case '^':
         return Math.pow(b, a);
         default:
         return -1;
      }
   }
   
   function isOperator(op)
   {
      return operators.includes(op);
   }

   function infixToPostfix(infix)
   {
      if(!checkOK(infix) || !checkParen(infix)) return "ERROR";
      var nums = infix.split(/ +/);
      var ops = new Stack();
      var postfix = "";
      var count = 0;
      while(count < nums.length) {
         if(LEFT.includes(nums[count])) {
            ops.push(nums[count]);
         }
         else if(RIGHT.includes(nums[count])) {
            while(!LEFT.includes(ops.peek())) {
               postfix += ops.pop() + " ";
            }
            ops.pop();
         }
         else if(operators.includes(nums[count])) {
            while(!ops.isEmpty() && !isLower(ops.peek().charAt(0), nums[count].charAt(0))) {
               postfix += ops.pop() + " ";
            }
            ops.push(nums[count]);
         }
         else {
            postfix += nums[count] + " ";
         }
         count++;
      }
      while(!ops.isEmpty()) {
         postfix += ops.pop() + " ";
      }
      return postfix;
   }
   
   //returns true if c1 has strictly lower precedence than c2
   function isLower(c1, c2)
   {
      return precedence(c1) < precedence(c2);
   }
   
   function precedence(op) {
      switch (op) {
         case '+':
            return 0;
         case '-':
            return 0;
         case '*':
            return 1;
         case '/':
            return 1;
         case '%':
            return 1;
         case '^':
            return 2;
         case '!':
            return 2;
         default: 
            return -1;
      }
   }

 class Storage {
     constructor(guildId) {
         this.id = guildId;
         this.cur = 1;
         this.channel;
         this.record = 0;
         this.lastUser;
     }
     getId() {
         return this.id;
     }
     getCur() {
         return this.cur;
     }
     reset() {
         this.cur = 1;
         this.lastUser = null;
     }
     addCur() {
        if(this.cur > this.record)
            this.record = this.cur; 
        this.cur += 1;   
     }
     setCur(num) {
        this.cur = num;
     }
     setRecord(num) {
         this.record = num;
     }
     setChannel(channelId) {
         this.channel = channelId;
     }
     getChannel() {
         return this.channel;
     }
     getRecord() {
         return this.record;
     }
     getLast() {
         return this.lastUser;
     }
     setLast(user) {
         this.lastUser = user;
     }
    //  toString() {
    //      var string = "";
    //      string += this.id.toString() + "|";
    //      string += this.cur.toString() + "|";
    //      if(typeof this.channel == 'undefined') string += "null" + "|";
    //      else string += this.channel.toString() + "|";
    //      string += this.record.toString() + "|";
    //      if(typeof this.lastUser == 'undefined') string += "null" + "|";
    //      else string += this.lastUser.toString() + "|";
    //      return string + "|";
    //  }
 }
 class Stack {
    constructor(){
        this.data = [];
        this.top = 0;
    }
    push(element) {
      this.data[this.top] = element;
      this.top = this.top + 1;
    }
   size() {
      return this.top;
   }
   peek() {
      return this.data[this.top-1];
   }
   isEmpty() {
     return this.top === 0;
   }
   pop() {
    if( this.isEmpty() === false ) {
       this.top = this.top -1;
       return this.data.pop(); // removes the last element
     }
   }
   print() {
      var top = this.top - 1; // because top points to index where new element to be inserted
      while(top >= 0) { // print upto 0th index
           top--;
       }
    }
    reverse() {
       this._reverse(this.top - 1 );
    }
    _reverse(index) {
       if(index != 0) {
          this._reverse(index-1);
       }
    }
}

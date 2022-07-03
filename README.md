# rustgambling
Website will look like rustfunpot.com

Everything works fine but you will have to follow some steps:
1. Go to server.js line 14-16 and add the username/password/shared_secret of your bot.
shared_secret can be found in here https://www.youtube.com/watch?v=JjdOJVSZ9Mo. Dont share it.
Line 37-40 mysql information. 56-58 your web server/localhost, and steam api https://danbeyer.github.io/steamapi/page1.html.

2. Go to bots/index.js line 39 identity_secret will be found in the same file as the shared_secret. 
3. Go to mail.js make a mailgun account add the api key and domain youtube video exist in the file. Change "to" 
to your own email you want to recieve the support emails.

4. npm install in the cmd prompt to install the essential node packages.

5. Now you should be ready to launch the website!

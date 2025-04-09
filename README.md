<h1>Million Show Api</h1>
<h2>An API documented to help frontend developers</h2>
<hr />

<h1>Why?</h1>
<p>This API has everything documented and use <strong>swagger</strong> to help undertand and create the anything else</p>
<p>You're free to clone an use it to build your own frontend, but you must give the credits explicit on the website/app. Use <strong>Victor Spichenkoff</strong></p>

<h1>Game</h1>
<ul>
  <li>It's a game with 16 question, the last one worth 1 million</li>
  <li>Player has some helps, such as universitaries option and skip</li>
  <li>At any moment, thre's the option to stop and ensure a minimum prize</li>
</ul>

<h1>Structure</h1>
<p>almost everything about a match is made using the <strong>match</strong> controller</p>
<ul>
  <li>/match/start -> initialize. It will block if player has not finished other match</li>
  <li>/match/next -> give the next question</li>
  <li>/match/asnwer/{index} -> used to asnwer a question</li>
  <li>/match/current/question -> give back the current question</li>
</ul>
<p>It also has a historic system</p>

<h1>Key features</h1>
<ul>
  <li>The help <strong>universitaries</strong> has a 13% chance of fail, and a 2% of fail extremely</li>
  <li>Run <code>yarn seed</code> to seed the db with over 200 question</li>
</ul>
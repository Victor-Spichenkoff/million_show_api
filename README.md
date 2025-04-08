<h1>Millio Show Api</h1>
<h2>An API documented to help frontend developers</h2>
<hr />

<h1>Game</h1>
<ul>
  <li>It's a game with 16 question, the last one worth 1 million</li>
  <li>Player has some helps, such as universitaries and skip</li>
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
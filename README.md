<h1>Tempo Music Player</h1>
<h4>Live: https://tempo-music-player.web.app/</h4>

<p><b>Tempo</b> is a web-based music player that enables users to create collections of music (akin to playlists) and listen to them according to a BPM that they have selected.</p>

<h2>Key features</h2>
<ul>
  <li>Plays music based on a BPM that has been selected</li>
  <li>Always in shuffle mode</li>
  <li>Fully responsive and has specific designs for both desktop and mobile devices</li>
  <li>Keeps track of play queue so playback can be resumed across several devices</li>
  <li>Prevents playing the same song twice within a listening session</li>
  <li>Ability for users to create and share collections with each other</li>
</ul>

<h2>Technologies and frameworks used</h2>
<ul>
  <li>Javascript</li>
  <li>React lifecycle and hook components both used for dynamically loading data into pages</li>
  <li>Local data managed by Redux</li>
  <li>PostgreSQL relational database on Heroku</li>
  <li>Express API routes for db calls with Sequelize (allows making PostgresSQL queries in Javascript)</li>
  <li>Amazon S3 for file hosting</li>
  <li>Firebase for static file hosting and Firebase cloud functions for running Express routes</li>
  <li>Passport for user authentication and authorization</li>
  <li>HTML Audio</li>
  <li>Several MUI components, such as sliders, buttons and icons</li>
  <li>Modals for rendering useful messages and prompts</li>
</ul>

<h2>Feature explanations</h2>

<p>Playback is always in shuffle mode, and songs are selected only near the current BPM. For example, if a BPM of 120 is chosen, music will only be played within the range of 118-123 BPM (2 BPM slower, 3 BPM faster). If there is no more music at 120, Tempo will search for songs slightly faster, and will increment by 1, moving the search range up to 124. Tempo will only do this up to 3 BPM faster, ensuring that two consecutive songs aren't played in completely different BPM ranges. Tempo speeds up based on the <b>BPM that it's playing at</b>, as opposed to being based on the song that it's playing. For example, Tempo may be playing at 132 BPM and be playing a song that is 135 BPM (because that is within the range), but Tempo will not suddenly play a song that is at 139 (which would be within the range of 136 if 135 were incremented by 1). 139 is significantly faster than 132. However, Tempo may gradually increase to 133 BPM in order to reach a song at 136 BPM, then from there, increment by 1 to 134 to reach a song at 137, and eventually reach a song at 139 BPM in this manner.</p>

<p><b>Tempo</b> also keeps track of the songs that have been listened to, ensuring that the same song is not played twice across various collections throughout a listening session. For example, if Song A is in both Collection A and Collection B, and a user starts listening to Collection A then listens to Song A, then they switch to Collection B, Song A will not be played while they're listening to Collection B. Songs in the collection song list will also be greyed out to indicate that they have already been listened to. The play history can be reset by using the circular Reset button in the top right, which will make all songs available for playback again.
  
<p>This is all done to ensure a fresh listening experience each time.</p>

<h2>How did the idea of <b>Tempo</b> come about?</h2>
<p>I have many playlists that I enjoy listening to. But I don't always want to listen to them in the same order each time. So why not put the playlists in shuffle mode? The problem with that is I may have several songs in completely different BPM ranges from one another in the same playlist. Or I may listen to a song that is slow, then a song that's faster, then a song that's slower again (which would be an unpleasant listening experience for me). So the solution to that would be to create several playlists; one playlist for fast music, another for medium tempo music, and another for slower music. But that requires too much maintenance. <b>Tempo</b> provides a way for me to simply put all of my music into several buckets (one for the beach, one for working out, one for brainstorming) then interact with them in an organic way. All I have to do is select a collection, then choose a tempo.
  
<h2>How does <b>Tempo</b> work under the hood?</h2>
<h3>Front-end</h3>
  <p>The main challenge of creating <b>Tempo</b> was in figuring out a way to dynamically and <b>efficiently</b> play songs at different BPMs at the drop of a hat. Also, creating the database schema which would allow for me to retrieve my play history specific to each collection I have. A naive solution could be simply: Load up all of the songs in a given collection, put them into an array, sort them by BPM, then select a BPM. Now loop over all of the songs until you find the BPM, and play that song. That works. But now how do I ensure that the songs at the selected BPM will be played in a shuffled manner? If I have 5 songs at the BPM of 130, how do I ensure that those songs will be selected and played in shuffled order? One way possibly might be to index the array in such a way that different BPMs could be grouped together, then to select a random index within that BPM range. In retrospect, I could see a complex implementation of that actually being extremely efficient. But the solution I ended up going with was to create 1 map and 2 arrays of songs.</p>
  <ul>
    <li>Map (collectionSongs): Have all of the songs from a specific collection in this map, first sorted by BPM.</li>
    <li>Array 1 (songsInRange): After a BPM is selected, loop over the map and add all of the songs within the BPM range to this array. Exit the loop the moment a song exceeds the range of the selected BPM. Now shuffle songsInRange using Fisher Yates' shuffle algorithm.</li>
    <li>Array 2 (playQueue): Have a running playqueue, which will use songs from Array 2 by popping them off one by one as more songs are played. songsInRange is already in shuffled order, so we can pop songs freely and the songs that are retrieved will still be shuffled order.</li>
 </ul>
 
 <p>By popping songs off of songsInRange one by one and adding them to playQueue, it allows me to easily switch BPMs and preserve the play-history within the collection that I'm playing from. Now if I change the BPM to something else, I simply clear songsInRange, then loop over collectionSongs while adding the songs within the selected BPM range to songsInRange. Then I can just pop songs off of songsInRange and the songs will be within the newly selected BPM range.
  
 <p>One more thing, I also want to ensure that the same song isn't played twice within a listening session. This part is easy. I just keep an additional map (listened) and add a song's ID to it when it's played, so when I'm looping over collectionSongs to add songs into songsInRange, I also check if the songId exists in listened already. If the songId exists in listened, I skip over it instead of adding it to songsInRange.<p>
   
<p>Now I have a system which allows me to play songs in a shuffled order, by BPM, and also keeps track of the play history. When songs are played, I add it to a collectionSession db model, which pertains to the session involving the collection, and of the user of who the session belongs to. Now when I choose another collection and play music from there, then come back to the original collection, all I have to do is query the songs from my collectionSession by creation date descending order, and that will give me the play history with my most recently played song at the end of the array, allowing me to resume playback exactly where I left off. I also keep track of a playIdx variable locally and in the db to remember my spot in the playQueue.</p>

<h3>Back-end (specifically DB schema)</h3>
<p>Models will be capitalized for clarity.</p>
<p>Regarding the db schema, first, there are a bunch of Users. These Users have Collections. The Collections have CollectionSessions, which represent active listening sessions that Users may have that they can resume at any time. These CollectionSessions contain SessionSongs, which are the record of Songs having been listened to within each session. CollectionSessions allow 2 or more Users to have the same Collection, and listen to it at the same time independent of one another. Users also have Listened(s), which contain ListenedSongs, which is the record of a User having listened to a Song (to retrieve their Listened to compare new Song(s) while changing BPMs). Lastly, Collections have many Songs. There are several more associations involving these models but these are the core relationships.</p>

<h2>Contributions</h2>
<p>Feel free to reach out to me at Alex@Alexbarthglobal.com if you have any suggestions or contributions you would like to make.</p>

<h2>Music Licensing</h2>
<p>The license for all music on Tempo has been obtained from https://artlist.io/

"use client";

import styles from "../../styles/help.module.css";

export default function HelpPage() {
  return (
    <div className={styles.helpContainer}>
      <div className={styles.recommandationContainer}>
        <h1>How to Get a Movie Recommendation</h1>
        <ol>
          <li>
            <h2>Choose Your Categories</h2>
            <p>
              Start by selecting one or more categories that match the kind of
              movie you’re in the mood for.
            </p>
          </li>
          <li>
            <h2>Select Similar Movies</h2>
            <p>
              Next, choose movies you’ve already seen that are similar to what
              you want to watch now. The more accurate your selections are, the
              better the recommendation will be. These movies help us understand
              your taste and style.
            </p>
          </li>
          <li>
            <h2>Get Your Recommendation</h2>
            <p>
              That’s it! Once you’re ready, generate your recommendation and
              discover a movie tailored just for you.
            </p>
          </li>
        </ol>
        <p>Sit back, relax, and enjoy your next watch 🍿</p>
      </div>
      <div className={styles.playlistContainer}>
        <h1>Keep Track of Your Movies</h1>
        <p>
          Want to keep track of everything you watch (and what you want to watch
          next)? You can save movies in two playlists: Watched and Watch Later.
        </p>
        <ol>
          <li>
            <h2>Search for a Movie</h2>
            <p>
              Use the search bar at the very top right corner of your screen to
              look for a movie you want to add.
            </p>
          </li>
          <li>
            <h2>Add it to a Playlist</h2>
            <p>Once you find your movie, choose where it belongs:</p>

            <ul className={styles.playlistBullets}>
              <li>
                <strong>Watched</strong> → for movies you’ve already seen
              </li>
              <li>
                <strong>Watch Later</strong> → for movies you plan to watch soon
              </li>
            </ul>
          </li>
        </ol>
        <p>
          That’s it ! your playlists will stay updated so you always know what
          you’ve watched and what’s next 🎬🍿
        </p>
      </div>
    </div>
  );
}

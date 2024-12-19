import React from "react";
import { FriendsList } from "./FriendsList";
import { NavBar } from "../NavBar";
import styles from './Friends.module.css';

export const Friends = () => {

  return (
    <>
          <div className="container">
            <title>Amigos - TailTales</title>
    
                <NavBar/>
    
                <section id="friends-feed" className={styles.friendsFeed}>
                    <h2 className={styles.titleFriends}>Amistades</h2>
                    <div id="friends-container" className={styles.friendsContainer}>
                    <FriendsList />
                    </div>
                </section>
          </div>
        </>
  );
};



import React from "react";
import { NotificationsList } from "./NotificationsList";
import { NavBar } from "../NavBar";
import styles from './Notifications.module.css';


export const Notifications = () => {
  return (
    <>
      <div className="container">
        <title>Notificaciones - TailTales</title>

            <NavBar/>

            <section id="notifications-feed" className={styles.notificationsFeed}>
                <h2 className={styles.titleNotifications}>Notificaciones</h2>
                <div id="notifications-container" className={styles.notificationsContainer}>
                <NotificationsList />
                </div>
            </section>
      </div>
    </>
  );
};

import styles from "./index.module.css";

import { motion } from "framer-motion";

export const Card = ({ title, status, link }: { title: string; status: string; link: string }) => {
    return (
        <motion.div
            className={styles.wrapper}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
        >
            <div
                className={styles.circle}
                style={{
                    borderColor: `${
                        status === "draft"
                            ? "gold"
                            : status === "rejected"
                            ? "tomato"
                            : "limegreen"
                    }`,
                }}
            ></div>
            <h3 className={styles.title}><a href={link} >{title}</a></h3>
        </motion.div>
    );
};
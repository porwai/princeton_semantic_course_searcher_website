import styles from "./index.module.css";
import React from 'react';
import {useCollapse} from 'react-collapsed';

import { motion } from "framer-motion";

export const Card = ({ jobpost, title, status, link }: { jobpost:string; title: string; status: string; link: string }) => {
    const config = {
        duration: 2000
    };
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(config);

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
                }
            }
            ></div>
            <h3 className={styles.title} {...getToggleProps()}><a href={link} >{title}</a></h3>
            <div className={styles.expanded} {...getCollapseProps()}>
            <h3 className="content">
                Now you can see the hidden content. <br/><br/>
                Click again to hide...
            </h3>
            </div>
        </motion.div>
    );
};
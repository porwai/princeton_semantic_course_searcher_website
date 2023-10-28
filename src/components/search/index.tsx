import { KeyboardEvent } from "react";
import styles from "./index.module.css";


export const Search = ({
   //onChange, onKeyUp
   onKeyUp
}: {
    //onChange: React.ChangeEventHandler;
    onKeyUp: React.KeyboardEventHandler;
}) => {

    /*
    const handleKeyDown = (event : KeyboardEvent) => {
        if (event.key === 'Enter') {
            return true;
          }      
    }
    */

    return (
        <input
            className={styles.search}
            type="text"
            //onChange={onChange}
            onKeyUp={onKeyUp}
            placeholder="Search Princeton Courses By the Power of Semantic Search (Click Courses to see details)"
        />
    );
};
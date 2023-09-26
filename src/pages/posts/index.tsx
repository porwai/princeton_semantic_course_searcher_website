import React, { HTMLInputTypeAttribute, useState, useEffect, useContext } from "react";
import { useMany } from "@refinedev/core";
import { motion, AnimatePresence } from "framer-motion";

import { Filter } from "../../components/filter";
import { Search } from "../../components/search";
import { Card } from "../../components/card";

import styles from "./index.module.css";

const dataContext = React.createContext({
    activeFilter: [], fetchFilter: () => {}
})

export const Posts = () => {
    const [inputValue, setInputValue] = useState("");
    //const [inputSearch, setInputSearch] = useContext(dataContext);
    const [activeFilter, setActiveFilter] = useState([]);
    //const [search, setSearch] = useState("");

    const fetchFilter = async () => {
        const response = await fetch("http://localhost:8000/courses");

        const file = await response.json();
        const file2 = JSON.parse(file.data);
        setActiveFilter(file2);
    }

    /// This is the 
    
    const updateSearch = async (input_search: string) => {
        const response1 = await fetch('http://localhost:8000/ask', {
            method: "POST", 
            headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({"question": input_search})
        })
        console.log(response1);
        const file3 = await response1.json();
        const file4 = JSON.parse(file3.searched);
        setActiveFilter(file4);
    }
    
    
    useEffect(() => {
        fetchFilter()
      }, [])

    useEffect(() => {
        updateSearch(inputValue);
    }, [inputValue])

    // Old Code for obtaining jobposting data
    const posts = useMany<{
        id: number;
        title: string;
        status: string;
        slug: string;
    }>({
        resource: "posts",
        ids: Array.from(Array(8).keys()).slice(1),
    }).data?.data;
    // Working on progress to create filters for distribution requirements
    const filters: string[] = ["published", "draft", "rejected"];
    
    
    console.log(activeFilter);
    console.log(typeof(activeFilter))
    

    /// Main function and body
    return (
        <motion.div>
            {/*
            <div className={styles.filters}>
                {filters.map((filter, index) => {
                    return (
                        <Filter
                            key={index}
                            title={filter}
                            isActive={filter === activeFilter}
                            onClick={(e: React.MouseEvent) => {
                                const el = e.target as HTMLElement;
                                el.textContent?.toLowerCase() !== activeFilter
                                    ? setActiveFilter(filter)
                                    : setActiveFilter("");
                            }}
                        />
                    );
                })}
            </div>
            */}
            <Search
                    /*
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (search === "true") {
                            setInputValue(e.target.value);
                            console.log(inputValue);
                            setSearch("false")
                        }
                    }}
                    */
                    
                    onKeyUp = {(ek: React.KeyboardEvent<HTMLInputElement>) => {
                        if (ek.key === 'Enter') {
                            setInputValue((ek.target as HTMLInputElement).value);
                        } 
                    }}
                    
                    //onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    //setInputValue(e.target.value);}}
            />
            <AnimatePresence>
                {activeFilter
                    .map(
                        (
                            post: { Title: string; status: string ; year:string, jobpost:string}
                        ) => {
                            return (
                                <Card
                                    key={post.jobpost}
                                    title={post.Title}
                                    link={post.year}
                                    status={post.status}
                                />
                            );
                        },
                    )}
            </AnimatePresence>
        </motion.div>
    );
};
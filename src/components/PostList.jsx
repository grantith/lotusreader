import React, { useEffect, useState } from 'react';
import PostCard from './PostCard'
import { useLocation } from 'react-router-dom';
function PostList({ news, page, setPage, setClicked, type }) {
    const [loadText, setLoadText] = useState("Load More");
    let location = useLocation();

    function handleClick() {
        setPage(page => page + 1);
        setLoadText("Loading...");
    }
    useEffect(() => {
        setLoadText("Load More")
    }, [news])

    if (news) {
        return (
            <div className='postlist md:w-2/3 md:m-auto w-full pt-5 flex flex-col' id='scrollbar1'>
                {news.map(item => <PostCard item={item} location={location} setClicked={setClicked} />)}
                <div className='flex w-full gap-3 mb-3'>
                    {(type !== "active") && <div onClick={() => handleClick()} className="w-5/6  hover:cursor-pointer py-4 mt-4 bg-blue-900 text-white text-center">{loadText}</div>}
                    {(type !== "active") && <div onClick={() => window.scrollTo(0, 0)} className="w-1/3 hover:cursor-pointer py-4 mt-4 bg-blue-900 text-white text-center">Scroll to Top</div>}
                </div>
            </div>
        )
    } else {
        return <div>Something went wrong!</div>
    }
}
export default PostList

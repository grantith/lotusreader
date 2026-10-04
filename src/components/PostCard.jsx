import React, { useEffect, useState } from 'react'
import { FaArrowCircleUp, FaComments, FaRegClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { BsBoxArrowInUpRight } from 'react-icons/bs'
import { isEntryRead } from '../utils/readEntries'

const domainLinkClass = {
    mobile: 'app-domain mb-2 flex w-full items-center justify-between gap-2 rounded-lg bg-blue-900 p-2 text-sm font-semibold text-white md:hidden',
    desktop: 'app-domain hidden shrink-0 items-center gap-1 text-sm font-semibold md:flex md:text-blue-900 md:hover:underline',
};

function DomainLink({ item, className }) {
    return (
        <a className={className} href={item.url} target='_blank' rel='noopener noreferrer'>
            <span className='min-w-0 truncate'>{item.domain}</span>
            <BsBoxArrowInUpRight className='shrink-0' />
        </a>
    );
}

function PostCard({ item }) {
    const [read, setRead] = useState(() => isEntryRead(item.id));

    useEffect(() => {
        const refreshReadState = () => setRead(isEntryRead(item.id));
        window.addEventListener('lotus-read-entry', refreshReadState);
        window.addEventListener('storage', refreshReadState);
        return () => {
            window.removeEventListener('lotus-read-entry', refreshReadState);
            window.removeEventListener('storage', refreshReadState);
        };
    }, [item.id]);


    return (
        <div className='app-post-card flex flex-col hover:bg-blue-50 border border-t-0 border-b-1 border-r-1 border-gray-700 px-3 md:flex-row md:items-center md:gap-3'>
            <div className={`min-w-0 flex-1 py-2 ${read ? 'read-entry' : ''}`}>
                <Link to={`/item/${item.id}`} className='block hover:cursor-pointer'>
                    <div className='w-full'>
                        <div className='post-info flex w-full items-center'>
                            <span className='md:text-sm text-base md:p-2 font-bold mr-4 flex-1 w-max'><span className='hover:underline'>{item.user}</span></span>
                            {read && <span className='read-marker' aria-label='Read'>read</span>}
                        </div>
                        <div className='post-title md:text-lg text-2xl md:font-normal font-bold mb-2'>{item.title}</div>
                    </div>
                </Link>
                {(item.domain) && <DomainLink item={item} className={domainLinkClass.mobile} />}
                <div className='flex'>
                    <div className='flex items-center post-stat w-full '>
                        <span className='flex items-center text-base w-1/6'><FaArrowCircleUp className='mr-2 text-base' />{item.points ? item.points : '0'}</span>
                        <span className='flex items-center text-base w-1/6'><FaComments className='mr-2 text-base' />{item.comments_count ? item.comments_count : '0'}</span>
                        <span className='flex items-center text-base '><FaRegClock className='mr-2 text-base' />{item.time_ago}</span>
                    </div>
                </div>
            </div>
            {(item.domain) && <DomainLink item={item} className={domainLinkClass.desktop} />}
        </div>
    )
}

export default PostCard

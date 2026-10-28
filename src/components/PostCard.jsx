import React, { useEffect, useRef, useState } from 'react'
import { FaArrowCircleUp, FaComments, FaRegClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { BsBoxArrowInUpRight } from 'react-icons/bs'
import { isEntryRead, markEntryRead } from '../utils/readEntries'

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

const swipeThreshold = 72;
const swipeDirectionRatio = 1.2;

function PostCard({ item }) {
    const [read, setRead] = useState(() => isEntryRead(item.id));
    const swipeRef = useRef(null);
    const suppressClickRef = useRef(false);
    const [swipeOffset, setSwipeOffset] = useState(0);

    function handlePointerDown(event) {
        suppressClickRef.current = false;
        if (read || event.pointerType === 'mouse' || !event.isPrimary ||
            event.target.closest('.app-domain')) {
            return;
        }
        swipeRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            cancelled: false,
        };
    }

    function handlePointerMove(event) {
        const gesture = swipeRef.current;
        if (!gesture || gesture.pointerId !== event.pointerId || gesture.cancelled) return;
        const dx = event.clientX - gesture.startX;
        const dy = Math.abs(event.clientY - gesture.startY);
        if (dy > Math.abs(dx) && dy > 8) {
            gesture.cancelled = true;
            setSwipeOffset(0);
            return;
        }
        if (dx > 0 && dx > dy * swipeDirectionRatio) {
            setSwipeOffset(Math.min(dx, 112));
        }
    }

    function finishPointer(event) {
        const gesture = swipeRef.current;
        if (!gesture || gesture.pointerId !== event.pointerId) return;
        swipeRef.current = null;
        setSwipeOffset(0);
        const dx = event.clientX - gesture.startX;
        const dy = Math.abs(event.clientY - gesture.startY);
        if (!gesture.cancelled && dx >= swipeThreshold && dx > dy * swipeDirectionRatio) {
            suppressClickRef.current = true;
            event.preventDefault();
            markEntryRead(item.id);
        }
    }

    function cancelPointer(event) {
        if (swipeRef.current?.pointerId === event.pointerId) {
            swipeRef.current = null;
            setSwipeOffset(0);
        }
    }

    function handleClickCapture(event) {
        if (suppressClickRef.current && event.detail !== 0) {
            suppressClickRef.current = false;
            event.preventDefault();
            event.stopPropagation();
        }
    }

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
        <div className='relative overflow-hidden' onClickCapture={handleClickCapture}>
            {!read && <span className='swipe-read-hint' aria-hidden='true'>Mark read</span>}
            <div className='app-post-card swipe-read-card flex flex-col hover:bg-blue-50 border border-t-0 border-b-1 border-r-1 border-gray-700 px-3 md:flex-row md:items-center md:gap-3'
                style={swipeOffset ? { transform: `translateX(${swipeOffset}px)` } : undefined}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishPointer}
                onPointerCancel={cancelPointer}>
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
        </div>
    )
}

export default PostCard

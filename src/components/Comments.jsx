import React, { useRef, useState } from 'react'
import { BsReplyFill } from "react-icons/bs";
import { HiUser } from "react-icons/hi"
import { Link } from 'react-router-dom';
import { FiMinimize2, FiMaximize2 } from 'react-icons/fi'
import { RxDotFilled } from 'react-icons/rx'
import parse from 'html-react-parser';
import moment from 'moment/moment';

const swipeThreshold = 56;
const swipeDirectionRatio = 1.2;

function Comments({ comments, postAuthor }) {
    return (<Tree data={comments} postAuthor={postAuthor} />)
}

function Tree({ data, postAuthor }) {
    return (
        <div className='md:mb-3 mx-3'>
            {(data ?? []).map(rootNode => (
                // console.log(rootNode)
                (rootNode.author) && <TreeNode key={rootNode.id} id={rootNode.id} node={rootNode} indent={0} isRoot={true} parentId={null} parentName={null} postAuthor={postAuthor} />
            ))}
        </div>
    );
}

function TreeNode({ id, node, indent, isRoot, parentId, parentName, postAuthor }) {
    const commentRef = useRef();
    const swipeRef = useRef();
    const [collapsed, setCollapsed] = useState(false);
    const [hovering, setHovering] = useState(false);  // New hover state

    const visibleChildren = (node.children ?? []).filter(childNode => childNode.author);
    const hasChildren = visibleChildren.length > 0;

    function toggleChildren() {
        if (hasChildren) {
            setCollapsed(current => !current);
        }
    }

    function isInteractiveTarget(target) {
        return target && typeof target.closest === 'function' &&
            target.closest('a, button, input, textarea, select, [role="button"]');
    }

    function handlePointerDown(event) {
        if (!hasChildren || event.pointerType === 'mouse' || isInteractiveTarget(event.target)) {
            return;
        }

        const scrollable = event.target?.closest?.('[data-comment-scroll]');
        if (scrollable && scrollable.scrollWidth > scrollable.clientWidth) {
            return;
        }

        swipeRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            cancelled: false,
        };

        event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    function handlePointerMove(event) {
        const gesture = swipeRef.current;
        if (!gesture || gesture.pointerId !== event.pointerId) {
            return;
        }

        const deltaX = Math.abs(event.clientX - gesture.startX);
        const deltaY = Math.abs(event.clientY - gesture.startY);
        if (deltaY > deltaX && deltaY > 8) {
            gesture.cancelled = true;
        }
    }

    function releasePointerCapture(event) {
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    function finishPointer(event) {
        const gesture = swipeRef.current;
        if (!gesture || gesture.pointerId !== event.pointerId) {
            return;
        }

        swipeRef.current = undefined;
        releasePointerCapture(event);

        const deltaX = event.clientX - gesture.startX;
        const deltaY = Math.abs(event.clientY - gesture.startY);
        const horizontalSwipe = Math.abs(deltaX) >= swipeThreshold &&
            Math.abs(deltaX) > deltaY * swipeDirectionRatio;

        if (!gesture.cancelled && horizontalSwipe) {
            event.preventDefault();
            toggleChildren();
        }
    }

    function handlePointerCancel(event) {
        if (swipeRef.current?.pointerId === event.pointerId) {
            swipeRef.current = undefined;
            releasePointerCapture(event);
        }
    }

    // Set hovering state on mouse events
    const handleMouseOver = () => {
        setHovering(true);
    };

    const handleMouseOut = () => {
        setHovering(false);
    };

    return (
        <div
            className={(!isRoot) ? `app-comment comment-container comment-${id} inner-comment-shadow ml-3 border border-b-0 border-r-0 border-black hover:cursor-default ${collapsed ? 'is-collapsed bg-blue-200' : ''}`
                : `app-comment comment-container root-shadow comment-${id} border border-black mt-3 hover:cursor-default rounded-md ${collapsed ? 'is-collapsed bg-blue-200' : ''}`}
                id={`comment-${id}`}
            data-parent-id={`parent-${id}`}
            // ref={commentRef}
        >
            {(node.author && node.text) && (
                <div className='content comment-swipe-surface'
                ref={commentRef}  
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishPointer}
                onPointerCancel={handlePointerCancel}>
                    <div className='app-accent headers text-blue-900 md:text-xs text-sm font-bold w-full px-3 flex items-center my-3'>
                        <div className='flex flex-1 items-center'>
                            {(node.author === postAuthor) ? <><HiUser className='mr-1' /> {node.author}</> : node.author}
                            {(parentName) && <>
                                <BsReplyFill className='mx-1' />
                                <a className='hover:cursor-pointer hover:underline' href={`#comment-${parentId}`}>
                                    {(parentName === postAuthor) ? <><HiUser className='mr-1 inline' /> {parentName}</> : parentName}
                                </a>
                            </>}
                            <RxDotFilled className='mx-1' />
                            <span>{moment(node.created_at).fromNow()}</span>
                        </div>
                        <div className='flex relative -mt-6 -mr-1 scale-90'>
                            {hasChildren && (
                                <div className={`absolute right-0 md:text-sm text-gray-700 ${hovering ? "opacity-100" : "opacity-100 md:opacity-0"}`}>
                                    <button
                                        type='button'
                                        className='app-comment-control flex font-normal hover:cursor-pointer items-center border border-gray-800 py-1 px-2 rounded-full'
                                        aria-expanded={!collapsed}
                                        aria-controls={`replies-${id}`}
                                        aria-label={collapsed ? `Expand replies (${visibleChildren.length})` : 'Collapse replies'}
                                        onClick={toggleChildren}
                                    >
                                        {collapsed ? (
                                            <>
                                                <FiMaximize2 className='text-xl scale-75 mr-1' />
                                                {visibleChildren.length}
                                            </>
                                        ) : (
                                            <FiMinimize2 className='text-xl scale-75' />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <CommentText>{node.text}</CommentText>
                </div>
            )}
            <div id={`replies-${id}`} className={`replies-${id} ${collapsed ? 'hidden' : ''}`} aria-hidden={collapsed}>
                {visibleChildren.map(childNode => (
                    <TreeNode key={childNode.id} id={childNode.id} node={childNode} indent={indent + 1} parentId={childNode.parent_id} parentName={node.author} postAuthor={postAuthor} />
                ))}
            </div>
        </div>
    );
}

function CommentText({ children }) {
    return (
        <div data-comment-scroll className='app-comment-text content md:text-sm text-sm break-words overflow-auto w-full px-3 pb-3 [&>p>a]:underline [&>p>a]:text-blue-900 [&>pre]:pre-wrap)'
        >{parse(children, {
            replace: domNode => {
                if (domNode.attribs) {
                    if (domNode.attribs.href) {
                        if (domNode.attribs.href.includes("item")) {
                            return <Link to={`/item/${domNode.attribs.href.substring(37)}`} target="_blank">
                                {`${domNode.attribs.href}`}
                            </Link>
                        }
                        return <Link to={`${domNode.attribs.href}`} target="_blank">
                            {`${domNode.attribs.href}`}
                        </Link>
                    }
                }
            }
        })}
        </div>
    )
}

export default Comments

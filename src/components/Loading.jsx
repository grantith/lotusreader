import React from 'react'

function Loading() {
    return (
        <div className="loading-screen flex h-screen items-center justify-center text-xl" role="status" aria-live="polite">
            <div className="flex items-center">
            <span className="loader mr-3" aria-hidden="true"></span>
            Loading
            </div>
        </div>

    )
}

export default Loading
import React from "react";

export default {
    spinnerLoader: (className, align = "center") => {
        return <div className={`${className} d-flex justify-content-${align}`}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    }
}
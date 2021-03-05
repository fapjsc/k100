import React from 'react'
import './index.scss'


const BaseSpinner = () => {
    return (
        <div className="spinner">
            <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            </div>
        </div>
    )
}

export default BaseSpinner

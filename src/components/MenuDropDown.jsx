import React from 'react'

const MenuDropDown = ({ items, anchorEl }) => {
    return (
        <div className='drop-down-menu' style={{top: anchorEl.current.getBoundingClientRect().bottom + 20 + "px", left: anchorEl.current.getBoundingClientRect().left - 50 + "px"}}>
            {
                items.map(item => {
                    return (
                        <div onClick={() => {item.clickHandler();}} className='drop-down-menu-item'>
                            {item.title}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default MenuDropDown

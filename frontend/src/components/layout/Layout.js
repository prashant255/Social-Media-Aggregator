import React from 'react'
import Header from '../ui/header/Header'
import Footer from '../ui/footer/Footer'
import Drawer from '../ui/drawer/Drawer'
import Bookmark from '../bookmark/bookmark'

const layout = (props) => {

    let mainContent = null
    switch(props.content) {
        case 'drawer': 
            mainContent = <Drawer />
            break
        case 'bookmark':
            console.log("Inside")
            mainContent = <Bookmark />
            break
        default:
            mainContent = null
    }

    return (
        <div>
            <Header />
                {mainContent}
            <Footer />       
        </div>
    )
}

export default layout
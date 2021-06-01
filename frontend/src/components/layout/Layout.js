import React from 'react'
import Header from '../ui/header/Header'
import Footer from '../ui/footer/Footer'
import Drawer from '../ui/drawer/Drawer'

const layout = (props) => {

    let mainContent = null
    switch(props.content) {
        case 'drawer': 
            mainContent = <Drawer type = "posts"/>
            break
        case 'bookmark':
            console.log("Inside")
            mainContent = <Drawer type = "bookmark"/>
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
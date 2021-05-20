import React from 'react'
import Header from '../ui/footer/Footer'
import Footer from '../ui/footer/Footer'
import Drawer from '../ui/drawer/drawer'

const layout = (props) => {

    let mainContent = null
    switch(props.content) {
        case 'drawer': 
            mainContent = <Drawer />
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
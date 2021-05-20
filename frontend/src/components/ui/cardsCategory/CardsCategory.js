import React from 'react'
import classes from './CardsCategory.module.css'

function Cards(props) {

    let cardClass = [classes.image]
    if(props.selected) {
        cardClass.push(classes.selectedImage)
    }

    return (
        <div onClick={props.clicked} style={{textAlign: 'center'}}>
            <img src={`./categories/${props.imageSource}`} alt={props.categoryName} className={cardClass.join(' ')}/>
        </div>
    )
}

export default Cards
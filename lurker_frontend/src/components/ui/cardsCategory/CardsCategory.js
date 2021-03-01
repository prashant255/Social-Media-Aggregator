import React from 'react'
import classes from './CardsCategory.module.css'

function Cards(props) {

    let cardClass = [classes.Card]
    if(props.selected) {
        cardClass.push(classes.CardSelected)
    }

    return (
        <div className = {cardClass.join(' ')} onClick = {props.clicked}>
            {/* <input className = {classes.InputCheckbox} type = "checkbox" id = {props.id}/>
            <label for = {props.id}></label> */}
            {/* <img className = {classes.CardImage} src = "https://fakeimg.pl/400x300/009578/fff/" alt = "" /> */}
                {props.selected? <ion-icon class = {classes.ThumbsUp} name="thumbs-up"></ion-icon> : null }
                <ion-icon class = {classes.CardIcon} name={props.iconName}></ion-icon>
                <div className = {classes.CardContent}>
                    <h2>{props.categoryName}</h2>    
                </div>
        </div>
    )
}

export default Cards
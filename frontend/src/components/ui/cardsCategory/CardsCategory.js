import React from 'react'
import classes from './CardsCategory.module.css'

// import GridListTile from '@material-ui/core/GridListTile';

function Cards(props) {

    let cardClass = [classes.image]
    if(props.selected) {
        cardClass.push(classes.selectedImage)
    }

    return (
        <div onClick={props.clicked} style={{textAlign: 'center'}}>
            <img src={`./categories/${props.imageSource}`} alt={props.categoryName} className={cardClass.join(' ')}/>
        </div>
        // <div className = {cardClass.join(' ')} onClick = {props.clicked}>
        //     {/* <input className = {classes.InputCheckbox} type = "checkbox" id = {props.id}/>
        //     <label for = {props.id}></label> */}
        //     {/* <img className = {classes.CardImage} src = "https://fakeimg.pl/400x300/009578/fff/" alt = "" /> */}
        //         {props.selected? <ion-icon class = {classes.ThumbsUp} name="thumbs-up"></ion-icon> : null }
        //         <ion-icon class = {classes.CardIcon} name={props.iconName}></ion-icon>
        //         <div className = {classes.CardContent}>
        //             <h2>{props.categoryName}</h2>    
        //         </div>
        // </div>
    )
}

export default Cards
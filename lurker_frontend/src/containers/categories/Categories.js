import React, {Component} from 'react'
import classes from './Categories.module.css'
import Cards from '../../components/ui/cardsCategory/CardsCategory'
import Button from '../../components/ui/button/Button'

class Categories extends Component {


    state = {
        categories:{
            sports: {
                displayName: "Sports",
                iconName: "football",
                selected: false    
            },
            business: {
                displayName: "Business",
                iconName: "business",
                selected: false    
            },
            celeberity: {
                displayName: "Celeberity",
                iconName: "star",
                selected: false    
            },
            finance: {
                displayName: "Finance",
                iconName: "wallet",
                selected: false    
            },
            gaming: {
                displayName: "Gaming",
                iconName: "game-controller",
                selected: false    
            },
            entertainment: {
                displayName: "Entertainment",
                iconName: "tv",
                selected: false    
            }
        },
        selectedCount: 0
    }

    categoryClickedHanlder = (id) => {
        let categories = {...this.state.categories}
        let selectedCount = this.state.selectedCount
        let categoryConfig = {...categories[id]}
        categoryConfig.selected = !categoryConfig.selected
        categories[id] = categoryConfig
        selectedCount = categoryConfig.selected ? selectedCount + 1 : selectedCount - 1
        this.setState({
            categories,
            selectedCount
        })
    }

    nextClickHanlder = () => {
        const categorySelected = []
        for(let categoryIdentifier in this.state.categories)
            if(this.state.categories[categoryIdentifier].selected)
                categorySelected.push(categoryIdentifier)
        console.log(categorySelected)
    }

    render () {
        
        const categoriesArray = []
        for(let key in this.state.categories){
            categoriesArray.push({
                id: key,
                config: this.state.categories[key]
            })
        }
        return (
            <div className = {classes.Categories}>
                <div className = {classes.Cards}>
                    {
                        categoriesArray.map(category => 
                            <Cards
                                id = {category.id}    
                                categoryName = {category.config.displayName}
                                iconName = {category.config.iconName}
                                selected = {category.config.selected}
                                clicked = {() => this.categoryClickedHanlder(category.id)}
                            />
                        )
                    }
                </div>
                <div className = {classes.Center}>
                    <Button 
                        btnType = "Success" 
                        disabled = {!this.state.selectedCount} 
                        clicked = {this.nextClickHanlder}>NEXT</Button>
                </div>
            </div>
        )
    }
}

export default Categories

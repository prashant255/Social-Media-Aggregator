import React, {Component} from 'react'
import { connect } from 'react-redux'

import classes from './Categories.module.css'

import Card from '../../components/ui/cardsCategory/CardsCategory'
import Button from '../../components/ui/button/Button'
import Footer from '../../components/ui/footer/Footer'
import Header from '../../components/ui/header/Header'

import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import GridList from '@material-ui/core/GridList';
import axios from '../../axios/lurkerBackend'

class Categories extends Component {
    state = {
        categories:{
            entertainment: {
                displayName: "Entertainment",
                imageSource: "entertainment.png",
                selected: false    
            },
            celebrity: {
                displayName: "Celebrity",
                imageSource: "celebrities.png",
                selected: false    
            },
            politics: {
                displayName: "Politics",
                imageSource: "politics.png",
                selected: false    
            },
            finance: {
                displayName: "Finance",
                imageSource: "finance.png",
                selected: false    
            },
            gaming: {
                displayName: "Gaming",
                imageSource: "gaming.png",
                selected: false    
            },
            travel: {
                displayName: "Travel",
                imageSource: "travel.png",
                selected: false    
            },
            health: {
                displayName: "Health & Wellness",
                imageSource: "health.png",
                selected: false    
            },
            motivation: {
                displayName: "Motivation",
                imageSource: "motivation.png",
                selected: false    
            },
            promotions: {
                displayName: "Promotions",
                imageSource: "promos.png",
                selected: false    
            },
            sport: {
                displayName: "Sports",
                imageSource: "sports.png",
                selected: false    
            },
            tech: {
                displayName: "Technology",
                imageSource: "tech.png",
                selected: false    
            },
            business: {
                displayName: "Business",
                imageSource: "business.png",
                selected: false    
            },
            news: {
                displayName: "News",
                imageSource: "news.png",
                selected: false    
            },
            personal: {
                displayName: "Personal",
                imageSource: "personal.png",
                selected: false    
            }
        },
        selectedCount: 0
    }

    categoryClickedHandler = (id) => {
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

    nextClickHandler = () => {
        const categorySelected = []
        for(let categoryIdentifier in this.state.categories)
            if(this.state.categories[categoryIdentifier].selected)
                categorySelected.push(categoryIdentifier)

        axios.post("/settings/categories/", categorySelected, {
            headers: {
                'Authorization': `Bearer ${this.props.jwtToken}`
            }
        }).then(() => {
            this.props.history.push('/feed');
        }).catch( e =>
            console.log("Error : ",e)
        );
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
            <div>
                <Header />
                <GridList cellHeight={250} spacing={1} cols={4}>
                    <GridListTile cols={4} style={{ height: 'auto', color:'rgba(17, 53, 117, 1)'}}>
                        <h1 style={{textAlign: 'center', fontSize: '60px'}}>What would you like to see?</h1>
                    </GridListTile>

                    {categoriesArray.map((category) => (
                    <GridListTile cols={1} key={category.id}>
                        <Card 
                            id={category.id}
                            categoryName = {category.config.displayName}
                            imageSource = {category.config.imageSource}
                            selected = {category.config.selected}
                            clicked = {() => this.categoryClickedHandler(category.id)}
                        />
                        <GridListTileBar title={category.config.displayName} style={{backgroundColor:'rgba(17, 53, 117, 1)'}} />
                    </GridListTile>
                    ))}
                </GridList>
                <div className = {classes.Center}>
                    <Button btnType = "Success" disabled = {!this.state.selectedCount} clicked = {this.nextClickHandler}>NEXT</Button>
                </div>
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = state => {
	return {
		jwtToken: state.jwtToken
	}
}

export default connect(mapStateToProps, null)(Categories)

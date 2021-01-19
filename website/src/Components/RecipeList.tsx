import React from 'react';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import { CardActionArea } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import { RecipeMeta } from '../util/recipeUtils';
import { ROUTES } from '../util/routeUtils';
import { getRecipesQuery, SERVER_URL } from '../util/serverUtils';
import { userLoggedIn } from '../util/authUtils';
import { generatePath, RouteComponentProps } from 'react-router';

import '../Styles/RecipeList.css';

interface StateProps {

}

interface RouteParams {
}

type RecipeListProps = StateProps & RouteComponentProps<RouteParams>;

type RecipeListState = {
    recipes?: RecipeMeta[]
}

class RecipeList extends React.Component<RecipeListProps, RecipeListState> {

    constructor(props: RecipeListProps) {
        super(props);
        this.state = {
            recipes: undefined,
        };
    }

    componentDidMount() {
        this.checkLoginStatus();
        this.getRecipes();
    }

    checkLoginStatus() {
        if (!userLoggedIn()) {
            const { history } = this.props;
            const url = generatePath(ROUTES.signin);
            history.push(url);
        }
    }

    getRecipes() {
        const query = getRecipesQuery();
        axios.post( SERVER_URL, { query: query })
            .then( res => {
                this.setState({ recipes: res.data.data.getRecipes })
        }).catch( error => console.log(error));
    }

    renderRecipeCards() {
        const { recipes } = this.state;
        const { history } = this.props;
        if (recipes) {
            // TODO add empty list handling
            return (
                <div>
                    {recipes.map((r) => {
                        const onCardClick = () => {
                            const url = generatePath(ROUTES.recipeDetails, {id: r.id});
                            history.push(url);
                        }
                        return (
                            <Card key={r.id} className={'cardRoot'}>
                                <CardActionArea onClick={onCardClick}>
                                    <CardHeader
                                        title={r.name}
                                        subheader={r.authorName}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {r.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        );
                    })}
                </div>
            );
        } else {
            return (
                <div className="spinner">
                    <CircularProgress size="20%"/>
                </div>
            );
        }
    }

    renderCreateRecipeButton() {
        const { history } = this.props;
        const goToCreatePage = () => {
            const url = generatePath(ROUTES.createRecipe);
            history.push(url);
        }
        return (
            <IconButton className="createButton" aria-label="create" onClick={goToCreatePage}>
                <CreateIcon color="primary"/>
            </IconButton>
        );
    }

    render() {
        return (
            <div className="recipeListRoot">
                {this.renderRecipeCards()}
                {this.renderCreateRecipeButton()}
            </div>
        );
    }
}

export default RecipeList;
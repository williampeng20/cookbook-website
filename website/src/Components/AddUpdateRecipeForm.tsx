import React from 'react';
import axios from 'axios';
import { RouteComponentProps, generatePath } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RecipeInput, Recipe } from '../util/recipeUtils';
import { SERVER_URL, getRecipeDetailsQuery, createRecipeMutation, updateRecipeMutation } from '../util/serverUtils';
import { ROUTES } from '../util/routeUtils';
import RecipeForm from './RecipeForm/RecipeForm';

import '../Styles/AddUpdateRecipeForm.css';

interface StateProps {

}

interface RouteParams {
    id: string;
}

type AddUpdateRecipeFormProps = StateProps & RouteComponentProps<RouteParams>;

type AddUpdateRecipeFormState = {
    recipeDetail?: Recipe;
}

class AddUpdateRecipeForm extends React.Component<AddUpdateRecipeFormProps, AddUpdateRecipeFormState> {
    constructor(props: AddUpdateRecipeFormProps) {
        super(props);
        this.state = {
            recipeDetail: undefined,
        };
    }


    componentDidMount() {
        const recipeId: string | undefined = this.getRecipeId();
        if (recipeId) {
            this.getRecipe(recipeId);
        }
    }

    getRecipe = (id: string) => {
        const query = getRecipeDetailsQuery(id);
        axios.post(SERVER_URL, { query: query })
            .then( res => {
                this.setState({
                    recipeDetail: res.data.data.getRecipe,
                });
        }).catch( error => console.log(error));
    }

    getRecipeId = (): string | undefined => {
        const { id } = this.props.match.params;
        return id ? decodeURIComponent(id) : id;
    }

    createRecipe = (recipeInput: RecipeInput) => {
        const { history } = this.props;
        const query = createRecipeMutation(recipeInput);
        axios.post(SERVER_URL, { query: query })
            .then( res => {
                const url = generatePath(ROUTES.recipeDetails, {id: res.data.data.createRecipe.id});
                history.push(url);
            }).catch( error => console.log(error));
    }

    updateRecipe = (recipeInput: RecipeInput) => {
        const { history } = this.props;
        const recipe: Recipe = { id: this.getRecipeId() || '', ...recipeInput };
        const query = updateRecipeMutation(recipe);
        axios.post(SERVER_URL, { query: query })
            .then( res => {
                const url = generatePath(ROUTES.recipeDetails, {id: res.data.data.updateRecipe.id});
                history.push(url);
            }).catch( error => console.log(error));
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        const { recipeDetail } = this.state;
        const recipeId = this.getRecipeId();
        if (recipeId) {
            if (recipeDetail) {
                return (
                    <div>
                        <RecipeForm
                            onSubmit={this.updateRecipe}
                            recipe={recipeDetail}
                            goBack={this.goBack}
                        />
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
        return (
            <div>
                <RecipeForm
                    onSubmit={this.createRecipe}
                    recipe={recipeDetail}
                    goBack={this.goBack}
                />
            </div>
        );
    }
}

export default AddUpdateRecipeForm;
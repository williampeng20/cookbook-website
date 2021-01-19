import React from 'react';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import { RouteComponentProps, generatePath } from 'react-router';
import { Recipe } from '../util/recipeUtils';
import { SERVER_URL, getRecipeDetailsQuery, deleteRecipeMutation } from '../util/serverUtils';
import { ROUTES } from '../util/routeUtils';
import { getUserId, userLoggedIn } from '../util/authUtils';
import DeleteRecipeModal from './DeleteRecipeModal';

import '../Styles/RecipeDetails.css';

interface StateProps {

}

interface RouteParams {
    id: string;
}

type RecipeDetailsProps = StateProps & RouteComponentProps<RouteParams>;

type RecipeDetailsState = {
    recipeDetail?: Recipe;
    servingSize?: number,
    menuOpen: boolean,
    deleteModalOpen: boolean,
}

class RecipeDetails extends React.Component<RecipeDetailsProps, RecipeDetailsState> {
    constructor(props: RecipeDetailsProps) {
        super(props);
        this.state = {
            recipeDetail: undefined,
            servingSize: undefined,
            menuOpen: false,
            deleteModalOpen: false, 
        };
    }

    componentDidMount() {
        this.checkLoginStatus();
        this.getRecipe(this.getRecipeId());
    }

    checkLoginStatus() {
        if (!userLoggedIn()) {
            const { history } = this.props;
            const url = generatePath(ROUTES.signin);
            history.push(url);
        }
    }

    getRecipe = (id: string) => {
        const query = getRecipeDetailsQuery(id);
        axios.post(SERVER_URL, { query: query })
            .then( res => {
                this.setState({
                    recipeDetail: res.data.data.getRecipe,
                    servingSize: res.data.data.getRecipe.servingSize
                });
        }).catch( error => console.log(error));
    }

    getRecipeId = (): string => {
        const { id } = this.props.match.params;
        return decodeURIComponent(id);
    }

    handleServingSizeSliderChange = (e: any, value: number | number[]) => {
        this.setState({ servingSize: value as number });
    }

    handleServingSizeInputChange = (e: any) => {
        this.setState({ servingSize: e.target.value });
    }

    renderIngredients() {
        const { recipeDetail, servingSize } = this.state;
        if (recipeDetail) {
            const { ingredients, servingSize: defaultSize } = recipeDetail;
            // TODO determine usecase for more dynamic serving size range
            const servingSizeMax = 10;
            const servingSizeMin = 1;
            const sliderValue = servingSize ? Math.min(servingSizeMax, Math.max(servingSize, servingSizeMin)) : servingSizeMin;
            return (
                <div>
                    <div className="servingSizeRoot">
                        <Typography gutterBottom>
                            Serving Size
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs>
                                <Slider
                                    className="servingSizeSlider"
                                    value={sliderValue}
                                    onChange={this.handleServingSizeSliderChange}
                                    aria-labelledby="input-slider"
                                    min={servingSizeMin}
                                    max={servingSizeMax}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    className="servingSizeInput"
                                    value={servingSize}
                                    margin="dense"
                                    onChange={this.handleServingSizeInputChange}
                                    inputProps={{
                                    step: 1,
                                    min: servingSizeMin,
                                    max: servingSizeMax,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <List className="ingredientsRoot">
                        {ingredients.map((ig) => {
                            const labelId = `checkbox-list-secondary-label-${ig.id}`;
                            const itemText = servingSize ? `${ig.amount * (servingSize/defaultSize)} ${ig.unit} ${ig.name}` : ig.name;
                            return (
                                <ListItem key={ig.id}>
                                    <ListItemText id={labelId} primary={itemText} />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>
                </div>
            );
        }
    }

    renderDirections() {
        const { recipeDetail } = this.state;
        if (recipeDetail) {
            const { directions } = recipeDetail;
            return (
                <List className="directionsRoot">
                    {directions.map((dir) => {
                        const labelId = `checkbox-list-secondary-label-${dir}`;
                        return (
                            <ListItem key={dir}>
                                <ListItemIcon>
                                    <Checkbox
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={dir} />
                            </ListItem>
                        );
                    })}
                </List>
            );
        }
    }

    renderRecipeMeta() {
        const { recipeDetail } = this.state;
        if (recipeDetail) {
            const { name, authorName, description } = recipeDetail;
            return (
                <div className="recipeMetaRoot">
                    <Typography variant="h2">
                        {name}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        {authorName}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        {description}
                    </Typography>
                </div>
            );
        }
    }

    renderActions() {
        const { menuOpen, recipeDetail } = this.state;
        const { history } = this.props;
        if (recipeDetail && recipeDetail.authorId === getUserId()) {
            const actions = [
                {
                    icon: <EditIcon />,
                    name: 'Edit', 
                    onClick: () => {
                        const url = generatePath(ROUTES.updateRecipe, {id: recipeDetail.id});
                        history.push(url);
                    },
                },
                {
                    icon: <DeleteIcon />,
                    name: 'Delete',
                    onClick: () => {
                        this.setState({ deleteModalOpen: true })
                    },
                }
              ];
            const handleClose = () => {
                this.setState({ menuOpen: false });
            }
            const handleOpen = () => {
                this.setState({ menuOpen: true });
            }
            return (
                <div>
                    <Backdrop open={menuOpen} />
                    <SpeedDial
                        ariaLabel="menu"
                        className="menuRoot"
                        icon={<SpeedDialIcon icon={<MenuIcon />} openIcon={<MenuOpenIcon />}/>}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        open={menuOpen}
                        direction={"up"}
                    >
                        {actions.map((action) => (
                            <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={action.onClick}
                            />
                        ))}
                    </SpeedDial>
                </div>
            );
        }
    }

    renderDeleteModal() {
        const { deleteModalOpen, recipeDetail } = this.state;
        const { history } = this.props;
        if (recipeDetail) {
            const {id, authorId} = recipeDetail;
            const onSubmit = () => {
                const query = deleteRecipeMutation(id, authorId);
                axios.post(SERVER_URL, {query: query})
                    .then((val) => {
                        const url = generatePath(ROUTES.recipeList);
                        history.push(url);
                    }).catch(error => console.log(error));
            };
            const onClose = () => {
                this.setState({ deleteModalOpen: false });
            }
            return (
                <DeleteRecipeModal
                    open={deleteModalOpen}
                    onClose={onClose}
                    onSubmit={onSubmit}
                />
            );
        }
    }

    render() {
        const { recipeDetail } = this.state;
        if (!recipeDetail) {
            // TODO add more intervals to progress spinner
            const progress = 50;
            return (
                <LinearProgress variant="determinate" value={progress} />
            );
        }
        return (
            <div>
                {this.renderRecipeMeta()}
                {this.renderDirections()}
                {this.renderIngredients()}
                {this.renderActions()}
                {this.renderDeleteModal()}
            </div>
        );
    }
}

export default RecipeDetails;
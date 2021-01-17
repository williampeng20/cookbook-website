import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { RecipeInput } from '../../util/recipeUtils';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
        marginRight: theme.spacing(1),
    },
    editButton: {
        display: 'inline-block',
        marginBottom: '1%',
    },
    title: {
        display: 'inline-block',
    },
    section: {
        margin: '1%',
    }
  }),
);

type RecipeReviewStepProps = {
    recipe: RecipeInput;
    handleBack: () => void;
    onSubmit: (input: RecipeInput) => void;
    goToStep: (stepId: number) => void;
};

export default function RecipeReviewStep(props: RecipeReviewStepProps) {
    const classes = useStyles();
    // TODO Fix UI styling/design of review page
    return (
        <div>
            <div className={classes.section}>
                <Typography variant="h4" className={classes.title}>
                    Name
                </Typography>
                <IconButton
                    className={classes.editButton}
                    onClick={() => props.goToStep(0)}
                >
                    <EditIcon color="primary"/>
                </IconButton>
                <Typography>
                    {props.recipe.name}
                </Typography>
            </div>
            <div className={classes.section}>
                <Typography variant="h4" className={classes.title}>
                    Author
                </Typography>
                <IconButton
                    className={classes.editButton}
                    onClick={() => props.goToStep(0)}
                >
                    <EditIcon color="primary"/>
                </IconButton>
                <Typography>
                    {props.recipe.author}
                </Typography>
            </div>
            <div className={classes.section}>
                <Typography variant="h4" className={classes.title}>
                    Description
                </Typography>
                <IconButton
                    className={classes.editButton}
                    onClick={() => props.goToStep(0)}
                >
                    <EditIcon color="primary"/>
                </IconButton>
                <Typography>
                    {props.recipe.description}
                </Typography>
            </div>
            <div className={classes.section}>
                <Typography variant="h4" className={classes.title}>
                    Serving Size
                </Typography>
                <IconButton
                    className={classes.editButton}
                    onClick={() => props.goToStep(0)}
                >
                    <EditIcon color="primary"/>
                </IconButton>
                <Typography>
                    {props.recipe.servingSize}
                </Typography>
            </div>
            <div className={classes.section}>
                <Typography variant="h4" className={classes.title}>
                    Ingredients
                </Typography>
                <IconButton
                    className={classes.editButton}
                    onClick={() => props.goToStep(1)}
                >
                    <EditIcon color="primary"/>
                </IconButton>
                <Typography>
                    {props.recipe.ingredients.map((ig) => {
                        return (
                            <Typography>
                                {ig.amount} {ig.unit} {ig.name}
                            </Typography>
                        );
                    })}
                </Typography>
            </div>
            <div className={classes.section}>
                <Typography variant="h4" className={classes.title}>
                    Directions
                </Typography>
                <IconButton
                    className={classes.editButton}
                    onClick={() => props.goToStep(2)}
                >
                    <EditIcon color="primary"/>
                </IconButton>
                <Typography>
                    {props.recipe.directions.map((dir, i) => {
                        return (
                            <Typography>
                                {i+1}. {dir}
                            </Typography>
                        );
                    })}
                </Typography>
            </div>
            <div>
                <Button
                    onClick={props.handleBack}
                    className={classes.backButton}
                >
                    Back
                </Button>
                <Button variant="contained" color="primary" onClick={() => props.onSubmit(props.recipe)}>
                    Submit
                </Button>
            </div>
        </div>
    )
}
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import { Recipe, RecipeInput, RecipeMetaInput, Ingredient } from '../../util/recipeUtils';
import { getUserId, getUserDisplayName } from '../../util/authUtils';
import RecipeMetaForm from './RecipeMetaForm';
import RecipeIngredientsForm from './RecipeIngredientsForm';
import RecipeDirectionsForm from './RecipeDirectionsForm';
import RecipeReviewStep from './RecipeReviewStep';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    content: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

function getSteps() {
  return ['Recipe information', 'Ingredients', 'Directions', 'Review'];
};

const defaultRecipeMetaValues: RecipeMetaInput = {
    name: '',
    authorId: getUserId(),
    authorName: getUserDisplayName(),
    description: '',
    servingSize: 1,
};

type RecipeFormProps = {
    onSubmit: (input: RecipeInput) => void;
    // TODO add loading prop for API calls
    recipe?: Recipe;
    goBack: () => void;
};

export default function RecipeForm(props: RecipeFormProps) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [recipeMeta, setRecipeMeta] = React.useState(props.recipe ? props.recipe as RecipeMetaInput : defaultRecipeMetaValues);
    const [recipeIngredients, setRecipeIngredients] = React.useState(props.recipe ? props.recipe.ingredients : []);
    const [recipeDirections, setRecipeDirections] = React.useState(props.recipe ? props.recipe.directions : []);
    const steps = getSteps();

    function getStepContent(stepIndex: number) {
        switch (stepIndex) {
            case 0:
                return (
                    <RecipeMetaForm
                        handleNext={setMeta}
                        handleBack={props.goBack}
                        recipeMeta={recipeMeta}
                    />
                );
            case 1:
                return (
                    <RecipeIngredientsForm
                        handleNext={setIngredients}
                        handleBack={handleBack}
                        ingredients={recipeIngredients}
                    />
                );
            case 2:
                return (
                    <RecipeDirectionsForm 
                        handleNext={setDirections}
                        handleBack={handleBack}
                        directions={recipeDirections}
                    />
                );
            case 3:
                return (
                    <RecipeReviewStep
                        recipe={getRecipe()}
                        handleBack={handleBack}
                        onSubmit={props.onSubmit}
                        goToStep={setActiveStep}
                    />
                );
            default:
                return 'Unknown stepIndex';
        }
    }

    const getRecipe = () => {
        return {
            ...recipeMeta,
            ingredients: recipeIngredients,
            directions: recipeDirections,
        };
    }

    const setMeta = (input: RecipeMetaInput) => {
        setRecipeMeta(input);
        handleNext();
    }

    const setIngredients = (input: Ingredient[]) => {
        setRecipeIngredients(input);
        handleNext();
    }

    const setDirections = (input: string[]) => {
        setRecipeDirections(input);
        handleNext();
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <div className={classes.root}>
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
            <Step key={label}>
                <StepLabel>{label}</StepLabel>
            </Step>
            ))}
        </Stepper>
        <div>
            {activeStep === steps.length ? (
            <div>
                <Typography className={classes.content}>All steps completed</Typography>
            </div>
            ) : (
            <div>
                <Typography className={classes.content}>{getStepContent(activeStep)}</Typography>
            </div>
            )}
        </div>
        </div>
    );
}
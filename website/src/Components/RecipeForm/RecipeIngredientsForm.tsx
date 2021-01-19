import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TextField } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { RecipeInput, Ingredient } from '../../util/recipeUtils';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
        marginRight: theme.spacing(1),
    },
    field: {
        margin: '1%',
        width: '15%',
    },
    rowButtons: {
        padding: '2% 2%',
    },
    error: {
        margin: '1%',
    },
  }),
);

type RecipeIngredientsFormProps = {
    handleNext: (input: Ingredient[]) => void;
    handleBack: () => void;
    ingredients: Ingredient[];
};

export default function RecipeForm(props: RecipeIngredientsFormProps) {
    const { ingredients, handleBack, handleNext } = props;
    const classes = useStyles();
    return (
        <div>
            <Formik
                initialValues={{
                    ingredients: ingredients,
                }}
                validate={values => {
                    const errors: Partial<RecipeInput> = {};
                    if (values.ingredients.length === 0) {
                        errors.ingredients = "Recipe Ingredients are required" as unknown as Ingredient[];
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    handleNext(values.ingredients);
                }}
            >
                {({ submitForm, values, errors }) => (
                <Form>
                    {/** TODO FieldArray performance issues: https://github.com/formium/formik/issues/2296 */}
                    <FieldArray
                        name="ingredients"
                        render={arrayHelpers => (
                            <div>
                                {values.ingredients && values.ingredients.length > 0 ? (
                                    values.ingredients.map((ig, i) => {
                                        return (
                                            <div>
                                                <Field
                                                    component={TextField}
                                                    label="Amount"
                                                    type="number"
                                                    name={`ingredients.${i}.amount`}
                                                    variant="outlined"
                                                    className={classes.field}
                                                />
                                                <Field
                                                    component={TextField}
                                                    label="Units"
                                                    name={`ingredients.${i}.unit`}
                                                    variant="outlined"
                                                    className={classes.field}
                                                />
                                                <Field
                                                    component={TextField}
                                                    label="Ingredient name"
                                                    name={`ingredients.${i}.name`}
                                                    variant="outlined"
                                                    className={classes.field}
                                                />
                                                {/** TODO add pressing ENTER key functionality */}
                                                <IconButton
                                                    aria-label="delete"
                                                    className={classes.rowButtons}
                                                    onClick={() => arrayHelpers.remove(i)}
                                                >
                                                    <DeleteIcon color="secondary"/>
                                                </IconButton>
                                                {i === values.ingredients.length - 1 ? (
                                                    <IconButton
                                                        aria-label="add"
                                                        className={classes.rowButtons}
                                                        onClick={() => arrayHelpers.insert(i+1, {name: '', amount: '', unit: ''})}
                                                    >
                                                        <AddIcon color="primary"/>
                                                    </IconButton>
                                                ) : undefined}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.field}
                                        onClick={() => arrayHelpers.insert(0, {name: '', amount: '', unit: ''})}
                                    >
                                        Add an ingredient
                                    </Button>
                                )}
                            </div>
                        )}
                    />
                    <Typography color="error" className={classes.error}>
                        {errors.ingredients ? errors.ingredients : undefined}
                    </Typography>
                    <div>
                        <Button
                            onClick={handleBack}
                            className={classes.backButton}
                        >
                            Back
                        </Button>
                        <Button variant="contained" color="primary" onClick={submitForm}>
                            Next
                        </Button>
                    </div>
                </Form>
            )}
            </Formik>
        </div>
    );
}
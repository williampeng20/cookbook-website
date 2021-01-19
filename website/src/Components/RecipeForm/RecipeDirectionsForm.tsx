import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TextField } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { RecipeInput } from '../../util/recipeUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
        marginRight: theme.spacing(1),
    },
    field: {
        margin: '1%',
        width: '50%',
    },
    addField: {
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

type RecipeDirectionsFormProps = {
    handleNext: (input: string[]) => void;
    handleBack: () => void;
    directions: string[];
};

export default function RecipeDirectionsForm(props: RecipeDirectionsFormProps) {
    const { directions, handleNext, handleBack } = props;
    const classes = useStyles();
    return (
        <div>
            <Formik
                initialValues={{
                    directions: directions,
                }}
                validate={values => {
                    const errors: Partial<RecipeInput> = {};
                    if (values.directions.length === 0) {
                        errors.directions = "Recipe Ingredients are required" as unknown as string[];
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    handleNext(values.directions);
                }}
            >
                {({ submitForm, values, errors }) => (
                <Form>
                    {/** TODO FieldArray performance issues: https://github.com/formium/formik/issues/2296 */}
                    <FieldArray
                        name="directions"
                        render={arrayHelpers => (
                            <div>
                                {values.directions && values.directions.length > 0 ? (
                                    values.directions.map((dir, i) => {
                                        return (
                                            <div>
                                                <Field
                                                    component={TextField}
                                                    label={`Direction ${i+1}`}
                                                    name={`directions.${i}`}
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
                                                {i === values.directions.length - 1 ? (
                                                    <IconButton
                                                        aria-label="add"
                                                        className={classes.rowButtons}
                                                        onClick={() => arrayHelpers.insert(i+1, '')}
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
                                        className={classes.addField}
                                        onClick={() => arrayHelpers.insert(0, '')}
                                    >
                                        Add directions
                                    </Button>
                                )}
                            </div>
                        )}
                    />
                    <Typography color="error" className={classes.error}>
                        {errors.directions ? errors.directions : undefined}
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
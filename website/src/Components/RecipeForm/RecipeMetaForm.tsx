import React from 'react';
import { Formik, Form, Field } from 'formik';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TextField } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import { RecipeMetaInput } from '../../util/recipeUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
        marginRight: theme.spacing(1),
    },
    field: {
        margin: '1%',
        width: '30%',
    },
  }),
);

type RecipeMetaFormProps = {
    handleNext: (input: RecipeMetaInput) => void;
    handleBack: () => void;
    recipeMeta: RecipeMetaInput;
};

export default function RecipeMetaForm(props: RecipeMetaFormProps) {
    const { recipeMeta, handleNext, handleBack } = props;
    const classes = useStyles();
    return (
        <div>
            <Formik
                initialValues={{
                    name: recipeMeta.name,
                    author: recipeMeta.author,
                    description: recipeMeta.description,
                    servingSize: recipeMeta.servingSize,
                }}
                validate={values => {
                    // TODO create validations on required fields
                    const errors: Partial<RecipeMetaInput> = {};
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    handleNext(values);
                }}
            >
                {({ submitForm }) => (
                <Form>
                    <br />
                    <Field
                        component={TextField}
                        name="name"
                        label="Name"
                        variant="outlined"
                        className={classes.field}
                    />
                    <br />
                    <Field
                        component={TextField}
                        label="Author"
                        name="author"
                        variant="outlined"
                        className={classes.field}
                    />
                    <br />
                    <Field
                        component={TextField}
                        label="Description"
                        name="description"
                        variant="outlined"
                        className={classes.field}
                    />
                    <br />
                    <Field
                        component={TextField}
                        label="Serving Size"
                        name="servingSize"
                        variant="outlined"
                        type="number"
                        className={classes.field}
                    />
                    <br />
                    <div>
                        <Button
                            onClick={handleBack}
                            className={classes.backButton}
                        >
                            Cancel
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
import React from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TextField } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    field: {
        margin: '2%',
        width: '60%',
    },
    submitButton: {
        width: '20%',
        height: '30%',
        marginLeft: '22%',
        marginTop: '1%',
    },
    form: {
        marginLeft: '27%',
        marginTop: '2%',
    },
    title: {
        marginLeft: '24%',
    }
  }),
);

type SignInFormProps = {
};

type SignInInput = {
    username?: string,
    password?: string,
}

export default function SignUpForm(props: SignInFormProps) {
    const classes = useStyles();
    return (
        <div>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                validate={values => {
                    const errors: Partial<SignInInput> = {};
                    if (!values.username) {
                        errors.username = 'User Name is required';
                    }
                    if (!values.password) {
                        errors.password = 'Password is required';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    // setTimeout(() => {
                    //     setSubmitting(false);
                    //alert(JSON.stringify(values, null, 2));
                    // }, 500);
                }}
            >
                {({ submitForm }) => (
                <Form>
                    <div className={classes.form}>
                        <Typography variant="h3" className={classes.title}>
                            Sign In
                        </Typography>
                        <br />
                        <Field
                            component={TextField}
                            label="User Name"
                            name="username"
                            variant="outlined"
                            className={classes.field}
                        />
                        <br />
                        <Field
                            component={TextField}
                            label="Password"
                            name="password"
                            variant="outlined"
                            type="password"
                            className={classes.field}
                        />
                        <br />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submitForm}
                            className={classes.submitButton}
                        >
                            Sign In
                        </Button>
                    </div>
                </Form>
            )}
            </Formik>
        </div>
    );
}
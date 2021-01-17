import React from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

type DeleteRecipeModalProps = {
    open: boolean,
    onClose: () => void;
    onSubmit: () => void;
}

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            width: '40%',
            height: '20%',
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        textCenter: {
            textAlign: 'center',
        },
        buttonCenter: {
            position: 'absolute',
            width: '20%',
            left: '40%',
            top: '70%',
        },
    }),
);

export default function DeleteRecipeModal(props: DeleteRecipeModalProps) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            <div style={modalStyle} className={classes.paper}>
                <Typography variant="h4" gutterBottom className={classes.textCenter}>
                    Delete Recipe
                </Typography>
                <Typography variant="body1" gutterBottom className={classes.textCenter}>
                    Are you sure you want to delete this recipe? This action is irreversible.
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={props.onSubmit}
                    className={classes.buttonCenter}
                >
                    Delete
                </Button>
            </div>
        </Modal>
    );
}
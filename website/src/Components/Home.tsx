import React from 'react';
import Button from '@material-ui/core/Button';
import { getUserCookie } from '../util/authUtils';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../util/routeUtils';

import '../Styles/Home.css'

export default function Home() {
    let history = useHistory();
    const renderActionButton = () => {
        const goToPage = (page: string) => {
            history.push(page);
        }
        return (
            <Button
                size="large"
                onClick={() => goToPage(getUserCookie() ? ROUTES.recipeList : ROUTES.signin)}
            >
                {getUserCookie() ? "Explore" : "Sign in"}
            </Button>
        );
    }

    return (
        <div className="center">
            <h1>Cloud Cookbook</h1>
            <p className="info">
                This project is an ongoing development effort in order to learn the full stack of web development, and provide a tool that anyone can use for their daily cooking or inspirations.
                If you have any ideas, comments, features you want to see, feel free to send feedback to me at cloud.cookbook.development@gmail.com
            </p>
            {renderActionButton()}
        </div>
    );
}

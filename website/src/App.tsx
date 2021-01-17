import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ROUTES } from './util/routeUtils';

import Home from './Components/Home';
import RecipeList from './Components/RecipeList';
import AddUpdateRecipeForm from './Components/AddUpdateRecipeForm';
import RecipeDetails from './Components/RecipeDetails';
import SignUpForm from './Components/SignUpForm';
import SignInForm from './Components/SignInForm';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path={ROUTES.home} component={RecipeList}>
          </Route>
          <Route exact path={ROUTES.signin}>
            <SignInForm />
          </Route>
          <Route exact path={ROUTES.signup}>
            <SignUpForm />
          </Route>
          <Route exact path={ROUTES.recipeList} component={RecipeList}>
          </Route>
          <Route exact path={ROUTES.createRecipe} component={AddUpdateRecipeForm}>
          </Route>
          <Route path={ROUTES.updateRecipe} component={AddUpdateRecipeForm}>
          </Route>
          <Route path={ROUTES.recipeDetails} component={RecipeDetails}>
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;

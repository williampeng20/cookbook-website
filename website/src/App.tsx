import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ROUTES } from './util/routeUtils';

import Home from './Components/Home'
import RecipeList from './Components/RecipeList';
import AddUpdateRecipeForm from './Components/AddUpdateRecipeForm';
import RecipeDetails from './Components/RecipeDetails';
import SignInScreen from './Components/SignInScreen';
import Navigation from './Components/Navigation';

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Switch>
          <Route exact path={ROUTES.home} component={Home}>
          </Route>
          <Route exact path={ROUTES.signin} component={SignInScreen}>
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

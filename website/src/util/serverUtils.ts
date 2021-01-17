import { Recipe, RecipeInput } from './recipeUtils';

export const SERVER_URL = 'http://localhost:4000/graphql';

export function getRecipeDetailsQuery(id: string): string {
    return `{
        getRecipe(id: "${id}") {
            id,
            name,
            author,
            description,
            directions,
            servingSize,
            ingredients {
                id,
                name,
                amount,
                unit
            }
        }
    }`;
}

export function createRecipeMutation(recipe: RecipeInput): string {
    return `mutation {
        createRecipe(recipe: {
            name: "${recipe.name}",
            author: "${recipe.author}",
            description: "${recipe.description}",
            servingSize: ${recipe.servingSize},
            directions: [${recipe.directions.map(dir => `"${dir}"`).toString()}],
        }, ingredients: [
            ${recipe.ingredients.map((ig) => {
                return `{
                    name: "${ig.name}",
                    amount: ${ig.amount},
                    unit: "${ig.unit ? ig.unit : ''}"
                }`;
            }).toString()}
        ]) {
            id
        }
    }`;
}

export function updateRecipeMutation(recipe: Recipe): string {
    return `mutation {
        updateRecipe(id: "${recipe.id}", recipe: {
            name: "${recipe.name}",
            author: "${recipe.author}",
            description: "${recipe.description}",
            servingSize: ${recipe.servingSize},
            directions: [${recipe.directions.map(dir => `"${dir}"`).toString()}],
        }, ingredients: [
            ${recipe.ingredients.map((ig) => {
                return `{
                    name: "${ig.name}",
                    amount: ${ig.amount},
                    unit: "${ig.unit ? ig.unit : ''}"
                }`;
            }).toString()}
        ]) {
            id
        }
    }`;
}

export function deleteRecipeMutation(id: string, author: string): string {
    return `mutation {
        deleteRecipe(id: "${id}", author: "${author}")
    }`;
}
export type Recipe = RecipeMeta & RecipeContent;

export type RecipeContent = {
    directions: string[],
    ingredients: Ingredient[],
};

export type RecipeMeta = {
    id: string,
    name: string,
    authorName: string,
    authorId: string,
    description: string,
    servingSize: number,
};

export type RecipeMetaInput = {
    name: string,
    authorName: string,
    authorId: string,
    description: string,
    servingSize: number,
};

export type RecipeInput = RecipeContent & RecipeMetaInput;

export type Ingredient = {
    id?: string,
    name: string,
    amount: number,
    unit?: string,
};

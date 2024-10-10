const { connection } = require("../../config/db");

class Recipe {
    static cachedRecipes = [];

    constructor(id, label, description) {
        this.id = id;
        this.label = label;
        this.description = description;
        Recipe.cachedRecipes.push(this);
    }

    static fetchAll = async () => {
        return new Promise(resolve => {
            connection.query('SELECT * FROM `recipes`', (error, results, fields) => {
                if (error) 
                    resolve([]); 
                else {
                    Recipe.cachedRecipes = [];
                    results = results.map(result => {
                        new Recipe(result.id, result.label, result.description);
                        return {...result};
                    });
                    resolve(Recipe.cachedRecipes); 
                }
            });
        });
    };

    static getAll = () => {
        return Recipe.cachedRecipes;
    };

    edit = async (updateFields) => {
        const collums = Object.keys(updateFields);
        const values = Object.values(updateFields);
        const recipeId = this.id;

        if (collums.length === 0) {
            return resolve(false);
        }

        const updateClause = collums.map(collum => `${collum} = ?`).join(", ");
        values.push(recipeId);
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE recipes SET ${updateClause} WHERE id = ?`, values, function (error, results) {
                if (error)
                    reject(error);
                else {
                    const recipeIndex = Recipe.cachedRecipes.findIndex(recipe => recipe.id === recipeId);
                    if (recipeIndex != -1)
                        Object.assign(Recipe.cachedRecipes[recipeIndex], updateFields);
                    resolve(Recipe.cachedRecipes[recipeIndex]);
                }  
            });
        });
    };

    static create = async (value) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO recipes SET ?', value, (error, results) => {
                const insertId = results.insertId
                if (error || !insertId)
                    reject(error);
                else {
                    const response = new Recipe(insertId, value.label, value.description);
                    resolve(response);
                }  
            });
        });
    };

    delete = async () => {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM recipes WHERE id = ${this.id}`, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    Recipe.cachedRecipes = Recipe.cachedRecipes.filter(recipe => recipe.id != this.id);
                    resolve(results.affectedRows > 0);
                }
            });
        });
    };
};

module.exports = Recipe

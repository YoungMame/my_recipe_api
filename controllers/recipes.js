const SERVICE = require("../services/index");

const getAll = (req, res) => {
    res.status(200).send(SERVICE.Recipe.cachedRecipes);
}

const getOne = (req, res) => {
    const recipeId = parseInt(req.params.id);

    if (isNaN(recipeId)) {
        return res.status(400).send({ message: "Invalid recipe ID" });
    }
    const value = SERVICE.Recipe.cachedRecipes.find(recipe => recipe.id === parseInt(recipeId));

    if (value) {
        res.status(200).send(value);
    } else {
        res.status(404).send({ message: "Recipe not found" });
    }
}

const createOne = async (req, res) => {
    try {
        const value = await SERVICE.Recipe.create(req.body);
        if (!value)
            return res.status(406).send({ message: "Wrong body structure" })
        return res.status(200).send(value);
    } catch (error) {
        return res.status(500).send({ message: "Server error", error: error.message })
    }
}

const editOne = async (req, res) => {
    const recipeId = parseInt(req.params.id);

    if (isNaN(recipeId)) {
        return res.status(400).send({ message: "Invalid recipe ID" });
    }
    const value = SERVICE.Recipe.cachedRecipes.find(recipe => recipe.id === parseInt(recipeId));

    try {
        if (value) {
            const response = await value.edit(req.body);
            if (!response)
                return res.status(406).send({ message: "Wrong body structure" })
            return res.status(200).send(response);
        } else {
            return res.status(404).send({ message: "Recipe not found" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Server error", error: error.message })
    }
}

const deleteOne = async (req, res) => {
    const recipeId = parseInt(req.params.id);

    if (isNaN(recipeId))
        return res.status(400).send({ message: "Invalid recipe ID" });
    const value = SERVICE.Recipe.cachedRecipes.find(recipe => recipe.id === parseInt(recipeId));

    try {
        if (value) {
            await value.delete();
            return res.status(200).send({ message: "Recipe deleted successfully"});
        } else {
            return res.status(404).send({ message: "Recipe not found" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Server error", error: error.message })
    }
}

const deleteSome = async (req, res) => {

    const recipesIds = (req.body.ids && Array.isArray(req.body.ids)) ? req.body.ids.map(id => parseInt(id)) : [];
    if (recipesIds.length === 0)
        return res.status(400).send({ message: "Invalid recipes IDs" });

    try {
        const recipesToDelete = SERVICE.Recipe.cachedRecipes.filter(recipe => recipesIds.includes(recipe.id));
        if (recipesToDelete.length !== 0) {
            for (let recipe of recipesToDelete) {
                await recipe.delete();
            }
            return res.status(200).send({ message: "Recipes deleted successfully"});
        } else {
            return res.status(404).send({ message: "Recipes not found" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Server error", error: error.message })
    }
}

module.exports = {
    getAll,
    getOne,
    createOne,
    editOne,
    deleteOne,
    deleteSome
}
import React from "react"
import IngredientsList from "./components/IngredientsList"
import HomeRecipe from "./components/HomeRecipe"

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        ["Chicken", "Rice", "Onions", "Spices"]
    )
    const [recipe, setRecipe] = React.useState("")
    const recipeSection = React.useRef(null)

    React.useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            const yCoord = recipeSection.current.getBoundingClientRect().top + window.scrollY
            window.scrollTo({
                top: yCoord,
                behavior: "smooth"
            })
        }
    }, [recipe])

    async function getRecipe(ingredientList = ingredients) {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/get-recipe/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients: ingredientList })
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`Failed to get recipe: ${errorText}`)
            }

            const data = await res.json()
            setRecipe(data.recipe || "No recipe generated.")
        } catch (error) {
            console.error(error)
            setRecipe("Error generating recipe.")
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")?.trim()
        if (newIngredient) {
            const updatedIngredients = [...ingredients, newIngredient]
            setIngredients(updatedIngredients)
            getRecipe(updatedIngredients) // auto-generate recipe
        }
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ref={recipeSection}
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            }

            {recipe && <HomeRecipe recipe={recipe} />}
        </main>
    )
}

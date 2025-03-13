import { useState } from "react";

export default function Recipe() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRecipes = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`https://recipe-4-y23w.onrender.com/api/v1/recipes`);
            const data = await response.json();

            const enteredIngredients = ingredients
                .toLowerCase()
                .split(',')
                .map((ingredient) => ingredient.trim());

            const filteredRecipes = data.data.filter((recipe) =>
                enteredIngredients.every((ingredient) =>
                    recipe.ingredients.some((item) => item.toLowerCase().includes(ingredient))
                )
            );

            setRecipes(filteredRecipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to fetch recipes. Please try again later.');
        }
        setLoading(false);
    };

    return (
        <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg">
                🍽️ Recipe Finder
            </h1>

            <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients (comma separated)..."
                    className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
                <button
                    onClick={fetchRecipes}
                    className="w-full bg-yellow-500 mt-4 py-3 rounded-md text-gray-900 font-bold hover:bg-yellow-400 transition-all duration-200 ease-in-out"
                >
                    {loading ? 'Searching...' : 'Find Recipes'}
                </button>
            </div>

            {error && (
                <p className="text-red-500 mt-4 text-lg">{error}</p>
            )}

            {recipes.length > 0 && (
                <div className="w-full max-w-4xl mt-8">
                    <h2 className="text-2xl text-yellow-400 font-semibold text-center mb-4">
                        🍛 Recipe Suggestions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe._id}
                                className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-gray-700"
                            >
                                <img
                                    src={recipe.image}
                                    alt={recipe.name}
                                    className="w-full h-40 object-cover rounded-md"
                                />
                                <h3 className="text-lg font-bold text-yellow-400 mt-3">
                                    {recipe.name}
                                </h3>
                                <p className="text-gray-300 text-sm mt-1">{recipe.description}</p>
                                <p className="text-gray-400 text-xs mt-2">
                                    Ingredients: {recipe.ingredients.join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recipes.length === 0 && !loading && !error && (
                <p className="text-gray-400 mt-6">No recipes found for the given ingredients.</p>
            )}
        </div>
    );
}

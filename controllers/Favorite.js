const Favorite = require('../models/Favorite');

exports.getFavoritesByCategory = async (req, res) => {
    try {
        // Validate the category parameter
        const { category } = req.params;
        const { limit = 10, offset = 0 } = req.query;
        const validCategories = ["Artist", "Album", "Track"];

        if (!validCategories.includes(category)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request: Invalid category.",
                error: `Category must be one of ${validCategories.join(", ")}`,
            });
        }

        // Fetch favorites based on user, category, with pagination
        const favorites = await Favorite.find({ user_id: req.user._id, category })
            .skip(parseInt(offset))
            .limit(parseInt(limit));

        const totalFavorites = await Favorite.countDocuments({
            user_id: req.user._id,
            category,
        });

        res.status(200).json({
            status: 200,
            data: favorites,
            metadata: {
                total: totalFavorites,
                limit: parseInt(limit),
                offset: parseInt(offset),
            },
            message: "Favorites retrieved successfully.",
            error: null,
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({
            status: 500,
            data: null,
            message: "Internal server error.",
            error: error.message,
        });
    }
};


exports.addFavorite = async (req, res) => {
    try {
        // Validate the request body
        const { category, item_id } = req.body;
        const validCategories = ['Artist', 'Album', 'Track'];

        if (!category || !item_id) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request: Missing required fields.',
                error: 'Category and item_id are required.',
            });
        }

        if (!validCategories.includes(category)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request: Invalid category.',
                error: `Category must be one of ${validCategories.join(', ')}`,
            });
        }
        // Check for existing favorite
        const existingFavorite = await Favorite.findOne({
            user: req.user.id,
            category,
            item_id,
        });

        if (existingFavorite) {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden: Item already favorited.',
                error: 'This item is already in your favorites.',
            });
        }

        // Add the favorite
        const newFavorite = new Favorite({
            user: req.user.id,
            category,
            item_id,
        });

        await newFavorite.save();

        res.status(201).json({
            status: 201,
            data: newFavorite,
            message: 'Favorite added successfully.',
            error: null,
        });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal server error.',
            error: error.message,
        });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the favorite exists and belongs to the user
        const favorite = await Favorite.findOne({ _id: id, user_id: req.user._id });

        if (!favorite) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Favorite not found.',
                error: 'The specified favorite does not exist or does not belong to you.',
            });
        }

        // Remove the favorite
        await Favorite.deleteOne({ _id: id });

        res.status(200).json({
            status: 200,
            data: null,
            message: 'Favorite removed successfully.',
            error: null,
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal server error.',
            error: error.message,
        });
    }
};


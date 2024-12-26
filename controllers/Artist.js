
const Artist = require("../models/Artist");
const mongoose = require("mongoose");

exports.deleteArtist = async (req, res) => {
  console.log(req.params.id); // Log the ID from the request params
  try {
    const id = req.params.id;
    const artist = await Artist.findById({ _id: id });

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }
    await Artist.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "Artist deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting artist:", error);
    res.status(500).json({
      success: false,
      message: "Artist could not be deleted successfully",
    });
  }
};

exports.getAllArtist = async (req, res) => {
  try {
    const { limit = 10, offset = 0, grammy, hidden } = req.query;

    const filter = {};
    if (grammy) filter.grammy = parseInt(grammy);
    if (hidden) filter.hidden = hidden === 'true';

    const allArtists = await Artist.find(filter)
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const totalArtists = await Artist.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: allArtists,
      metadata: {
        total: totalArtists,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Unable to fetch artist data.`,
      error: error.message,
    });
  }
};


exports.getSingleArtist = async (req, res) => {
  try {
    const id = req.params.id;
    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: artist,
    });
  }
  catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Artist Data`,
      error: error.message,
    });
  };
}

exports.updateArtist = async (req, res) => {
  console.log(req.params.id)
  try {
    const id = req.params.id;
    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }
    const { name, grammy, hidden } = req.body;
    const data = await Artist.findByIdAndUpdate(
      id,
      { name, grammy, hidden },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Artist updated successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the artist",
      error: error.message
    });
  }
};

exports.addArtist = async (req, res) => {
  try {
    // Validate the request body
    const { name, grammy, hidden } = req.body;
    if (!name) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request: Missing required fields.',
        error: 'Name is required.',
      });
    }

    // Create the new artist
    const newArtist = new Artist({
      name,
      grammy: grammy || false,
      hidden: hidden || false,
    });

    // Save the artist to the database
    await newArtist.save();

    // Respond with success
    return res.status(201).json({
      status: 201,
      data: {
        name: newArtist.name,
        grammy: newArtist.grammy,
        hidden: newArtist.hidden,
      },
      message: 'Artist created successfully.',
      error: null,
    });
  } catch (error) {
    console.error('Error adding artist:', error);
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

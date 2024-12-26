const mongoose = require("mongoose");
const Album = require("../models/Album");
exports.deleteAlbum = async (req, res) => {
  try {

    const id = req.params.id; // Ensure you're passing the correct data in body
    console.log(id);
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }
    await Album.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Album deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Album cannot be deleted successfully",
      error: error.message,
    });
  }
};

exports.getAllAlbums = async (req, res) => {
  try {
    const { limit = 10, offset = 0, artist_id, hidden } = req.query;

    const filter = {};
    if (artist_id) filter.artist = artist_id;
    if (hidden) filter.hidden = hidden === 'true';

    const allAlbums = await Album.find(filter)
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const totalAlbums = await Album.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: allAlbums,
      metadata: {
        total: totalAlbums,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can't fetch albums",
      error: error.message,
    });
  }
};


exports.getSingleAlbum = async (req, res) => {
  try {
    const id = req.params.id;
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: album,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can't fetch album data",
      error: error.message,
    });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const id = req.params.id;
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    const { title, artist, year, hidden } = req.body;
    const updatedAlbum = await Album.findByIdAndUpdate(
      id,
      { title, artist, year, hidden },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: updatedAlbum,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the album",
      error: error.message,
    });
  }
};

exports.addAlbum = async (req, res) => {
  try {
    const { title, artist, year, hidden } = req.body;
    if (!title || !artist) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request: Missing required fields.',
        error: 'Title and Artist are required.',
      });
    }

    const newAlbum = new Album({
      title,
      artist,
      year,
      hidden,
    });

    await newAlbum.save();

    return res.status(201).json({
      status: 201,
      data: {
        title: newAlbum.title,
        artist: newAlbum.artist,
        year: newAlbum.year,
        hidden: newAlbum.hidden,
      },
      message: 'Album created successfully.',
      error: null,
    });
  } catch (error) {
    console.error('Error adding album:', error);
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

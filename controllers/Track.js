const Track = require("../models/Track");
const mongoose = require("mongoose");

exports.deleteTrack = async (req, res) => {
  try {
    const id = req.params.id; // Ensure you're passing the correct data in body
    console.log(id);
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({
        success: false,
        message: "Track not found",
      });
    }
    await Track.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Track deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Track cannot be deleted successfully",
      error: error.message,
    });
  }
};

exports.getAllTracks = async (req, res) => {
  try {
    const { limit = 10, offset = 0, artist_id, album_id, hidden } = req.query;

    const filter = {};
    if (artist_id) filter.artist = artist_id;
    if (album_id) filter.album = album_id;
    if (hidden) filter.hidden = hidden === 'true';

    const allTracks = await Track.find(filter)
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const totalTracks = await Track.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: allTracks,
      metadata: {
        total: totalTracks,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can't fetch tracks",
      error: error.message,
    });
  }
};

exports.getSingleTrack = async (req, res) => {
  try {
    const id = req.params.id;
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({
        success: false,
        message: "Track not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: track,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can't fetch track data",
      error: error.message,
    });
  }
};

exports.updateTrack = async (req, res) => {
  try {
    const id = req.params.id;
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({
        success: false,
        message: "Track not found",
      });
    }

    const { title, album, duration, artist, genre } = req.body;
    const updatedTrack = await Track.findByIdAndUpdate(
      id,
      { title, album, duration, artist, genre },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Track updated successfully",
      data: updatedTrack,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the track",
      error: error.message,
    });
  }
};

exports.addTrack = async (req, res) => {
  try {
    const { title, album, duration, artist, hidden } = req.body;
    if (!title || !album || !artist) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request: Missing required fields.',
        error: 'Title, Album, and Artist are required.',
      });
    }

    const newTrack = new Track({
      title,
      album,
      duration,
      artist,
      hidden,
    });

    await newTrack.save();

    return res.status(201).json({
      status: 201,
      data: {
        title: newTrack.title,
        album: newTrack.album,
        duration: newTrack.duration,
        artist: newTrack.artist,
        hidden: newTrack.hidden,
      },
      message: 'Track created successfully.',
      error: null,
    });
  } catch (error) {
    console.error('Error adding track:', error);
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};


const { User, Thought } = require("../models");
const { findByIdAndRemove } = require("../models/Thought");
const ThoughtController = require("./thought-controller");
const { getThoughtById, deleteThought } = require("./thought-controller");

const userController = {
  // GET ALL USERS ➝ /api/users
  getAllUsers(req, res) {
    User.find({})
      .sort({ _id: -1 })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // GET SINGLE USER BY ID ➝ /api/users/:id
  async getUserById({ params }, res) {
    try {
        const dbUserData = await User.findOne({ _id: params.id })
            .populate({
                path: "thoughts",
                select: "-__v",
            })
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v");

        if (!dbUserData) {
            return res.status(404).json({ message: "No user found with this id!" });
        }

        return res.json(dbUserData);
    } catch (error) {
        console.error(error);
        return res.status(400).json(error);
    }
},

  // POST: CREATE NEW USER ➝ /api/users
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  // PUT: UPDATE USER BY ID ➝ /api/users/:id
  async updateUser({ params, body }, res) {
    try {
        console.log("params sent", params);

        const dbUserData = await User.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        ).select("-__v");

        if (!dbUserData) {
            return res.status(404).json({ message: "user not found" });
        }

        return res.json(dbUserData);
    } catch (error) {
        console.error(error);
        return res.status(400).json(error);
    }
},

  // DELETE USER AND ITS THOUGHTS 
  async deleteUser({ params }, res) {
    try {
        const dbUserData = await User.findOneAndDelete({ _id: params.id });

        if (!dbUserData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const deletedThoughts = await Thought.deleteMany({ username: dbUserData.username });

        if (!deletedThoughts) {
            return res.status(404).json({ message: 'User deleted, no thoughts to delete.' });
        }

        return res.json(deletedThoughts);
    } catch (error) {
        console.error(error);
        return res.status(400).json(error);
    }
},

    

  // ADD FRIEND TO USER'S FRIEND LIST ➝ /api/users/:userId/friends/:friendId
  async addFriend({ params }, res) {
    try {
        const dbUserData = await User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        );

        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id!" });
            return;
        }

        res.json(dbUserData);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
},

  // REMOVE FRIEND FROM USER'S FRIEND LIST ➝ /api/users/:userId/friends/:friendId
  async removeFriend({ params }, res) {
    try {
        const dbUserData = await User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        );

        res.json(dbUserData);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
},
};

module.exports = userController;

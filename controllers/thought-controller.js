const { Thought, User } = require("../models");

const ThoughtController = {
  getAllThoughts(req, res) {
      Thought.find({})
          .select("-__v")
          .sort({ _id: -1 })
          .then((dbThoughtData) => res.json(dbThoughtData))
          .catch((err) => {
              console.log(err);
              res.status(400).json(err);
          });
  },
getThoughtById : async ({ params }, res) => {
    try {
        console.log("params sent", params);

        const dbThoughtData = await Thought.findOne({ _id: params.thoughId }).select("-__v");

        if (!dbThoughtData) {
            return res.status(404).json({ message: "No thought found with this id." });
        }

        return res.json(dbThoughtData);
    } catch (err) {
        console.error(err);
        return res.status(400).json(err);
    }
},
  // add a thought
addThought : async ({ params, body }, res) => {
    try {
        console.log("INCOMING BODY", body);

        const thought = await Thought.create(body);

        const dbUserData = await User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: thought._id } },
            { new: true }
        );

        if (!dbUserData) {
            return res.status(404).json({ message: 'No User found with this id. first error' });
        }

        return res.json(dbUserData);
    } catch (error) {
        console.error(error);
        return res.json(error);
    }
},
  // remove a thought
removeThought : async ({ params }, res) => {
    try {
        const deletedThought = await Thought.findOneAndDelete({ _id: params.thoughtId });

        if (!deletedThought) {
            return res.status(404).json({ message: 'No thought with this id' });
        }

        const dbUserData = await User.findOneAndUpdate(
            { _id: params.username },
            { $pull: { thoughts: params.thoughtId } },
            { new: true }
        );

        return res.json(dbUserData);
    } catch (error) {
        console.error(error);
        return res.json(error);
    }
},
  // add a reaction
  addReaction : async ({ params, body }, res) => {
    try {
        console.log("INCOMING BODY", body);

        const dbUserData = await Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        );

        if (!dbUserData) {
            return res.status(404).json({ message: 'No User found with this id.' });
        }

        return res.json(dbUserData);
    } catch (error) {
        console.error(error);
        return res.json(error);
    }
},
  // remove reaction
removeReaction : async ({ params }, res) => {
    try {
        const dbUserData = await Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        );

        return res.json(dbUserData);
    } catch (error) {
        console.error(error);
        return res.json(error);
    }
    },
};  

module.exports = ThoughtController;

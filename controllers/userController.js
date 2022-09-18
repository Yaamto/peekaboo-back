const User = require("../models/userModel").User;
const Post = require("../models/postModel").Post;
const { isEmpty } = require("../config/customFunction");
const ObjectId = require('mongoose').Types.ObjectId;


module.exports.getSingleUser = async(req, res) => {
  if(ObjectId.isValid(req.params.id)) {
    const user = await User.findById(req.params.id).select('-password -email')
    .populate({ path: 'followers', select: '_id username bio profilePic' })
    .populate({ path: 'following', select: '_id username bio profilePic' })

    .populate({ path : 'likes', populate : { path : 'reposters', select: '_id username bio profilePic'}})
    .populate({ path : 'likes', populate : { path : 'likes', select: '_id username bio profilePic'}})
    // .populate({ path : 'likes', populate : { path : 'comments', select: '_id username' }})

    .populate({ path : 'repost', populate : { path : 'reposters', select: '_id username bio profilePic'}})
    .populate({ path : 'repost', populate : { path : 'likes', select: '_id username bio profilePic'}})
    // .populate({ path : 'repost', populate : { path : 'comments', select: '_id username' }})
    return res.status(200).json(user)
  } else {
    return res.status(400).json({error: "user id not valid or missing."})  
  }
}


module.exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await User.findByIdAndDelete({ _id: id });

    if (data) {
      res.status(200).send({ deleted: data });
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(404).send({ err: err });
  }
};

module.exports.editUserBio = async (req, res) => {
  const bio = req.body.bio;
  const id = req.params.id;
  try {
    const data = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          bio: bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (data) {
      res.json(data);
    } else {
      res.json(err);
    }
  } catch (err) {
    res.status(404).send({ err: err });
  }
};

module.exports.editUserProfilePic = async (req, res) => {
  const profilePic = req.body.profilePic;
  const id = req.params.id;
  try {
    const data = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          profilePic: profilePic,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (data) {
      res.json(data);
    } else {
      res.json(err);
    }
  } catch (err) {
    res.status(404).send({ err: err });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.find().select("-password");
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ erreur: "pas d'utilisateur" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.addProfilePic = async (req, res) => {
  const id = res.locals.user._id;
  let filename = "";

  if (req.files) {
    let file = req.files.file;
    filename = file.name;
    let uploadDir = "./files/";

    file.mv(uploadDir + filename, (err) => {
      if (err) console.log("big erreur lol");
    });
  } else {
    console.log("le fichier n'est pas pris en compte");
  }

  try {
    const data = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          profilePic: `/files/${filename}`,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (data) {
      res.json(data);
    } else {
      res.json(err);
    }
  } catch (erreur) {
    console.log(erreur);
  }
};

module.exports.follow = async(req, res) => {
    const selfUser = await User.findById(res.locals.user._id);
    const followedUser = await User.findById(req.params.id);
  try {
    if (selfUser && followedUser) {
      if (!selfUser.following.includes(followedUser._id) && !followedUser.followers.includes(selfUser._id)) {
        if(selfUser._id.toString() != req.params.id.toString()) {
          selfUser.following.push(followedUser._id)
          selfUser.save();
          followedUser.followers.push(selfUser._id)
          followedUser.save();
          return res.status(200).json({ msg: "You are now following this user" });
        } else {
          return res.status(200).json({ error: "You cannot follow yourself" });
        }
      } else {

        followingIndex = selfUser.following.indexOf(followedUser._id);
        followersIndex = followedUser.followers.indexOf(selfUser._id);
        selfUser.following.splice(followingIndex, 1)
        selfUser.save();
        followedUser.followers.splice(followersIndex, 1)
        followedUser.save();
        return res.status(200).json({ msg: "You are now un-following this user" });
      }
    } else {
      return res.status(200).json({ error: "User does not exist." });
    }
  } catch (err) {
    return res.json(err)
  }
};


module.exports.repost = async(req, res) => {
  const selfUser = await User.findById(res.locals.user._id);
  const post = await Post.findById(req.params.post_id)
  try {
    if(selfUser && post) {
      if(!selfUser.repost.includes(post._id)) {
        selfUser.repost.push(post._id)
        post.reposters.push(selfUser._id)
        selfUser.save()
        post.save()
        return res.status(200).json({msg: "Post successfully reposted"})
      } else {
        selfUser.repost.splice(selfUser.repost.indexOf(post._id), 1)
        post.reposters.splice(post.reposters.indexOf(selfUser._id), 1)
        selfUser.save()
        post.save()
        return res.status(200).json({msg: "Post successfully deleted from your reposts"})
      }
    } else {
      return res.status(500).json({error: "Post doesn't exist."})
    }
  } catch(err) {
    return res.json(err)
  }
}

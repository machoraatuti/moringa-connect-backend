const Post = require('../models/Post');
const User = require('../models/user');

// Get feed posts (from user and connections)
exports.getFeed = async (req, res) => {
  try {
    // Get user's connections
    const user = await User.findById(req.user.id);
    const connections = user.connections || [];
    
    // Find posts from user and connections
    const posts = await Post.find({
      author: { $in: [req.user.id, ...connections] }
    })
    .populate('author', 'name email profilePicture')
    .populate('comments.user', 'name email profilePicture')
    .sort('-createdAt');
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feed', error: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Post content is required' });
    }
    
    const newPost = new Post({
      author: req.user.id,
      content,
      image
    });
    
    const savedPost = await newPost.save();
    await savedPost.populate('author', 'name email profilePicture');
    
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
};

// Get a specific post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email profilePicture')
      .populate('comments.user', 'name email profilePicture');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    post.content = content || post.content;
    if (image !== undefined) post.image = image;
    
    const updatedPost = await post.save();
    await updatedPost.populate('author', 'name email profilePicture');
    await updatedPost.populate('comments.user', 'name email profilePicture');
    
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    await post.deleteOne();
    
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if already liked
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }
    
    post.likes.push(req.user.id);
    await post.save();
    
    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if not liked
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Post not yet liked' });
    }
    
    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    await post.save();
    
    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error: error.message });
  }
};

// Add comment to post
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.comments.unshift({
      user: req.user.id,
      text
    });
    
    await post.save();
    await post.populate('comments.user', 'name email profilePicture');
    
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Delete comment from post
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Find comment
    const comment = post.comments.find(comment => comment._id.toString() === req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the comment author
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Remove comment
    post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.commentId);
    await post.save();
    
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};
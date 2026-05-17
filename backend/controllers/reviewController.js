import { Review, User } from '../models/index.js';

export const addReview = async (req, res) => {
  try {
    const { targetUserId, rating, comment, jobId } = req.body;

    const review = await Review.create({
      ReviewerId: req.user.id,
      TargetUserId: targetUserId,
      JobId: jobId,
      rating,
      comment
    });

    // Update target user's average rating
    const allReviews = await Review.findAll({ where: { TargetUserId: targetUserId } });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    await User.update(
      { rating: avgRating, reviewsCount: allReviews.length },
      { where: { id: targetUserId } }
    );

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { TargetUserId: req.params.userId },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name'] }]
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

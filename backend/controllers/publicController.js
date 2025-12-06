// backend/controllers/publicController.js
const User = require('../models/User');

class PublicController {
  async getCoaches(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 4;

      const coaches = await User.find({
        role: 'coach',
        isActive: true,
      })
        .select('firstName lastName coachProfile')
        .limit(limit)
        .lean();

      const data = coaches.map((coach) => ({
        id: coach._id,
        name: `${coach.firstName} ${coach.lastName}`.trim(),
        specialty:
          (coach.coachProfile?.specialization || []).join(' • ') ||
          'Personal Coach',
        experienceYears: coach.coachProfile?.experience || 0,
        bio: coach.coachProfile?.bio || '',
      }));

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Error fetching public coaches', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to load coaches',
      });
    }
  }
}

module.exports = new PublicController();

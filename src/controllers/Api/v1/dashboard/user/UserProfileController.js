const { UserProfile, User } = require('../../../../../models');

const UserProfileController = {
  // GET /userprofile
  async index(req, res) {
    try {
      const userId = req.user?.user_id || 1;

      if (!userId) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      }

      let profiles = await UserProfile.findAll({ where: { user_id: userId } });

      if (!profiles.length) {
        const user = await User.findByPk(userId);

        const profileData = {
          user_id: user.id,
          name: `${user.firstname} ${user.lastname || ''}`.trim(),
          email: user.email,
          phoneNumber: user.phone,
          avatarUrl: user.img || 'https://i.pravatar.cc/150?img=5',
          isPrimaryProfile: true,
          address: user.location || '',
          is_active: true,
        };

        const profile = await UserProfile.create(profileData);
        return res.status(200).json({
          status: 'success',
          message: 'Profile created from user data',
          data: [profile],
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Profile(s) found',
        data: profiles,
      });
    } catch (err) {
      console.error('Index Error:', err);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  // POST /userprofile
  async store(req, res) {
    try {
      const userId = req.user?.user_id || 1;
      const data = req.body;

      if (!userId) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      }

      const profile = await UserProfile.create({
        ...data,
        user_id: userId,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Profile created',
        data: profile,
      });
    } catch (err) {
      console.error('Store Error:', err);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  // PUT /userprofile
  async update(req, res) {
    try {
      const userId = req.user?.user_id || 1;
      const data = req.body;

      const profile = await UserProfile.findOne({ where: { user_id: userId } });

      if (!profile) {
        return res.status(404).json({ status: 'fail', message: 'Profile not found' });
      }

      await profile.update(data);

      return res.status(200).json({
        status: 'success',
        message: 'Profile updated',
        data: profile,
      });
    } catch (err) {
      console.error('Update Error:', err);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  // DELETE /userprofile/:id
  async destroy(req, res) {
    try {
      const userId = req.user?.user_id || 1;
      const profileId = req.params.id;

      const profile = await UserProfile.findOne({
        where: { id: profileId, user_id: userId },
      });

      if (!profile) {
        return res.status(404).json({ status: 'fail', message: 'Profile not found' });
      }

      await profile.destroy();

      return res.status(200).json({ status: 'success', message: 'Profile deleted Successfully' });
    } catch (err) {
      console.error('Delete Error:', err);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },
};

module.exports = UserProfileController;

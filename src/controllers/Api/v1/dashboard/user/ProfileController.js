const ResponseError = require('../../../../../helpers/ResponseError');
const UserResource = require('../../../../../resources/userResource');
const NotificationResource = require('../../../../../resources/NotificationResource');
const { UserProfile } = require('../../../../../models');
const UserService = require('../../../../../services/UserServices/UserService');
const __ = (key, opts = {}) => key;

async function store(req, res) {
  try {
    const userId = req.user.id;

    // Check if user already has a profile
    const existing = await UserProfile.findOne({ where: { user_id: userId } });

    let profile;
    if (existing) {
      await existing.update(req.body);
      profile = existing;
    } else {
      profile = await UserProfile.create({
        user_id: userId,
        ...req.body,
      });
    }

    return res.json({
      message: 'Profile saved successfully',
      data: profile,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


async function show(req, res) {
  try {
    const userId = req.user.id;
    const profile = await UserProfile.findAll({ where: { user_id: userId } });

    if (!profile) {
      return res.status(404).json({
        code: ResponseError.ERROR_404,
        message: 'Profile not found',
      });
    }

    return res.json({
      message: 'Success',
      data: profile,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


async function chatShowById(req, res) {
    try {
        const user = await userRepository.chatShowById(req.params.id);
        if (!user) {
            return res.status(404).json({ code: ResponseError.ERROR_404 });
        }
        return res.json({
            message: __(ResponseError.NO_ERROR),
            data: UserResource.make(user)
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function adminInfo(req, res) {
    try {
        const user = await userRepository.adminInfo();
        if (!user) {
            return res.status(404).json({ code: ResponseError.ERROR_404 });
        }
        return res.json({
            message: __(ResponseError.NO_ERROR),
            data: UserResource.make(user)
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function chatUsersGet(req, res) {
    try {
        const users = await userRepository.chatUsersGet(req.body);
        if (!users) {
            return res.status(404).json({ code: ResponseError.ERROR_404 });
        }
        return res.json({
            message: __(ResponseError.NO_ERROR),
            data: users
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function update(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;

    // Step 1: Find the profile by ID and match it with the logged-in user
    const profile = await UserProfile.findOne({
      where: {
        id: profileId,
        user_id: userId, // Ensures user can only update their own profile
      },
    });

    if (!profile) {
      return res.status(404).json({
        code: ResponseError.ERROR_404,
        message: 'Profile not found or unauthorized',
      });
    }

    await profile.update(req.body);

    // Step 3: Return updated profile
    return res.json({
      message: __('Profile updated successfully'),
      data: profile,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const userId = req.user.id;
    const profileId = req.params.id;

    const profile = await UserProfile.findOne({
      where: {
        id: profileId,
        user_id: userId,
      },
    });

    if (!profile) {
      return res.status(404).json({
        code: ResponseError.ERROR_404,
        message: 'Profile not found or unauthorized',
      });
    }
    const deletedProfileData = profile.get({ plain: true });
    await profile.destroy();
    return res.json({
      message: __('Profile deleted successfully'),
      data: deletedProfileData,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


async function fireBaseTokenUpdate(req, res) {
    try {
        const result = await UserService.firebaseTokenUpdate(req.body.firebase_token);
        if (!result.status) {
            return res.status(400).json(result);
        }
        return res.json({
            message: __(ResponseError.RECORD_WAS_SUCCESSFULLY_UPDATED),
            data: []
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function passwordUpdate(req, res) {
    try {
        const user = req.user;
        const result = await UserService.updatePassword(user.uuid, req.body.password);
        if (!result.status) {
            return res.status(400).json(result);
        }
        return res.json({
            message: __(ResponseError.NO_ERROR),
            data: UserResource.make(result.data)
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function searchSending(req, res) {
    try {
        const data = await userRepository.searchSending(req.body);
        return res.json(UserResource.collection(data));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function notificationStatistic(req, res) {
    try {
        const data = await userRepository.notificationStatistic();
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function notifications(req, res) {
    try {
        const data = await userRepository.usersNotifications();
        return res.json(NotificationResource.collection(data));
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function notificationsUpdate(req, res) {
    try {
        const result = await UserService.updateNotifications(req.body);
        if (!result.status) {
            return res.status(400).json(result);
        }
        return res.json({
            message: __(ResponseError.NO_ERROR),
            data: UserResource.make(result.data)
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function currencyUpdate(req, res) {
    try {
        const result = await UserService.updateCurrency(Number(req.body.currency_id));
        if (!result.status) {
            return res.status(400).json(result);
        }
        return res.json({
            message: __(ResponseError.NO_ERROR),
            data: UserResource.make(result.data)
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function langUpdate(req, res) {
    try {
        const result = await UserService.updateLang(req.body.lang);
        if (!result.status) {
            return res.status(400).json(result);
        }
        return res.json({
            message: __(ResponseError.NO_ERROR),
            data: UserResource.make(result.data)
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// Export all handlers
module.exports = {
    store,
    show,
    chatShowById,
    adminInfo,
    chatUsersGet,
    update,
    remove,
    fireBaseTokenUpdate,
    passwordUpdate,
    searchSending,
    notificationStatistic,
    notifications,
    notificationsUpdate,
    currencyUpdate,
    langUpdate,
};

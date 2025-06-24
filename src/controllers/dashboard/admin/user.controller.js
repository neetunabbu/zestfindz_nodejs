const { Op } = require('sequelize');
const User = require('../../../models/User');
const userService = require('../../../services/user.service');

module.exports = {

    // Paginate Users
    async paginate(req, res) {
        try {
            const users = await userService.paginateUsers(req.query);
            res.json({ status: true, data: users });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Create New User
    async store(req, res) {
        try {
            const data = req.body;

            if (data.email) {
                data.email_verified_at = new Date();
            }

            if (data.phone) {
                data.phone_verified_at = new Date();
            }

            const newUser = await userService.createUser(data);

            res.status(201).json({ status: true, data: newUser });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Show User by UUID
    async show(req, res) {
        try {
            const user = await userService.findUserByUUID(req.params.uuid);

            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }

            res.json({ status: true, data: user });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Update User
    async update(req, res) {
        try {
            const data = req.body;

            if (data.email) {
                data.email_verified_at = new Date();
            }

            if (data.phone) {
                data.phone_verified_at = new Date();
            }

            const updatedUser = await userService.updateUser(req.params.uuid, data);

            res.json({ status: true, data: updatedUser });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Delete Users
    async destroy(req, res) {
        try {
            await userService.deleteUsers(req.body.ids);

            res.json({ status: true, message: 'Users deleted successfully' });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Update User Role
    async updateRole(req, res) {
        try {
            const user = await userService.findUserByUUID(req.params.uuid);

            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }

            // Example seller check (you can update based on your seller table)
            if (user.role === 'seller' || req.body.role === 'seller') {
                return res.status(400).json({ status: false, message: 'Role cannot be changed to seller.' });
            }

            user.role = req.body.role;
            await user.save();

            res.json({ status: true, message: 'Role updated successfully', data: user });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Update Password
    async passwordUpdate(req, res) {
        try {
            const updatedUser = await userService.updatePassword(req.params.uuid, req.body.password);

            res.json({ status: true, message: 'Password updated successfully', data: updatedUser });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Login as User
    async loginAsUser(req, res) {
        try {
            const result = await userService.loginAsUser(req.params.uuid);

            res.json({ status: true, data: result });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Users Search
    async usersSearch(req, res) {
        try {
            const users = await userService.searchUsers(req.query);
            res.json({ status: true, data: users });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Drop All Users
    async dropAll(req, res) {
        try {
            await userService.dropAllUsers();
            res.json({ status: true, message: 'All users deleted successfully' });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Set Active / Inactive
    async setActive(req, res) {
        try {
            const user = await userService.findUserByUUID(req.params.uuid);

            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }

            user.active = !user.active;
            await user.save();

            res.json({ status: true, message: 'User status updated successfully', data: user });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Top-up Wallet (You need to create wallet model for this)
    async topUpWallet(req, res) {
        try {
            const { price, note } = req.body;
            const result = await userService.topUpWallet(req.params.uuid, { price, note });

            res.json({ status: true, message: 'Wallet topped up successfully', data: result });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    // Wallet Histories (You need to create wallet model for this)
    async walletHistories(req, res) {
        try {
            const histories = await userService.getWalletHistories(req.params.uuid);

            res.json({ status: true, data: histories });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
};

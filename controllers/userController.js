const User = require('../models/user');

// Get Users with Role Population
exports.getUsers = async (req, res) => {
    const { search } = req.query; // Extract search query from request query parameters

    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'roleInfo'
                }
            },
            {
                $unwind: '$roleInfo'
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    role: {
                        roleName: '$roleInfo.roleName',
                        accessModules: '$roleInfo.accessModules'
                    }
                }
            }
        ];

        // Add search stage if search query is provided
        if (search) {
            pipeline.unshift({ // Add to the start of the pipeline
                $match: {
                    firstName: { $regex: search, $options: 'i' } // Case-insensitive search
                }
            });
        }

        const users = await User.aggregate(pipeline);
        res.status(200).json({ status: true, data: users, message: 'Users retrieved successfully' });
    } catch (err) {
        res.status(500).json({ status: false, data: null, error: err.message });
    }
};

// Update Single User
exports.updateUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                status: false,
                data: null,
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: true,
            data: user,
            message: 'User updated successfully'
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            data: null,
            error: err.message
        });
    }
};

//Delete Single User
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                data: null,
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: true,
            data: null,
            message: 'User deleted successfully'
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            data: null,
            error: err.message
        });
    }
};

// Update Multiple Users with Same Data
exports.updateManyUsersSameData = async (req, res) => {
    try {
        // req.body contains the fields to update
        const updateFields = req.body;

        // Ensure that there's at least one field to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ status: false, data: null, message: 'No fields provided for update' });
        }
        // Update all users with the provided fields
        await User.updateMany({}, { $set: updateFields });

        res.status(200).json({ status: true, data: null, message: 'Multiple users updated successfully' });
    } catch (err) {
        res.status(500).json({ status: false, data: null, error: err.message });
    }
};

// Update Multiple Users with Different Data
exports.updateManyUsersDifferentData = async (req, res) => {
    const bulkOps = req.body.users.map(user => ({
        updateOne: {
            filter: { _id: user._id },
            update: { $set: user.data }
        }
    }));
    try {
        await User.bulkWrite(bulkOps);
        res.status(200).json({ status: true, data: null, message: 'Multiple users updated successfully' });
    } catch (err) {
        res.status(500).json({ status: false, data: null, error: err.message });
    }
};

// Check Access to Module
exports.checkAccess = async (req, res) => {
    const { userId, moduleName } = req.body;
    try {
        const user = await User.findById(userId).populate('role', 'accessModules').lean()
        const hasAccess = user.role.accessModules.includes(moduleName);

        // Construct a dynamic message based on access status
        const message = hasAccess
            ? `User has access to the ${moduleName} module.`
            : `User does not have access to the ${moduleName} module.`

        res.status(200).json({
            status: true,
            data: hasAccess,
            message: message
        });
    } catch (err) {
        res.status(500).json({ status: false, data: null, error: err.message });
    }
};

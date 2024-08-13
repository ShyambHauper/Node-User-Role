const Role = require('../models/role');

// Create Role
exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        const roleData = await role.save();
        res.status(201).json({ status: true, data: roleData, message: 'Role created successfully' });
    } catch (err) {
        res.status(400).json({ status: false, data: null, error: err.message });
    }
};

// Get All Roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find({}).lean()
        res.status(200).json({ status: true, data: roles, message: 'Roles get successfully' });
    } catch (err) {
        res.status(500).json({ status: false, data: null, error: err.message });
    }
};

// Update Role
exports.updateRole = async (req, res) => {
    try {
        // Check if the role exists
        const existingRole = await Role.findById(req.params.id).lean()
        if (!existingRole) {
            return res.status(404).json({
                status: false,
                data: null,
                message: 'Role not found'
            });
        }
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ status: true, data: role, message: 'Role updated successfully' });
    } catch (err) {
        res.status(400).json({ status: false, data: null, error: err.message });
    }
};

// Delete Role
exports.deleteRole = async (req, res) => {
    try {
        const existingRole = await Role.findById(req.params.id).lean()
        if (!existingRole) {
            return res.status(404).json({
                status: false,
                data: null,
                message: 'Role not found'
            });
        }
        await Role.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, data: null, message: 'Role deleted successfully' });
    } catch (err) {
        res.status(400).json({ status: false, data: null, error: err.message });
    }
};

// Update Access Modules
exports.updateAccessModules = async (req, res) => {
    const { moduleName, action } = req.body;
    const roleId = req.params.id;

    try {
        // Convert moduleName to lowercase
        const lowerCaseModuleName = moduleName.toLowerCase();

        // Fetch the role and normalize accessModules to lowercase
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({
                status: false,
                data: null,
                message: 'Role not found'
            });
        }

        const lowerCaseAccessModules = role.accessModules.map(module => module.toLowerCase());

        if (action === 'add') {
            // Add moduleName if it's not already present (case-insensitive)
            if (!lowerCaseAccessModules.includes(lowerCaseModuleName)) {
                role.accessModules.push(moduleName); // Preserve original case
                await role.save();
            }
            return res.status(200).json({
                status: true,
                data: role,
                message: 'Access module added successfully'
            });
        } else if (action === 'remove') {
            // Remove moduleName if it's present (case-insensitive)
            if (lowerCaseAccessModules.includes(lowerCaseModuleName)) {
                role.accessModules = role.accessModules.filter(module => module.toLowerCase() !== lowerCaseModuleName);
                await role.save();
            }
            return res.status(200).json({
                status: true,
                data: role,
                message: 'Access module removed successfully'
            });
        } else {
            return res.status(400).json({
                status: false,
                data: null,
                message: 'Invalid action'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            data: null,
            message: 'Error updating access modules',
            error: err.message
        });
    }
};

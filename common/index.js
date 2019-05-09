var common = {
    LANES: {
        BACKLOG: 'lane_backlog',
        TODO: 'lane_todo',
        DONE: 'lane_done',
    },
    ROLES: {
        CUSTOMER: {name: 'Customer', description: 'The customer is...'},
        DESIGNER: {name: 'Designer', description: 'The customer is...'},
        ARCHITECT: {name: 'Architect', description: 'The architect is...'},
    },
    STATUS: {
        INIT: ['NEW_MODEL_ASIS'],
        NEW_MODEL_ASIS: ['UPDATE_MODEL_ASIS', 'NEW_MODEL_TOBE'],
        UPDATE_MODEL_ASIS: ['UPDATE_MODEL_ASIS', 'NEW_MODEL_TOBE'],
        NEW_MODEL_TOBE: ['UPDATE_MODEL_TOBE', 'NEW_KPI_LCA', 'NEW_KPI_PLC'],
        UPDATE_MODEL_TOBE: ['UPDATE_MODEL_TOBE', 'NEW_KPI_LCA', 'NEW_KPI_PLC'],
        NEW_KPI_LCA: ['UPDATE_KPI_LCA'],
        UPDATE_KPI_LCA: ['UPDATE_KPI_LCA'],
        NEW_KPI_PLC: ['UPDATE_KPI_PLC'],
        UPDATE_KPI_PLC: ['UPDATE_KPI_PLC'],
    },
    ACTIONS: {
        NEW_MODEL_ASIS: {
            value: { type: String, default: ''},
            format:{ type: String, default:'.ifc'},
            files: [String]
        },
        UPDATE_MODEL_ASIS: {
            value: [String],
            format:{ type: String, default:'.ifc'},
            files: [String]
        },
        NEW_MODEL_TOBE: {
            value: { type: String, default: ''},
            format:{ type: String, default:'.ifc'},
            files: [String]
            },
        UPDATE_MODEL_TOBE: {
            value: [String],
            format:{ type: String, default:'.ifc'},
            files: [String]
            },
        NEW_KPI_LCA: {
            value: { type: Number, default: 0},
            format:{ type: String, default:'kgCO2eq'},
            files: [String]
            },
        UPDATE_KPI_LCA: {
            value: { type: Number, default: 0},
            format:{ type: String, default:'kgCO2eq'},
            files: [String]
            },
        NEW_KPI_PLC: {
            value: { type: Number, default: 0},
            format:{ type: String, default:'kJ/m²'},
            files: [String]
            },
        UPDATE_KPI_PLC: {
            value: { type: Number, default: 0},
            format:{ type: String, default:'kJ/m²'},
            files: [String]
            },

    }
}

module.exports = common

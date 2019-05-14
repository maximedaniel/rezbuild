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
            format: '.ifc'
        },
        UPDATE_MODEL_ASIS: {
            format: '.ifc'
        },
        NEW_MODEL_TOBE: {
            format: '.ifc'
            },
        UPDATE_MODEL_TOBE: {
            format: '.ifc'
            },
        NEW_KPI_LCA: {
            format: 'kgCO2eq'
            },
        UPDATE_KPI_LCA: {
            format: 'kgCO2eq'
            },
        NEW_KPI_PLC: {
            format: 'kJ/m²'
            },
        UPDATE_KPI_PLC: {
            format: 'kJ/m²'
            },

    }
}

module.exports = common

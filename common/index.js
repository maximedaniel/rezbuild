 var common = {
    ACTIONS: [
                    {
                        name:'ATTACHED_FILES',
                        type:'files',
                        format:'.*'
                    },
                    {
                        name:'ASIS_MODEL',
                        type:'file',
                        format:'.ifc'
                    },
                    {
                        name:'TOBE_MODEL',
                        type:'file',
                        format:'.ifc'
                    },
                    {
                        name:'KPI_LCA',
                        type:'value',
                        format:'kgCO2eq'
                    },
                    {
                        name:'KPI_AFG',
                        type:'value',
                        format:'kJ/m²'
                    }
        ],
    }

module.exports = common

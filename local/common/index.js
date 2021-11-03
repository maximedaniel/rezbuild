// @ts-nocheck
var common = {    
    LANES: {
        BACKLOG: 'lane_backlog',
        TODO: 'lane_todo',
        DONE: 'lane_done',
    },
    ROLES: {
        CUSTOMER: {name: 'Customer', description: '', actions: []},
        ANALYST: {name: 'Analyst', description: '', actions: ['KPI_ECON_AND_FIN_ASIS', 'KPI_SOCIAL_ASIS', 'KPI_ENERGY_AND_ENV_ASIS', 'KPI_COMFORT_ASIS', 'KPI_ECON_AND_FIN_TOBE', 'KPI_SOCIAL_TOBE', 'KPI_ENERGY_AND_ENV_TOBE', 'KPI_COMFORT_TOBE']},
        DESIGNER: {name: 'Designer', description: '', actions: ['MODEL_ASIS', 'MODEL_TOBE']},
    },
    STATUS: {
        INIT: ['MODEL_ASIS'],
        MODEL_ASIS: ['MODEL_ASIS', 'KPI_ECON_AND_FIN_ASIS', 'KPI_SOCIAL_ASIS', 'KPI_ENERGY_AND_ENV_ASIS', 'KPI_COMFORT_ASIS', 'MODEL_TOBE'],
        MODEL_TOBE: ['MODEL_TOBE', 'KPI_ECON_AND_FIN_TOBE', 'KPI_SOCIAL_TOBE', 'KPI_ENERGY_AND_ENV_TOBE', 'KPI_COMFORT_TOBE'],
        KPI_ECON_AND_FIN_ASIS: ['KPI_ECON_AND_FIN_ASIS'],
        KPI_SOCIAL_ASIS: ['KPI_SOCIAL_ASIS'],
        KPI_ENERGY_AND_ENV_ASIS: ['KPI_ENERGY_AND_ENV_ASIS'],
        KPI_COMFORT_ASIS: ['KPI_COMFORT_ASIS'],
        KPI_ECON_AND_FIN_TOBE: ['KPI_ECON_AND_FIN_TOBE'],
        KPI_SOCIAL_TOBE: ['KPI_SOCIAL_TOBE'],
        KPI_ENERGY_AND_ENV_TOBE: ['KPI_ENERGY_AND_ENV_TOBE'],
        KPI_COMFORT_TOBE: ['KPI_COMFORT_TOBE']
    },
    ACTIONS: {
        MODEL_ASIS: {
            description: 'Upload the 3D model of the building as it is.',
            names: ['ASIS model'],
            formats: ['.ifc'],
            typeValues: [Object],
            values: [''],
            minValues: [''],
            maxValues: [''],
            priorities: [true],
        },
        KPI_ECON_AND_FIN_ASIS: { 
            description: 'Assess the economic and financial quality of the 3D model of the building as it is.',
            names: [
                "Life Cycle Cost (LCC)",
                "Change in Value of Buildings Property",
                "Life Cycle Assessment (LCA)",
                "Annual costs - Energy bills after retrofit actions"
            ],
            formats: [
                "k€",
                "k€",
                "",
                "k€"
            ],
            typeValues: [
                Number,
                Number,
                String,
                Number
            ],
            minValues: [
                "0",
                "0",
                "",
                "0"
            ],
            values: [
                "0",
                "0",
                "",
                "0"
            ],
            maxValues: [
                "1000",
                "1000",
                "",
                "1000"
            ],
            priorities: [
                true,
                false,
                false,
                false
            ],
        },
        KPI_ENERGY_AND_ENV_ASIS: { 
            description: 'Assess the energy quality of the 3D model of the building as it is.',
            names:[
                "Electric energy consumption per gross surface unit",
                "Thermal energy consumption per gross surface unit",
                "Percentage of renewable energy use",
                "Annual final energy consumption",
                "Energy class of the building",
                "Lifecycle CO2 emission",

                "Energy source typology",
                "Primary electric energy demand",
                "Primary thermal energy demand",
                "Total electric and thermal energy consumption per gross volume unit",
                "Total electric and thermal energy consumption per gross surface unit",
                "Energy consumption for lighting per gross surface units",
                "Peak load and profile of electric energy demand",
                "Peak load and profile of thermal energy demand",
                "Total energy cost per gross surface unit",
                "Electrical energy bill per gross internal surface unit",
                "Thermal energy bill per gross internal surface unit",
                "Building heat transfer coefficient (U value)",
                "Use of renewable energy",
                "CO2 emissions associated with the heating for buildings",
                "CO2 produced from electricity usage per m2 of floor area",
                "Energy performance gap (EPG)",
                "Emission of CO2",
                "Sustainable resource use"
            ], 
            formats: [
                "kWhe/m2 *y",
                "kWht/m2 *y",
                "%",
                "kWh/y",
                "A-G [1-7]",
                "ton",

                "[1-Conventional, 2-Renewable, 3-Mixed]",
                "toe",
                "toe",            
                "(toe/m3* y)*1000",
                "(toe/m2* y)*1000",
                "kWhe/m2 Nrg * DD*y",
                "kWe",
                "kWt",
                "€/ m2 *y",
                "€/ m2 *y",
                "€/ m2 *y",
                "kW/m2/K",
                "",
                "tCO2/year",
                "tCO2/m2",
                "%",
                "ton/year",
                "%"
            ],
            typeValues: [
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Boolean,
                Number,
                Number,
                Number,
                Number,
                Number
            ],
            minValues: [
                "0",
                "0",
                "0",
                "0",
                "1",
                "0",

                "1",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0"
            ],
            values: [
                "0",
                "0",
                "0",
                "0",
                "1",
                "0",

                "1",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0"
            ],
            maxValues: [
                "2000",
                "5000",
                "100",
                "1000000",
                "7",
                "1000000",

                "3",
                "1000",
                "1000",
                "1000",
                "1000",
                "1000",
                "1000",
                "10000",
                "1000",
                "1000",
                "1000",
                "10",
                "1",
                "1000",
                "100",
                "100",
                "1000",
                "100"
            ],
            priorities: [
                true,
                true,
                true,
                true,
                true,
                true,

                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ]
        },
        KPI_SOCIAL_ASIS: { 
            description: 'Assess the social quality of the 3D model of the building as it is.',
            names:[
                "Occupant satisfaction",
                "Accessibility (HC/UU)",
                "Feeling of safety",
                "Community acceptance",
                "Arrears on utility bills",
                "Hidden energy poverty(HEP)",
                "High share of energy expenditure in income (2M)",
                "Inability to keep home adequately warm",
                "Fuel oil prices",
                "Biomass prices",
                "Household electricity prices",
                "District heating prices",
                "Household gas prices",
                "Dwelling comfortably cool during summer time",
                "Dwelling comfortably warm during winter time",
                "Number of rooms per person, total",
                "Equipped with air conditioning",
                "Equipped with heating",
                "Presence of leak, damp, rot"                
            ],
            formats: [
                "1-10",
                "1-10",
                "1-10",
                "%",
                "months",
                "k€",
                "k€",
                "%",
                "€/kWh",
                "€/kWh",
                "€/kWh",
                "€/kWh",
                "€/kWh",
                "1-10",
                "1-10",
                "1-10",
                "",
                "",
                ""
            ],
            typeValues: [
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Boolean,
                Boolean,
                Boolean
            ],
            minValues: [
                "1",
                "1",
                "1",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "1",
                "1",
                "0",
                "0",
                "0",
                "0"
            ],
            values: [
                "1",
                "1",
                "1",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "1",
                "1",
                "0",
                "0",
                "0",
                "0"
            ],
            maxValues: [
                "10",
                "10",
                "10",
                "100",
                "60",
                "1000",
                "1000",
                "100",
                "1",
                "1",
                "1",
                "1",
                "1",
                "10",
                "10",
                "10",
                "1",
                "1",
                "1"
            ],
            priorities: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ]
        },
        KPI_COMFORT_ASIS: { 
            description: 'Assess the comfort quality of the 3D model of the building as it is.',
            names:[
                "Room temperature",
                "Thermal comfort / Humidity",
                "CO2 concentration",
                "Formaldehyde (HCHO) concentration: Max,Min,Avg",
                "% time inside the hygrothermal zone",
                "PM2.5: Max,Min,Avg",
                "PM10: Max,Min,Avg"
            ],
            formats: [
                "°C",
                "%",
                "mg/m3, ppm",
                ", mg/m3, ppm",
                "%",
                "ug/m3, ppm",
                "ug/m3, ppm" 
            ],
            typeValues: [
                Number,
                Number,
                Number,
                String,
                Number,
                String,
                String 
            ],
            minValues: [
                "0",
                "0",
                "0",
                "",
                "0",
                "",
                "" 
            ],
            values: [
                "0",
                "0",
                "0",
                "",
                "0",
                "",
                "" 
            ],
            maxValues: [
                "50",
                "100",
                "5000",
                "",
                "100",
                "",
                "" 
            ],
            priorities: [
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ]
        },
        MODEL_TOBE: {
            description: 'Upload the 3D model of the building as it will be.',
            names: ['TOBE model'],
            formats: ['.ifc'],
            typeValues: [Object],
            values: [''],
            minValues: [''],
            maxValues: [''],
            priorities: [true],
        },      
        KPI_ECON_AND_FIN_TOBE: { 
            description: 'Assess the economic and financial quality of the 3D model of the building as it will be.',
            names: [
                "Payback Period",
                "Internal Rate of Return (IRR)",
                "Life Cycle Cost (LCC)",
                "Required Rate of Return (RRR)",
                "Net Present Value (NPV) ",
                "Return on Equity (ROE)",
                "Return on Capital Employed (ROCE)",
                "Incremental Discounted Payback Period",
                "National Inflation Rate",
                "Change in Value of Buildings Property",
                "Life Cycle Assessment (LCA)",
                "Pay Back Time (PBT)",
                "Return on Investments (ROI)"
            ],
            formats: [
                "%",
                "k€",
                "years",
                "%",
                "k€",
                "%",
                "%",
                "years",
                "%",
                "k€",
                "",
                "years",
                "%"                
            ],
            typeValues: [
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                String,
                Number,
                Number
            ],
            minValues: [
                "0",
                "0",
                "1",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "",
                "0",
                "0"
            ],
            values: [
                "0",
                "0",
                "1",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "",
                "0",
                "0"
            ],
            maxValues: [
                "100",
                "1000",
                "50",
                "100",
                "1000",
                "1000",
                "1000",
                "50",
                "50",
                "1000",
                "",
                "50",
                "1000"
            ],
            priorities: [
                true,
                true,
                true,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ],
        },
        KPI_ENERGY_AND_ENV_TOBE: { 
            description: 'Assess the energy quality of the 3D model of the building as it will be.',
            names:[
                "Primary energy demand reduction",
                "Electric energy consumption per gross surface unit",
                "Thermal energy consumption per gross surface unit",
                "Lifecycle CO2 emission",
                "Percentage of renewable energy use",
                "Annual final energy consumption",
                "Energy class of the building",

                "Reduction in annual final energy consumption",
                "Energy source typology",
                "Primary electric energy demand",
                "Primary thermal energy demand",
                "Total electric and thermal energy consumption per gross volume unit",
                "Total electric and thermal energy consumption per gross surface unit",
                "Total energy cost per gross surface unit",
                "Electrical energy bill per gross internal surface unit",
                "Thermal energy bill per gross internal surface unit",
                "Total annual revenues, sum of discounted annual revenues and annuity",
                "Energy production costs",
                "Building heat transfer coefficient (U value)",
                "Use of renewable energy",
                "Carbon dioxide emission in tonnes reduction",
                "Reduction in lifecycle CO2 emissions in tonnes",
                "CO2 emissions associated with the heating for buildings",
                "CO2 produced from electricity usage per m2 of floor area",
                "Energy performance gap (EPG)",
                "Energy savings",
                "Reduction of CO2",
                "Emission of CO2",
                "Sustainable resource use"
            ],
            formats: [
                "%",
                "kWhe/m2 *y",
                "kWht/m2 *y",
                "ton",
                "%",
                "kWh/y",
                "A-G [1-7]",

                "% in kWh",
                "[1-Conventional, 2-Renewable, 3-Mixed]",
                "toe",
                "toe",
                "(toe/m3* y)*1000",
                "(toe/m2* y)*1000",
                "€/ m2 *y",
                "€/ m2 *y",
                "€/ m2 *y",
                "k€/year",
                "€/kWh",
                "kW/m2/K",
                "",
                "%",
                "%",
                "tCO2/year",
                "tCO2/m2",
                "%",
                "kWh",
                "tCO2/year",
                "ton/year",
                "%"
            ],
            typeValues: [
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,

                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Boolean,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Number
            ],
            minValues: [
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "1",

                "0",
                "1",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0"
            ],
            values: [
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "1",

                "0",
                "1",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0"
            ],
            maxValues: [
                "100",
                "2000",
                "5000",
                "1000000",
                "100",
                "1000000",
                "7",

                "100",
                "3",
                "1000",
                "1000",
                "1000",
                "1000",
                "1000",
                "1000",
                "1000",
                "1000",
                "10",
                "10",
                "1",
                "100",
                "100",
                "1000",
                "100",
                "100",
                "1000000",
                "1000",
                "1000",
                "100"
            ],
            priorities: [
                true,
                true,
                true,
                true,
                true,
                true,
                true,

                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ],
        },
        KPI_SOCIAL_TOBE: { 
            description: 'Assess the social quality of the 3D model of the building as it will be.',
            names:[
                "Installation time reduction",
                "Occupant satisfaction",
                "Increased environmental/sustainability education",
                "Hidden energy poverty(HEP)",
                "Dwelling comfortably warm during winter time",
                "Number of rooms per person, total",
                "Equipped with air conditioning"
            ],
            formats: [
                "%",
                "1-10",
                "%",
                "k€",
                "1-10",
                "1-10",
                ""
            ],
            typeValues: [
                Number,
                Number,
                Number,
                Number,
                Number,
                Number,
                Boolean
            ],
            minValues: [
                "0",
                "1",
                "0",
                "0",
                "1",
                "0",
                "0" 
            ],
            values: [
                "0",
                "1",
                "0",
                "0",
                "1",
                "0",
                "0" 
            ],
            maxValues: [
                "100",
                "10",
                "100",
                "1000",
                "10",
                "10",
                "1" 
            ],
            priorities: [
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ]
        },
        KPI_COMFORT_TOBE: { 
            description: 'Assess the comfort quality of the 3D model of the building as it will be.',
            names:[
                "Formaldehyde (HCHO) concentration: Max,Min,Avg",
                "% time inside the hygrothermal zone",
                "PM2.5: Max,Min,Avg",
                "PM10: Max,Min,Avg"
            ],
            formats: [
                "mg/m3, ppm",
                "%",
                "ug/m3, ppm",
                "ug/m3, ppm" 
            ],
            typeValues: [
                String,
                Number,
                String,
                String 
            ],
            minValues: [
                "",
                "0",
                "",
                "" 
            ],
            values: [
                "",
                "0",
                "",
                "" 
            ],
            maxValues: [
                "",
                "100",
                "",
                "" 
            ],
            priorities: [
                false,
                false,
                false,
                false
            ]
        },
    }
}

module.exports = common

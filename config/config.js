import _ from "lodash";
require("dotenv").config();
const config = JSON.parse(process.env.CONFIG_DATA);
// const config =process.env.CONFIG_DATA;

// const environment = 'development';  // for develeopment 
const environment = 'staging';  // for UAT
// const environment = 'production'; // for Production
const defaultConofig = config.development;  // default

const environmentConfig = config[environment];

const finalConfig = _.merge(defaultConofig, environmentConfig);
global.gConfig = finalConfig;
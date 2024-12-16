const mongoose = require('mongoose');

// Define the base Axie Schema
const axieSchema = new mongoose.Schema({
    axie_id: { type: Number, required: true },      // Unique identifier for Axie
    name: { type: String, required: true },          // Name of the Axie
    stage: { type: Number, required: true },         // Stage of the Axie
    current_price_usd: { type: Number, required: true } // Current price in USD
}, { 
    toJSON: { virtuals: false, versionKey: false }, // Exclude __v field
    collection: 'axies' // Specifying the collection name
});


// Create individual models for each Axie class
const BeastClass = mongoose.model('BeastClass', axieSchema, 'beast_classes'); // Explicitly set collection name
const AquaticClass = mongoose.model('AquaticClass', axieSchema, 'aquatic_classes');
const PlantClass = mongoose.model('PlantClass', axieSchema, 'plant_classes');
const BirdClass = mongoose.model('BirdClass', axieSchema, 'bird_classes');
const BugClass = mongoose.model('BugClass', axieSchema, 'bug_classes');
const ReptileClass = mongoose.model('ReptileClass', axieSchema, 'reptile_classes');
const MechClass = mongoose.model('MechClass', axieSchema, 'mech_classes');
const DawnClass = mongoose.model('DawnClass', axieSchema, 'dawn_classes');
const DuskClass = mongoose.model('DuskClass', axieSchema, 'dusk_classes');

// Export Models
module.exports = {
    BeastClass,
    AquaticClass,
    PlantClass,
    BirdClass,
    BugClass,
    ReptileClass,
    MechClass,
    DawnClass,
    DuskClass,
};
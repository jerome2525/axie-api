const Web3 = require('web3');  // Importing the Web3 library
const axios = require('axios'); // Importing axios for HTTP requests
const {
    BeastClass,
    AquaticClass,
    PlantClass,
    BirdClass,
    BugClass,
    ReptileClass,
    MechClass,
    DawnClass,
    DuskClass,
} = require('../models/Axie'); // Import all your class models
const dotenv = require('dotenv'); // For loading environment variables

// Load environment variables from .env file
dotenv.config();

// Define the ABI as a JavaScript array
const ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    }
];

// Create an instance of Web3 using the Infura URL from environment variables
const web3 = new Web3(process.env.INFURA_URL);

// Function to get smart contract data based on action
async function getSmartContractData(req, res) {
    const action = req.query.action;

    try {
        const contract = new web3.eth.Contract(ABI, process.env.CONTRACT_ADDRESS); 

        let result;
        switch (action) {
            case 'totalSupply':
                result = await contract.methods.totalSupply().call();
                res.json({ total_supply: result });
                break;
            case 'name':
                result = await contract.methods.name().call();
                res.json({ name: result });
                break;
            case 'symbol':
                result = await contract.methods.symbol().call();
                res.json({ symbol: result });
                break;
            case 'balanceOf':
                const address = req.query.address;
                if (!address) {
                    return res.status(400).json({ error: 'Missing address parameter.' });
                }
                result = await contract.methods.balanceOf(web3.utils.toChecksumAddress(address)).call();
                res.json({ balance: result });
                break;
            default:
                res.status(400).json({ error: 'Invalid action.' });
        }
    } catch (error) {
        console.error("Error getting smart contract data:", error); // Additional context for errors
        res.status(500).json({ error: error.message });
    }
}

// Function to fetch Axie data from the Axie API and save to the appropriate classes
async function fetchAxieData(req, res) {
    const queryAxies = `
      query {
        axies(sort: PriceAsc, from: 0, size: 300) {
          results {
            id
            name
            highestOffer {
              currentPriceUsd
            }
            class
            stage
          }
        }
      }
    `;

    try {
        const response = await axios.post(process.env.AXIE_API_URL, { query: queryAxies }, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.API_KEY
            }
        });

        console.log("Fetched Axies from API:", JSON.stringify(response.data, null, 2)); // Log full API response

        const axies = response.data.data.axies.results;

        if (!axies || axies.length === 0) {
            console.warn("No Axies found in the API response.");
            return res.status(404).json({ message: "No Axies found from the API." });
        }

        // Map Axie classes to their corresponding Mongoose models
        const classModels = {
            "Beast": BeastClass,
            "Aquatic": AquaticClass,
            "Plant": PlantClass,
            "Bird": BirdClass,
            "Bug": BugClass,
            "Reptile": ReptileClass,
            "Mech": MechClass,
            "Dawn": DawnClass,
            "Dusk": DuskClass,
        };

        // Save each Axie to the appropriate model collection
        for (let axie of axies) {
            const { id, name, class: axieClass, stage } = axie;
            const current_price_usd = axie.highestOffer ? axie.highestOffer.currentPriceUsd : 0;

            const Model = classModels[axieClass]; // Select the model based on the class

            if (Model) {
                await Model.updateOne(
                    { axie_id: id },
                    { name, stage, current_price_usd },
                    { upsert: true }
                );
                console.log(`Saved Axie: ${name} to ${axieClass} model`);
            } else {
                console.warn(`No model found for Axie class: ${axieClass}`);
            }
        }

        res.json({ message: "Axie data processed successfully!" });
    } catch (error) {
        console.error("Error fetching Axie data:", error); // Additional logging for errors
        res.status(500).json({ message: "An error occurred while fetching Axie data.", error: error.message });
    }
}

// Function to get all Axie data from the database
async function getAxieData(req, res) {
    try {
        console.log("Fetching all Axies from the database...");

        // Create an object to hold results grouped by class
        const classesWithAxies = {};

        // Array of class models to iterate over
        const classModels = [
            { name: "BeastClass", model: BeastClass },
            { name: "AquaticClass", model: AquaticClass },
            { name: "PlantClass", model: PlantClass },
            { name: "BirdClass", model: BirdClass },
            { name: "BugClass", model: BugClass },
            { name: "ReptileClass", model: ReptileClass },
            { name: "MechClass", model: MechClass },
            { name: "DawnClass", model: DawnClass },
            { name: "DuskClass", model: DuskClass },
        ];

        // Fetch Axies for each class model
        for (const { name, model } of classModels) {
            const axies = await model.find({}); // Fetch all documents for the current class

            // Create a class entry only if there are axies
            if (axies.length > 0) {
                classesWithAxies[name] = axies; // Add Axies under the class name
            } else {
                console.warn(`No Axies found in ${name}.`); // Log warning if class is empty
            }
        }

        // Check if classesWithAxies has any data, respond accordingly
        if (Object.keys(classesWithAxies).length === 0) {
            console.warn("No Axies found in any class.");
            return res.status(404).json({ message: "No Axies found." }); // Return a 404 status if empty for all classes
        }

        // console.log("Retrieved Axies by class:", classesWithAxies); // Log structured response
        res.json(classesWithAxies); // Send the structured response
    } catch (error) {
        console.error("Error fetching Axies:", error); // Log the exact error
        res.status(500).json({ error: error.message }); // Send a detailed error response
    }
}

// Export the functions for use in routes
module.exports = { getSmartContractData, fetchAxieData, getAxieData };
// Import vroomlyData from data.json file
import vroomlyData from '../data.json';
// Import fs library to CRUD json files
import fs from 'fs';

import {QuotationModel} from "./model/quotation.model";
import {InterventionsModel, PartsModel, PreferedPartPrice, WorkshopsModel} from "./model/vroomly.model";
import axios from "axios";

const quotationPath: string = 'src/output/quotation.json';
const URL: string = 'https://www.vroomly.com/backend_challenge/labour_times/';
let partsPrice : number = 0;
let servicesPrice: number;
let quotation: QuotationModel = new QuotationModel();
let hourlyRate: number = 0;
let labourTime: any;
let parts: PartsModel[] = [];
let count: number[] = [];
// TODO : Use vroomly model to simplify object manipulation
// let vroomly: VroomlyModel = new VroomlyModel(
//     vroomlyData.interventions, vroomlyData.cars,
//     vroomlyData.workshops, vroomlyData.parts
//     );

// Main start method
generateQuotation(1,1,2);

async function generateQuotation(carId: number, workshopId: number, interventionId: number) {
    await generateServicesPrices(carId, workshopId, interventionId).then(() => {
        partsPrice = generatePartsPrice(carId, workshopId, interventionId);
        // console.log('partsPrice : ' + partsPrice)
        // console.log('servicesPrice : ' + servicesPrice)
        fillQuotationModel(carId, workshopId, interventionId, partsPrice, servicesPrice);
        generateJsonQuotation();
    });
}

function generateJsonQuotation() : void {
    // TODO : Improve Json creation if the quotation.json file doesn't exist yet and other cases (corrupted file etc...)
    try {
        let stringifiedData = JSON.stringify(quotation);
        if (fs.existsSync(quotationPath)) {
            fs.readFile(quotationPath, 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                    // Combine data from the old quotation.json and the new data to add
                    stringifiedData = JSON.stringify(data+stringifiedData)
                    fs.writeFile(quotationPath, stringifiedData, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Updated quotation.json");
                    });
                }
            });
        } else {
            fs.writeFile(quotationPath, stringifiedData, (err) => {
                if (err) {
                    throw err;
                }
                console.log("Created new quotation.json");
            });
        }
    } catch(err) {
        console.error(err)
    }
}
// Calculate hourly_rate field
async function getLabourTime(carId: number, interventionId: number) : Promise<string>{
    try {
        const { data, status } = await axios.get(
            `${URL}${carId}/${interventionId}`,
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );
        // 👇️ "response status is: 200"
        // console.log('response status is: ', status);

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return error.message;
        } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}

// Calculate partsPrice field
function generatePartsPrice(carId: number, workshopId: number, interventionId: number) : number{
    // 1) First we need to know which preferred_part_price is concerned by the workshop id asked
    // TODO : simplify the way go get preferred_part_price from the good workshop
    // @ts-ignore
    let workShop: WorkshopsModel = vroomlyData.workshops.find(
        workshop => workshop.id == workshopId
    );
    let preferedPartPrice: PreferedPartPrice = workShop.preferred_part_price;
    // 2) Depending on the preferred_part_price value obtained switch
    if(preferedPartPrice !== null) {
        // @ts-ignore
        getPartsAndCount(carId, interventionId);
        switch (preferedPartPrice) {
            case PreferedPartPrice.Cheapest: {
                partsPrice = getCheapestPrice();
                break;
            }
            case PreferedPartPrice.Median: {
                partsPrice = getMedianPrice();
                break;
            }
            case PreferedPartPrice.MostExpensive: {
                partsPrice = getHigherPrice();
                break;
            }
            default: {
                console.log('Une erreur a lieu pour preferred_part_price')
                break;
            }
        }
    }
    return partsPrice;
}

function getPartsAndCount(carId: number,interventionId: number) : void {
    // @ts-ignore
    let intervention: InterventionsModel = vroomlyData.interventions.find(
        intervention => intervention.id === interventionId
    )
    for (const [, value] of Object.entries(intervention.parts_spec)) {
        // @ts-ignore
        // TODO : If possible, might select the lowest price here instead of all the parts corresponding
        // Get all parts concerned by the interventions
        parts.push(vroomlyData.parts.filter(
            part => part.car_id === carId && part.type == value.type
        ));
        // Stock count number for later calculation
        count.push(value.count);
    }
}

// TODO : Might combine getCheapest price & hgihest price because the code looks like the same
function getCheapestPrice() : number {
    // TODO : Might use another array prototype function (reducer etc...) to simply the treatment
    let lowestPrices = [];
    let prices = [];
    for(let i=0;i<parts.length;i++) {
        // @ts-ignore
        for(let part of parts[i]) {
            prices.push(part.price);
        }
        // console.log(prices);
        // console.log(Math.min(...prices));
        lowestPrices.push(Math.min(...prices));
    }
    // console.log(lowestPrices);
    for(let i=0;i<count.length;i++) {
        partsPrice = partsPrice + (count[i] * lowestPrices[i])
    }
    // console.log(partsPrice);
    return partsPrice;
}

function getHigherPrice() : number {
    let highestPrices = [];
    let prices = [];
    for(let i=0;i<parts.length;i++) {
        // @ts-ignore
        for(let part of parts[i]) {
            prices.push(part.price);
        }
        // console.log(prices);
        // console.log(Math.min(...prices));
        highestPrices.push(Math.max(...prices));
    }
    for(let i=0;i<count.length;i++) {
        partsPrice = partsPrice + (count[i] * highestPrices[i])
    }
    // console.log(partsPrice);
    return partsPrice;
}

function getMedianPrice() : number {
    let medianPrices = [];
    let prices = [];
    for(let i=0;i<parts.length;i++) {
        // @ts-ignore
        for(let part of parts[i]) {
            prices.push(part.price);
        }
        const sorted = Array.from(prices).sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            medianPrices.push((+sorted[middle - 1] + +sorted[middle]) / 2);
        } else {
            medianPrices.push(sorted[middle]);
        }
    }
    // console.log(medianPrices);

    for(let i=0;i<count.length;i++) {
        partsPrice = partsPrice + (count[i] * medianPrices[i])
    }
    // console.log(partsPrice);
    return partsPrice;
}

// Calculate servicesPrice field
async function generateServicesPrices(carId: number,workshopId: number ,interventionId: number) : Promise<number>{
    hourlyRate = getHourlyRate(workshopId);
    // console.log('hourlyRate : '+hourlyRate);
    await getLabourTime(carId, interventionId).then((value) => {
        labourTime = convertDurationtoMinutes(Object.values(value)[0])
        servicesPrice = ((labourTime * hourlyRate) / 60)
        return servicesPrice.toFixed(2);
    });
    return servicesPrice;
}

// TODO : Move this method into a service which can be globally called
function convertDurationtoMinutes(duration: string) : number{
    const [hours, minutes] = duration.split(':');
    return Number(hours) * 60 + Number(minutes);
}

function getHourlyRate(workshopId: number): number {
    // @ts-ignore
    let workshop: WorkshopsModel = vroomlyData.workshops.find(
        workshop => workshop.id === workshopId
    )
    hourlyRate = parseInt(workshop.hourly_rate);
    return hourlyRate;
}

function fillQuotationModel(
    carId: number, workshopId: number, interventionId: number, partsPrice: number, servicesPrice: number) : void {
    quotation.car_id = carId;
    quotation.workshop_id = workshopId;
    quotation.intervention_id = interventionId;
    quotation.parts_price = partsPrice;
    quotation.services_price = servicesPrice;
}
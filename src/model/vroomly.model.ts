export class VroomlyModel{
    interventions :InterventionsModel;
    cars: CarsModel;
    workshops: WorkshopsModel;
    parts: PartsModel;

    constructor(
        interventions: InterventionsModel, cars: CarsModel,
        workshops: WorkshopsModel, parts: PartsModel) {
        this.interventions = interventions;
        this.cars = cars;
        this.workshops = workshops;
        this.parts = parts;
    }
}

export interface PartsSpecModel {
    type: string;
    count: number;
}

export interface InterventionsModel{
    id: number;
    name: string;
    parts_spec: PartsSpecModel[];
}

export interface CarsModel {
    id: number;
    manufacturer: string;
    model: string;
    version: string;
}

export enum PreferedPartPrice {
    Cheapest = "cheapest",
    Median = "median",
    MostExpensive = "most_expensive"
}

export interface WorkshopsModel {
    id: number;
    name: string;
    hourly_rate: string;
    preferred_part_price: PreferedPartPrice
}

export interface PartsModel {
    id: number;
    type: string;
    car_id: number;
    price: string
}
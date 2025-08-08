import { CampusService } from './campus.service';
export declare class CampusController {
    private readonly campusService;
    constructor(campusService: CampusService);
    getFacilities(): {
        id: string;
        name: string;
        description: string;
        image: string;
        features: string[];
    }[];
    getCampusInfo(): {
        address: string;
        size: string;
        established: number;
        buildings: number;
        studentCapacity: number;
        parkingSpaces: number;
        sustainability: {
            solarPanels: boolean;
            greenBuildings: number;
            recyclingProgram: boolean;
            energyEfficient: boolean;
        };
        transportation: {
            shuttleService: boolean;
            bikeRentals: boolean;
            publicTransit: string;
            parkingPermits: boolean;
        };
    };
    getDirections(): {
        mainEntrance: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        drivingDirections: string[];
        publicTransport: string[];
        parking: {
            student: string;
            visitor: string;
            staff: string;
            rates: {
                student: string;
                visitor: string;
                staff: string;
            };
        };
    };
    getVirtualTour(): {
        tourUrl: string;
        highlights: {
            location: string;
            description: string;
            image: string;
        }[];
        interactiveMap: boolean;
        vrSupported: boolean;
    };
}
